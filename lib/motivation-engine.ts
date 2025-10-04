import { motivationEngine, type MotivationRequest } from './openai';
import { db } from './redis';
import { getTimeOfDay } from './utils';

export interface NudgeContext {
  userId: string;
  mood?: string;
  goals: string[];
  timeOfDay: string;
  streakCount: number;
  recentActivity: string[];
}

export class MotivationService {
  async generatePersonalizedNudge(context: NudgeContext): Promise<string> {
    const request: MotivationRequest = {
      userId: context.userId,
      mood: context.mood || 'focused',
      goals: context.goals,
      timeOfDay: context.timeOfDay,
      recentActivity: context.recentActivity,
      streakCount: context.streakCount,
    };

    return await motivationEngine.generateNudge(request);
  }

  async getNudgeContext(userId: string): Promise<NudgeContext> {
    // Get user data
    const user = await db.getUser(userId);
    if (!user) throw new Error('User not found');

    // Get recent mood
    const moodHistory = await db.getUserMoodHistory(userId, 1);
    const recentMood = moodHistory[0]?.mood;

    // Get user goals
    const goals = await db.getUserGoals(userId);
    const goalTitles = goals.filter(g => g.status === 'active').map(g => g.title);

    // Get streak count
    const streakCount = parseInt(user.currentStreak) || 0;

    // Get recent activity (simplified)
    const recentActivity: string[] = [];
    if (streakCount > 0) {
      recentActivity.push(`${streakCount} day streak`);
    }
    if (goals.length > 0) {
      recentActivity.push(`${goals.length} active goals`);
    }

    return {
      userId,
      mood: recentMood,
      goals: goalTitles,
      timeOfDay: getTimeOfDay(),
      streakCount,
      recentActivity,
    };
  }

  async getMotivationContent(filters: {
    category?: string;
    mood?: string;
    timeOfDay?: string;
    isPremium?: boolean;
    userStreak?: number;
  }) {
    // First try to get AI-generated content
    try {
      const context = await this.getNudgeContext(filters.userId || '');
      const aiNudge = await this.generatePersonalizedNudge(context);
      return [{
        id: 'ai-generated',
        category: filters.category || 'general',
        mood: filters.mood || context.mood || 'focused',
        timeOfDay: filters.timeOfDay || context.timeOfDay,
        text: aiNudge,
        isPremium: false,
      }];
    } catch (error) {
      console.error('AI generation failed, falling back to static content');
    }

    // Fallback to static content
    return await db.getMotivationContent({
      category: filters.category,
      mood: filters.mood,
      timeOfDay: filters.timeOfDay,
      isPremium: filters.isPremium,
    });
  }
}

export const motivationService = new MotivationService();

