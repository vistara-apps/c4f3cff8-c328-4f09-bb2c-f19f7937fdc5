'use client';

import { Users, Heart, Flame, Rocket } from 'lucide-react';

interface PodMember {
  id: string;
  name: string;
  avatar: string;
  lastWin?: string;
}

interface PodFeedProps {
  podName: string;
  members: PodMember[];
}

const reactions = [
  { icon: Heart, label: 'Love' },
  { icon: Flame, label: 'Fire' },
  { icon: Rocket, label: 'Rocket' },
];

export function PodFeed({ podName, members }: PodFeedProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          {podName}
        </h3>
        <span className="text-xs text-text-muted">{members.length} members</span>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="bg-surface-light rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{member.avatar}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{member.name}</p>
                {member.lastWin && (
                  <>
                    <p className="text-sm text-text-muted mt-1">{member.lastWin}</p>
                    <div className="flex gap-2 mt-2">
                      {reactions.map((Reaction, idx) => (
                        <button
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface hover:bg-opacity-80 transition-all duration-200"
                        >
                          <Reaction.icon className="w-4 h-4 text-text-muted" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-3 py-2 text-sm text-primary hover:text-primary-light font-medium">
        Share Your Win
      </button>
    </div>
  );
}
