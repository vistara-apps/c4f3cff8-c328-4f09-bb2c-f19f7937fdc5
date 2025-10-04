export interface User {
  fid: string;
  walletAddress?: string;
  username: string;
  joinedAt: Date;
  timezone: string;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  premiumUnlocks: string[];
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: 'launch' | 'learn' | 'create' | 'social';
  targetDate?: Date;
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
}

export interface Pod {
  id: string;
  name: string;
  createdAt: Date;
  resetDate: Date;
  category: string;
  timezone: string;
}

export interface MoodCheckIn {
  id: string;
  userId: string;
  mood: 'energized' | 'focused' | 'struggling' | 'overwhelmed' | 'celebrate';
  timestamp: Date;
  context?: string;
}

export interface ProgressLog {
  id: string;
  userId: string;
  goalId: string;
  timestamp: Date;
  isCheckIn: boolean;
  note?: string;
}

export interface WinShare {
  id: string;
  userId: string;
  podId: string;
  content: string;
  timestamp: Date;
  reactions: string[];
}

export interface MotivationContent {
  id: string;
  category: 'launch' | 'learn' | 'create' | 'social';
  mood: 'energized' | 'focused' | 'struggling' | 'overwhelmed' | 'celebrate';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  text: string;
  isPremium: boolean;
  unlockStreak?: number;
}
