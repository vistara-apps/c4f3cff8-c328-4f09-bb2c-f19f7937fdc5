import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MotivationRequest {
  userId: string;
  mood: string;
  goals: string[];
  timeOfDay: string;
  recentActivity?: string[];
  streakCount?: number;
}

export class MotivationEngine {
  private openai: OpenAI;

  constructor() {
    this.openai = openai;
  }

  async generateNudge(request: MotivationRequest): Promise<string> {
    try {
      const prompt = this.buildPrompt(request);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are Momentum, a supportive AI coach that provides personalized motivation. Keep responses concise (under 150 characters), encouraging, and actionable. Focus on the user\'s current emotional state and goals.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content?.trim() || 'Keep pushing forward! You\'ve got this! 💪';
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to static content
      return this.getFallbackNudge(request.mood, request.timeOfDay);
    }
  }

  private buildPrompt(request: MotivationRequest): string {
    const { mood, goals, timeOfDay, recentActivity, streakCount } = request;

    let prompt = `Generate a personalized motivation nudge for someone who is currently feeling ${mood}`;

    if (goals.length > 0) {
      prompt += ` and working on: ${goals.join(', ')}`;
    }

    prompt += `. It's currently ${timeOfDay}.`;

    if (streakCount && streakCount > 0) {
      prompt += ` They have a ${streakCount}-day streak going.`;
    }

    if (recentActivity && recentActivity.length > 0) {
      prompt += ` Recent activity: ${recentActivity.slice(-3).join(', ')}`;
    }

    prompt += ' Make it encouraging and specific to their situation.';

    return prompt;
  }

  private getFallbackNudge(mood: string, timeOfDay: string): string {
    const fallbacks: Record<string, Record<string, string>> = {
      energized: {
        morning: 'Great energy! Channel it into your goals today! ⚡',
        afternoon: 'Keep that momentum going strong! 💪',
        evening: 'End your day with purpose! 🌟',
      },
      focused: {
        morning: 'Perfect focus! Make this morning count! 🎯',
        afternoon: 'Stay locked in! You\'re crushing it! 🔥',
        evening: 'Wrap up strong! Tomorrow builds on today! 📈',
      },
      struggling: {
        morning: 'Every expert was once a beginner. Start small! 🌱',
        afternoon: 'Take a breath. One step at a time! 🧘',
        evening: 'Rest well. Tomorrow is a new opportunity! 🌙',
      },
      overwhelmed: {
        morning: 'Focus on just one thing today. You\'ve got this! 🎯',
        afternoon: 'Break it down. One task at a time! 📝',
        evening: 'You made it through today. Be proud! 🌟',
      },
      celebrate: {
        morning: 'Yesterday\'s wins fuel today\'s momentum! 🎉',
        afternoon: 'Keep celebrating progress! You deserve it! 🏆',
        evening: 'What a day! Rest and recharge for more wins! ✨',
      },
    };

    return fallbacks[mood]?.[timeOfDay] || 'Keep moving forward! Every step counts! 🚀';
  }
}

export const motivationEngine = new MotivationEngine();

