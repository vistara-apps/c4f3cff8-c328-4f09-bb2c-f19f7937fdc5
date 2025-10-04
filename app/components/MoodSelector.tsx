'use client';

import { useState } from 'react';

const moods = [
  { emoji: '⚡', label: 'Energized', value: 'energized' },
  { emoji: '🎯', label: 'Focused', value: 'focused' },
  { emoji: '😓', label: 'Struggling', value: 'struggling' },
  { emoji: '😰', label: 'Overwhelmed', value: 'overwhelmed' },
  { emoji: '🎉', label: 'Celebrate', value: 'celebrate' },
];

export function MoodSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    // Trigger mood check-in action
    console.log('Mood selected:', value);
  };

  return (
    <div className="flex justify-between gap-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => handleSelect(mood.value)}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 ${
            selected === mood.value
              ? 'bg-primary bg-opacity-20 border-2 border-primary scale-110'
              : 'bg-surface-light hover:bg-opacity-80'
          }`}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs text-text-muted">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}
