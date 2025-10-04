import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Database operations
export class Database {
  private redis: Redis;

  constructor() {
    this.redis = redis;
  }

  // User operations
  async getUser(fid: string) {
    const user = await this.redis.hgetall(`user:${fid}`);
    return user && Object.keys(user).length > 0 ? user : null;
  }

  async createUser(user: any) {
    const userKey = `user:${user.fid}`;
    await this.redis.hset(userKey, {
      ...user,
      joinedAt: user.joinedAt.toISOString(),
    });
    return user;
  }

  async updateUser(fid: string, updates: any) {
    const userKey = `user:${fid}`;
    const updatedUser = { ...updates };
    if (updates.joinedAt) {
      updatedUser.joinedAt = updates.joinedAt.toISOString();
    }
    await this.redis.hset(userKey, updatedUser);
    return this.getUser(fid);
  }

  // Goal operations
  async getUserGoals(userId: string) {
    const goalIds = await this.redis.smembers(`user:${userId}:goals`);
    const goals = [];
    for (const goalId of goalIds) {
      const goal = await this.redis.hgetall(`goal:${goalId}`);
      if (goal && Object.keys(goal).length > 0) {
        goals.push({
          ...goal,
          createdAt: new Date(goal.createdAt),
          targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
        });
      }
    }
    return goals;
  }

  async createGoal(goal: any) {
    const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const goalKey = `goal:${goalId}`;
    await this.redis.hset(goalKey, {
      ...goal,
      id: goalId,
      createdAt: goal.createdAt.toISOString(),
      targetDate: goal.targetDate?.toISOString(),
    });
    await this.redis.sadd(`user:${goal.userId}:goals`, goalId);
    return { ...goal, id: goalId };
  }

  // Pod operations
  async getPod(podId: string) {
    const pod = await this.redis.hgetall(`pod:${podId}`);
    if (!pod || Object.keys(pod).length === 0) return null;

    const members = await this.redis.smembers(`pod:${podId}:members`);
    return {
      ...pod,
      createdAt: new Date(pod.createdAt),
      resetDate: new Date(pod.resetDate),
      members,
    };
  }

  async createPod(pod: any) {
    const podId = `pod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const podKey = `pod:${podId}`;
    await this.redis.hset(podKey, {
      ...pod,
      id: podId,
      createdAt: pod.createdAt.toISOString(),
      resetDate: pod.resetDate.toISOString(),
    });
    return { ...pod, id: podId };
  }

  async addUserToPod(podId: string, userId: string) {
    await this.redis.sadd(`pod:${podId}:members`, userId);
    await this.redis.set(`user:${userId}:pod`, podId);
  }

  // Mood check-in operations
  async createMoodCheckIn(checkIn: any) {
    const checkInId = `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const checkInKey = `mood:${checkInId}`;
    await this.redis.hset(checkInKey, {
      ...checkIn,
      id: checkInId,
      timestamp: checkIn.timestamp.toISOString(),
    });
    await this.redis.zadd(`user:${checkIn.userId}:moods`, checkIn.timestamp.getTime(), checkInId);
    return { ...checkIn, id: checkInId };
  }

  async getUserMoodHistory(userId: string, limit = 10) {
    const checkInIds = await this.redis.zrevrange(`user:${userId}:moods`, 0, limit - 1);
    const checkIns = [];
    for (const checkInId of checkInIds) {
      const checkIn = await this.redis.hgetall(`mood:${checkInId}`);
      if (checkIn && Object.keys(checkIn).length > 0) {
        checkIns.push({
          ...checkIn,
          timestamp: new Date(checkIn.timestamp),
        });
      }
    }
    return checkIns;
  }

  // Progress log operations
  async createProgressLog(log: any) {
    const logId = `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const logKey = `progress:${logId}`;
    await this.redis.hset(logKey, {
      ...log,
      id: logId,
      timestamp: log.timestamp.toISOString(),
    });
    await this.redis.zadd(`user:${log.userId}:progress`, log.timestamp.getTime(), logId);
    await this.redis.zadd(`goal:${log.goalId}:progress`, log.timestamp.getTime(), logId);
    return { ...log, id: logId };
  }

  // Win share operations
  async createWinShare(win: any) {
    const winId = `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const winKey = `win:${winId}`;
    await this.redis.hset(winKey, {
      ...win,
      id: winId,
      timestamp: win.timestamp.toISOString(),
      reactions: JSON.stringify(win.reactions),
    });
    await this.redis.zadd(`pod:${win.podId}:wins`, win.timestamp.getTime(), winId);
    return { ...win, id: winId };
  }

  async getPodWins(podId: string, limit = 20) {
    const winIds = await this.redis.zrevrange(`pod:${podId}:wins`, 0, limit - 1);
    const wins = [];
    for (const winId of winIds) {
      const win = await this.redis.hgetall(`win:${winId}`);
      if (win && Object.keys(win).length > 0) {
        wins.push({
          ...win,
          timestamp: new Date(win.timestamp),
          reactions: JSON.parse(win.reactions || '[]'),
        });
      }
    }
    return wins;
  }

  async addReactionToWin(winId: string, userId: string) {
    const winKey = `win:${winId}`;
    const win = await this.redis.hgetall(winKey);
    if (!win) return null;

    const reactions = JSON.parse(win.reactions || '[]');
    if (!reactions.includes(userId)) {
      reactions.push(userId);
      await this.redis.hset(winKey, { reactions: JSON.stringify(reactions) });
    }
    return reactions;
  }

  // Motivation content operations
  async getMotivationContent(filters: {
    category?: string;
    mood?: string;
    timeOfDay?: string;
    isPremium?: boolean;
  }) {
    // For simplicity, we'll store motivation content in a set and filter in memory
    // In production, you might want to use Redis search or a more sophisticated indexing
    const contentIds = await this.redis.smembers('motivation:content');
    const content = [];

    for (const contentId of contentIds) {
      const item = await this.redis.hgetall(`motivation:${contentId}`);
      if (item && Object.keys(item).length > 0) {
        const matches = (
          (!filters.category || item.category === filters.category) &&
          (!filters.mood || item.mood === filters.mood) &&
          (!filters.timeOfDay || item.timeOfDay === filters.timeOfDay) &&
          (filters.isPremium === undefined || item.isPremium === filters.isPremium.toString())
        );

        if (matches) {
          content.push({
            ...item,
            isPremium: item.isPremium === 'true',
            unlockStreak: item.unlockStreak ? parseInt(item.unlockStreak) : undefined,
          });
        }
      }
    }

    return content;
  }

  async createMotivationContent(content: any) {
    const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contentKey = `motivation:${contentId}`;
    await this.redis.hset(contentKey, {
      ...content,
      id: contentId,
      isPremium: content.isPremium.toString(),
      unlockStreak: content.unlockStreak?.toString(),
    });
    await this.redis.sadd('motivation:content', contentId);
    return { ...content, id: contentId };
  }
}

export const db = new Database();

