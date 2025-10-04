'use client';

import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  variant?: 'compact' | 'hero';
}

export function StreakCounter({ streak, variant = 'compact' }: StreakCounterProps) {
  if (variant === 'hero') {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          <Flame className="w-24 h-24 text-warning streak-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{streak}</span>
          </div>
        </div>
        <p className="mt-4 text-lg font-medium text-text-muted">Day Streak</p>
        <p className="text-sm text-text-muted">Keep the momentum going! 🚀</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Flame className="w-6 h-6 text-warning" />
        <div>
          <p className="text-sm font-medium text-text-muted">Current Streak</p>
          <p className="text-2xl font-bold gradient-text">{streak} days</p>
        </div>
      </div>
      {streak >= 7 && (
        <div className="glass-card px-3 py-1 text-xs font-medium text-accent">
          🎉 Milestone!
        </div>
      )}
    </div>
  );
}
