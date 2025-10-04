'use client';

import { Lock } from 'lucide-react';

interface NudgeCardProps {
  message: string;
  variant?: 'default' | 'premium';
  isPremium?: boolean;
}

export function NudgeCard({ message, variant = 'default', isPremium = false }: NudgeCardProps) {
  if (variant === 'premium' && isPremium) {
    return (
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-pink-500 opacity-10" />
        <div className="relative flex items-start gap-4">
          <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Premium Content Locked</h3>
            <p className="text-text-muted text-sm mb-4">
              Unlock exclusive motivational content packs to level up your game.
            </p>
            <button className="btn-primary text-sm">
              Unlock for 0.0005 ETH
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 slide-up">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">💪</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-text-muted mb-1">Today's Nudge</h3>
          <p className="text-lg leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary flex-1">I Did It! ✓</button>
        <button className="btn-outline flex-1">Working On It</button>
      </div>
    </div>
  );
}
