'use client';

import { type ReactNode } from 'react';

interface FrameShellProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
}

export function FrameShell({ children, variant = 'default' }: FrameShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>
      
      {/* Content */}
      <div className="relative max-w-md mx-auto">
        {variant === 'glass' ? (
          <div className="glass-card min-h-screen">{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
