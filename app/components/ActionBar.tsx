'use client';

import { Home, Target, Users, Settings2 } from 'lucide-react';
import { useState } from 'react';

export function ActionBar() {
  const [active, setActive] = useState('home');

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'pod', icon: Users, label: 'Pod' },
    { id: 'settings', icon: Settings2, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="max-w-md mx-auto glass-card border-t border-white border-opacity-10">
        <div className="flex items-center justify-around px-4 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-text-muted hover:text-fg'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
