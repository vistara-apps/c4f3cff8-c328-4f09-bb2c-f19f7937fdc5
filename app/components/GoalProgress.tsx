'use client';

import { useState, useEffect } from 'react';
import { Target, CheckCircle2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Goal {
  id: string;
  title: string;
  progress: number;
  category: 'launch' | 'learn' | 'create' | 'social';
  status: 'active' | 'paused' | 'completed';
}

interface GoalProgressProps {
  goals?: Goal[];
  onGoalUpdate?: () => void;
}

const categoryColors = {
  launch: 'from-blue-500 to-cyan-500',
  learn: 'from-purple-500 to-pink-500',
  create: 'from-orange-500 to-red-500',
  social: 'from-green-500 to-teal-500',
};

export function GoalProgress({ goals: initialGoals, onGoalUpdate }: GoalProgressProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>(initialGoals || []);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'launch' | 'learn' | 'create' | 'social'>('launch');

  useEffect(() => {
    if (user && !initialGoals) {
      fetchGoals();
    }
  }, [user, initialGoals]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/goals?userId=${user.fid}`);
      if (response.ok) {
        const userGoals = await response.json();
        // Calculate progress based on recent activity (simplified)
        const goalsWithProgress = userGoals.map((goal: any) => ({
          ...goal,
          progress: Math.floor(Math.random() * 80) + 20, // Mock progress calculation
        }));
        setGoals(goalsWithProgress);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const handleAddGoal = async () => {
    if (!user || !newGoalTitle.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.fid,
          title: newGoalTitle.trim(),
          category: newGoalCategory,
        }),
      });

      if (response.ok) {
        setNewGoalTitle('');
        setShowAddForm(false);
        await fetchGoals();
        onGoalUpdate?.();
      }
    } catch (error) {
      console.error('Failed to add goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Your Goals
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm text-primary hover:text-primary-light flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 bg-surface-light rounded-lg">
          <input
            type="text"
            placeholder="Enter your goal..."
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-surface border border-surface-light focus:border-primary outline-none"
          />
          <div className="flex gap-2 mb-2">
            {Object.keys(categoryColors).map((category) => (
              <button
                key={category}
                onClick={() => setNewGoalCategory(category as any)}
                className={`px-3 py-1 rounded text-xs ${
                  newGoalCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted hover:bg-opacity-80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddGoal}
              disabled={loading || !newGoalTitle.trim()}
              className="btn-primary text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Goal'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-outline text-sm flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {goals.filter(goal => goal.status === 'active').map((goal) => (
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

        {goals.filter(goal => goal.status === 'active').length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No active goals yet.</p>
            <p className="text-xs">Add your first goal to start tracking progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}
