import { FrameShell } from './components/FrameShell';
import { StreakCounter } from './components/StreakCounter';
import { MoodSelector } from './components/MoodSelector';
import { NudgeCard } from './components/NudgeCard';
import { GoalProgress } from './components/GoalProgress';
import { PodFeed } from './components/PodFeed';
import { ActionBar } from './components/ActionBar';

export default function Home() {
  return (
    <FrameShell>
      <div className="flex flex-col min-h-screen">
        {/* Header with Streak Counter */}
        <header className="sticky top-0 z-10 glass-card px-4 py-3 mb-4">
          <StreakCounter streak={7} variant="compact" />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 space-y-4 pb-24">
          {/* Today's Nudge */}
          <NudgeCard
            message="It's 9am Monday — time to crush that launch goal. What's one thing you'll ship today?"
            variant="default"
          />

          {/* Mood Check-In */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-text-muted mb-3">How are you feeling?</h3>
            <MoodSelector />
          </div>

          {/* Goal Progress */}
          <GoalProgress
            goals={[
              { id: '1', title: 'Launch my first app', progress: 65, category: 'launch' },
              { id: '2', title: 'Learn Solidity', progress: 30, category: 'learn' },
            ]}
          />

          {/* Pod Activity Feed */}
          <PodFeed
            podName="Launch Squad"
            members={[
              { id: '1', name: 'Alex', avatar: '🚀', lastWin: 'Shipped landing page!' },
              { id: '2', name: 'Sam', avatar: '💪', lastWin: 'Got first user signup' },
              { id: '3', name: 'Jordan', avatar: '🔥', lastWin: 'Fixed critical bug' },
            ]}
          />
        </main>

        {/* Fixed Bottom Action Bar */}
        <ActionBar />
      </div>
    </FrameShell>
  );
}
