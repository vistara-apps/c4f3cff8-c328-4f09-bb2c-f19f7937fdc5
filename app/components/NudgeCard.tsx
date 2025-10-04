'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePayments } from '@/hooks/usePayments';

interface NudgeCardProps {
  message: string;
  variant?: 'default' | 'premium';
  isPremium?: boolean;
  goalId?: string;
  onProgressLogged?: () => void;
}

export function NudgeCard({
  message,
  variant = 'default',
  isPremium = false,
  goalId,
  onProgressLogged
}: NudgeCardProps) {
  const { user } = useAuth();
  const { processPayment, unlockWithStreak, loading: paymentLoading } = usePayments();
  const [loading, setLoading] = useState(false);

  const handleProgressLog = async (isCheckIn: boolean) => {
    if (!user || !goalId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.fid,
          goalId,
          isCheckIn,
        }),
      });

      if (response.ok) {
        onProgressLogged?.();
      }
    } catch (error) {
      console.error('Failed to log progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (method: 'payment' | 'streak') => {
    if (!user) return;

    if (method === 'streak') {
      const success = await unlockWithStreak(user.fid, 'premium_pack_1', 7);
      if (success) {
        onProgressLogged?.();
      }
    } else {
      const result = await processPayment({
        userId: user.fid,
        amount: '0.0005',
        description: 'Unlock Premium Motivation Pack',
        itemId: 'premium_pack_1',
      });

      if (result.success) {
        onProgressLogged?.();
      }
    }
  };

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
            <div className="flex gap-2">
              <button
                onClick={() => handleUnlock('streak')}
                disabled={paymentLoading}
                className="btn-primary text-sm flex-1"
              >
                Unlock with 7-Day Streak
              </button>
              <button
                onClick={() => handleUnlock('payment')}
                disabled={paymentLoading}
                className="btn-outline text-sm flex-1"
              >
                Buy for 0.0005 ETH
              </button>
            </div>
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
        <button
          onClick={() => handleProgressLog(true)}
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging...' : 'I Did It! ✓'}
        </button>
        <button
          onClick={() => handleProgressLog(false)}
          disabled={loading}
          className="btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Working On It
        </button>
      </div>
    </div>
  );
}
