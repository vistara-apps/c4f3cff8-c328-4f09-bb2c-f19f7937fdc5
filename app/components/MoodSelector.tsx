'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const moods = [
  { emoji: '⚡', label: 'Energized', value: 'energized' },
  { emoji: '🎯', label: 'Focused', value: 'focused' },
  { emoji: '😓', label: 'Struggling', value: 'struggling' },
  { emoji: '😰', label: 'Overwhelmed', value: 'overwhelmed' },
  { emoji: '🎉', label: 'Celebrate', value: 'celebrate' },
];

interface MoodSelectorProps {
  onMoodSelect?: (mood: string) => void;
  variant?: 'emoji-only' | 'with-label';
}

export function MoodSelector({ onMoodSelect, variant = 'with-label' }: MoodSelectorProps) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (value: string) => {
    if (!user) return;

    setSelected(value);
    setLoading(true);

    try {
      // Log mood check-in
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.fid,
          mood: value,
        }),
      });

      if (response.ok) {
        onMoodSelect?.(value);
      }
    } catch (error) {
      console.error('Failed to log mood:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex ${variant === 'emoji-only' ? 'justify-center gap-4' : 'justify-between gap-2'}`}>
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => handleSelect(mood.value)}
          disabled={loading}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 ${
            selected === mood.value
              ? 'bg-primary bg-opacity-20 border-2 border-primary scale-110'
              : 'bg-surface-light hover:bg-opacity-80'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-2xl">{mood.emoji}</span>
          {variant === 'with-label' && (
            <span className="text-xs text-text-muted">{mood.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
