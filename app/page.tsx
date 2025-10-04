'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FrameShell } from './components/FrameShell';
import { StreakCounter } from './components/StreakCounter';
import { MoodSelector } from './components/MoodSelector';
import { NudgeCard } from './components/NudgeCard';
import { GoalProgress } from './components/GoalProgress';
import { PodFeed } from './components/PodFeed';
import { ActionBar } from './components/ActionBar';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [currentNudge, setCurrentNudge] = useState<string>('');
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/onboarding');
        return;
      }
      fetchUserData();
    }
  }, [user, authLoading, router]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Get user data
      const userResponse = await fetch(`/api/users?fid=${user.fid}`);
      if (userResponse.ok) {
        const userInfo = await userResponse.json();
        setUserData(userInfo);
      }

      // Get goals
      const goalsResponse = await fetch(`/api/goals?userId=${user.fid}`);
      if (goalsResponse.ok) {
        const userGoals = await goalsResponse.json();
        setGoals(userGoals);
      }

      // Generate today's nudge
      const nudgeResponse = await fetch('/api/generate-nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.fid }),
      });

      if (nudgeResponse.ok) {
        const { nudge } = await nudgeResponse.json();
        setCurrentNudge(nudge);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = () => {
    // Refresh nudge after mood change
    fetchUserData();
  };

  const handleProgressLogged = () => {
    // Refresh user data and goals
    fetchUserData();
  };

  const handleGoalUpdate = () => {
    // Refresh goals
    fetchUserData();
  };

  const handleWinShared = () => {
    // Could refresh pod data here if needed
  };

  if (authLoading || loading) {
    return (
      <FrameShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-text-muted">Loading your momentum...</p>
          </div>
        </div>
      </FrameShell>
    );
  }

  if (!user || !userData) {
    return null; // Will redirect to onboarding
  }

  const streakCount = parseInt(userData.currentStreak) || 0;
  const firstGoal = goals.find(g => g.status === 'active');

  return (
    <FrameShell>
      <div className="flex flex-col min-h-screen">
        {/* Header with Streak Counter */}
        <header className="sticky top-0 z-10 glass-card px-4 py-3 mb-4">
          <StreakCounter streak={streakCount} variant="compact" />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 space-y-4 pb-24">
          {/* Today's Nudge */}
          {currentNudge && (
            <NudgeCard
              message={currentNudge}
              variant="default"
              goalId={firstGoal?.id}
              onProgressLogged={handleProgressLogged}
            />
          )}

          {/* Mood Check-In */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-text-muted mb-3">How are you feeling?</h3>
            <MoodSelector variant="emoji-only" onMoodSelect={handleMoodSelect} />
          </div>

          {/* Goal Progress */}
          <GoalProgress onGoalUpdate={handleGoalUpdate} />

          {/* Pod Activity Feed */}
          <PodFeed onWinShared={handleWinShared} />
        </main>

        {/* Fixed Bottom Action Bar */}
        <ActionBar />
      </div>
    </FrameShell>
  );
}
