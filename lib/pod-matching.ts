import { db } from './redis';

export interface PodMatch {
  podId: string;
  name: string;
  category: string;
  memberCount: number;
  timezone: string;
  compatibility: number; // 0-100 score
}

export class PodMatchingService {
  async findPodMatches(userId: string, limit = 3): Promise<PodMatch[]> {
    try {
      // Get user data
      const user = await db.getUser(userId);
      if (!user) throw new Error('User not found');

      // Get user goals
      const goals = await db.getUserGoals(userId);
      const userCategories = [...new Set(goals.map(g => g.category))];
      const userTimezone = user.timezone;

      // Get all pods (simplified - in production you'd use a more efficient query)
      const podKeys = await db.redis.keys('pod:*');
      const pods: PodMatch[] = [];

      for (const podKey of podKeys) {
        const podId = podKey.replace('pod:', '');
        const pod = await db.getPod(podId);

        if (pod && pod.members.length < 5) { // Max 5 members per pod
          const compatibility = this.calculateCompatibility(
            userCategories,
            userTimezone,
            pod.category,
            pod.timezone,
            pod.members.length
          );

          pods.push({
            podId,
            name: pod.name,
            category: pod.category,
            memberCount: pod.members.length,
            timezone: pod.timezone,
            compatibility,
          });
        }
      }

      // Sort by compatibility and return top matches
      return pods
        .sort((a, b) => b.compatibility - a.compatibility)
        .slice(0, limit);

    } catch (error) {
      console.error('Pod matching error:', error);
      return [];
    }
  }

  async createOrFindPod(userId: string, preferredCategory?: string): Promise<string> {
    try {
      // Get user data
      const user = await db.getUser(userId);
      if (!user) throw new Error('User not found');

      const userGoals = await db.getUserGoals(userId);
      const userCategory = preferredCategory || userGoals[0]?.category || 'general';

      // Try to find an existing pod with space
      const matches = await this.findPodMatches(userId, 10);
      const availablePod = matches.find(match => match.memberCount < 5);

      if (availablePod) {
        await db.addUserToPod(availablePod.podId, userId);
        return availablePod.podId;
      }

      // Create a new pod
      const podName = this.generatePodName(userCategory);
      const newPod = await db.createPod({
        name: podName,
        createdAt: new Date(),
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        category: userCategory,
        timezone: user.timezone,
      });

      await db.addUserToPod(newPod.id, userId);
      return newPod.id;

    } catch (error) {
      console.error('Create/find pod error:', error);
      throw error;
    }
  }

  private calculateCompatibility(
    userCategories: string[],
    userTimezone: string,
    podCategory: string,
    podTimezone: string,
    memberCount: number
  ): number {
    let score = 0;

    // Category match (40 points)
    if (userCategories.includes(podCategory)) {
      score += 40;
    } else if (userCategories.some(cat => this.areCategoriesRelated(cat, podCategory))) {
      score += 20;
    }

    // Timezone match (30 points)
    if (userTimezone === podTimezone) {
      score += 30;
    } else if (this.areTimezonesCompatible(userTimezone, podTimezone)) {
      score += 15;
    }

    // Pod size preference (20 points) - prefer pods with 2-4 members
    if (memberCount >= 2 && memberCount <= 4) {
      score += 20;
    } else if (memberCount === 1) {
      score += 15;
    } else if (memberCount === 0) {
      score += 10;
    }

    // Small random factor to avoid identical scores
    score += Math.floor(Math.random() * 5);

    return Math.min(score, 100);
  }

  private areCategoriesRelated(cat1: string, cat2: string): boolean {
    const relatedCategories: Record<string, string[]> = {
      launch: ['create', 'learn'],
      learn: ['create', 'launch'],
      create: ['launch', 'learn'],
      social: ['launch', 'create'],
    };

    return relatedCategories[cat1]?.includes(cat2) || false;
  }

  private areTimezonesCompatible(tz1: string, tz2: string): boolean {
    // Simple timezone compatibility - within 3 hours
    const tz1Offset = this.parseTimezoneOffset(tz1);
    const tz2Offset = this.parseTimezoneOffset(tz2);

    return Math.abs(tz1Offset - tz2Offset) <= 3;
  }

  private parseTimezoneOffset(timezone: string): number {
    const match = timezone.match(/UTC([+-])(\d{1,2}):?(\d{2})?/);
    if (!match) return 0;

    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2]) || 0;
    const minutes = parseInt(match[3]) || 0;

    return sign * (hours + minutes / 60);
  }

  private generatePodName(category: string): string {
    const adjectives = ['Motivated', 'Driven', 'Focused', 'Ambitious', 'Dedicated', 'Resilient', 'Progressive', 'Innovative'];
    const nouns = {
      launch: ['Launchers', 'Founders', 'Starters', 'Pioneers'],
      learn: ['Learners', 'Students', 'Scholars', 'Explorers'],
      create: ['Creators', 'Makers', 'Builders', 'Artists'],
      social: ['Connectors', 'Networkers', 'Community', 'Leaders'],
      general: ['Achievers', 'Doers', 'Movers', 'Shakers'],
    };

    const categoryNouns = nouns[category as keyof typeof nouns] || nouns.general;
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = categoryNouns[Math.floor(Math.random() * categoryNouns.length)];

    return `${adjective} ${noun}`;
  }
}

export const podMatchingService = new PodMatchingService();

