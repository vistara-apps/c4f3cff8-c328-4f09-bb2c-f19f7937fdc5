'use client';

import { Home, Target, Users, Settings2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function ActionBar() {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = (path: string) => {
    if (path === '/') return 'home';
    if (path === '/goals') return 'goals';
    if (path === '/pod') return 'pod';
    if (path === '/settings') return 'settings';
    return 'home';
  };

  const [active, setActive] = useState(getActiveTab(pathname));

  useEffect(() => {
    setActive(getActiveTab(pathname));
  }, [pathname]);

  const tabs = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'goals', icon: Target, label: 'Goals', path: '/goals' },
    { id: 'pod', icon: Users, label: 'Pod', path: '/pod' },
    { id: 'settings', icon: Settings2, label: 'Settings', path: '/settings' },
  ];

  const handleTabClick = (tabId: string, path: string) => {
    setActive(tabId);
    router.push(path);
  };

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
                onClick={() => handleTabClick(tab.id, tab.path)}
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
