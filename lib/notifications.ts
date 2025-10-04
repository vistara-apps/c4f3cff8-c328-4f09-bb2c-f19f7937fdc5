import { db } from './redis';

export interface NotificationRequest {
  userId: string;
  title: string;
  body: string;
  type: 'nudge' | 'pod_win' | 'milestone' | 'premium_unlock';
  data?: Record<string, any>;
}

export class NotificationService {
  private userQuietHours: Record<string, { start: number; end: number }> = {
    default: { start: 22, end: 7 }, // 10pm to 7am
  };

  async scheduleNotification(request: NotificationRequest): Promise<boolean> {
    try {
      // Check if user is in quiet hours
      if (this.isInQuietHours(request.userId)) {
        // Schedule for next available time
        const nextAvailableTime = this.getNextAvailableTime(request.userId);
        // In a real implementation, you'd use a job queue like Bull or similar
        console.log(`Scheduling notification for ${nextAvailableTime.toISOString()}`);
      }

      // For now, we'll simulate sending the notification
      // In production, this would integrate with Farcaster Hubs
      const success = await this.sendNotification(request);

      if (success) {
        // Log notification in database for analytics
        await this.logNotification(request);
      }

      return success;
    } catch (error) {
      console.error('Notification scheduling error:', error);
      return false;
    }
  }

  async sendDailyNudge(userId: string): Promise<boolean> {
    try {
      const user = await db.getUser(userId);
      if (!user) return false;

      // Generate personalized nudge
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-nudge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) return false;

      const { nudge } = await response.json();

      const notification: NotificationRequest = {
        userId,
        title: '🔥 Your Daily Momentum',
        body: nudge,
        type: 'nudge',
        data: { nudge },
      };

      return await this.scheduleNotification(notification);
    } catch (error) {
      console.error('Daily nudge error:', error);
      return false;
    }
  }

  async notifyPodWin(podId: string, winId: string, excludeUserId: string): Promise<void> {
    try {
      const pod = await db.getPod(podId);
      if (!pod) return;

      const win = await db.redis.hgetall(`win:${winId}`);
      if (!win) return;

      const notification: NotificationRequest = {
        userId: '', // Will be set for each user
        title: '🎉 Pod Win Shared!',
        body: `${win.content.substring(0, 50)}... React to cheer them on!`,
        type: 'pod_win',
        data: { winId, podId },
      };

      // Send to all pod members except the one who shared
      for (const memberId of pod.members) {
        if (memberId !== excludeUserId) {
          notification.userId = memberId;
          await this.scheduleNotification(notification);
        }
      }
    } catch (error) {
      console.error('Pod win notification error:', error);
    }
  }

  async notifyMilestone(userId: string, milestone: number): Promise<boolean> {
    const notification: NotificationRequest = {
      userId,
      title: `🎉 ${milestone} Day Streak!`,
      body: `You've hit a ${milestone}-day streak! Keep the momentum going!`,
      type: 'milestone',
      data: { milestone },
    };

    return await this.scheduleNotification(notification);
  }

  async notifyPremiumUnlock(userId: string, itemName: string): Promise<boolean> {
    const notification: NotificationRequest = {
      userId,
      title: '✨ Premium Unlocked!',
      body: `${itemName} is now available in your premium collection!`,
      type: 'premium_unlock',
      data: { itemName },
    };

    return await this.scheduleNotification(notification);
  }

  private async sendNotification(request: NotificationRequest): Promise<boolean> {
    // In production, this would send to Farcaster Hubs
    // For now, we'll just log it
    console.log('Sending notification:', {
      userId: request.userId,
      title: request.title,
      body: request.body,
      type: request.type,
    });

    // Simulate API call to Farcaster
    try {
      // This would be a real API call to Farcaster notification service
      // const response = await fetch('https://hubs.airstack.xyz/v1/notifications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     fid: request.userId,
      //     title: request.title,
      //     body: request.body,
      //     data: request.data,
      //   }),
      // });

      return true; // Simulate success
    } catch (error) {
      console.error('Notification send error:', error);
      return false;
    }
  }

  private async logNotification(request: NotificationRequest): Promise<void> {
    try {
      const logId = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.redis.hset(`notification:${logId}`, {
        ...request,
        timestamp: new Date().toISOString(),
        delivered: true,
      });
    } catch (error) {
      console.error('Notification logging error:', error);
    }
  }

  private isInQuietHours(userId: string): boolean {
    const user = this.userQuietHours[userId] || this.userQuietHours.default;
    const now = new Date();
    const currentHour = now.getHours();

    if (user.start > user.end) {
      // Quiet hours span midnight (e.g., 22:00 to 07:00)
      return currentHour >= user.start || currentHour < user.end;
    } else {
      // Quiet hours within same day
      return currentHour >= user.start && currentHour < user.end;
    }
  }

  private getNextAvailableTime(userId: string): Date {
    const user = this.userQuietHours[userId] || this.userQuietHours.default;
    const now = new Date();
    const nextAvailable = new Date(now);

    if (this.isInQuietHours(userId)) {
      // If in quiet hours, schedule for end of quiet hours
      nextAvailable.setHours(user.end, 0, 0, 0);
      if (nextAvailable <= now) {
        nextAvailable.setDate(nextAvailable.getDate() + 1);
      }
    } else {
      // Schedule for next optimal time (e.g., 1 hour from now)
      nextAvailable.setHours(nextAvailable.getHours() + 1);
    }

    return nextAvailable;
  }

  async updateUserQuietHours(userId: string, start: number, end: number): Promise<void> {
    this.userQuietHours[userId] = { start, end };
  }
}

export const notificationService = new NotificationService();

