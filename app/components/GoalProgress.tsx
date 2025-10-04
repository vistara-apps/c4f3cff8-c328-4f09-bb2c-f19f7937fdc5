'use client';

import { Target, CheckCircle2 } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  progress: number;
  category: 'launch' | 'learn' | 'create' | 'social';
}

interface GoalProgressProps {
  goals: Goal[];
}

const categoryColors = {
  launch: 'from-blue-500 to-cyan-500',
  learn: 'from-purple-500 to-pink-500',
  create: 'from-orange-500 to-red-500',
  social: 'from-green-500 to-teal-500',
};

export function GoalProgress({ goals }: GoalProgressProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Your Goals
        </h3>
        <button className="text-sm text-primary hover:text-primary-light">
          + Add Goal
        </button>
      </div>
      
      <div className="space-y-3">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-surface-light rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-sm">{goal.title}</p>
              {goal.progress === 100 && (
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
              )}
            </div>
            
            <div className="relative h-2 bg-surface rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${categoryColors[goal.category]} transition-all duration-300`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            
            <p className="text-xs text-text-muted mt-1">{goal.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}
