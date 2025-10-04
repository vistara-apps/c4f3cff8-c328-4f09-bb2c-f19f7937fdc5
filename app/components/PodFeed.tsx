'use client';

import { useState, useEffect } from 'react';
import { Users, Heart, Flame, Rocket, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PodMember {
  id: string;
  name: string;
  avatar: string;
  lastWin?: string;
}

interface WinShare {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  reactions: string[];
}

interface PodFeedProps {
  podName?: string;
  members?: PodMember[];
  onWinShared?: () => void;
}

const reactions = [
  { icon: Heart, label: 'Love', emoji: '❤️' },
  { icon: Flame, label: 'Fire', emoji: '🔥' },
  { icon: Rocket, label: 'Rocket', emoji: '🚀' },
];

export function PodFeed({ podName: initialPodName, members: initialMembers, onWinShared }: PodFeedProps) {
  const { user } = useAuth();
  const [podName, setPodName] = useState(initialPodName || 'Loading...');
  const [members, setMembers] = useState<PodMember[]>(initialMembers || []);
  const [wins, setWins] = useState<WinShare[]>([]);
  const [showShareForm, setShowShareForm] = useState(false);
  const [winContent, setWinContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [podId, setPodId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPodData();
    }
  }, [user]);

  const fetchPodData = async () => {
    if (!user) return;

    try {
      // Get user's pod
      const userData = await fetch(`/api/users?fid=${user.fid}`).then(r => r.json());
      if (!userData.podId) {
        // User doesn't have a pod yet, try to match them
        const matchResponse = await fetch('/api/pods/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.fid }),
        });

        if (matchResponse.ok) {
          const { podId: newPodId } = await matchResponse.json();
          setPodId(newPodId);
          await fetchPodDetails(newPodId);
        }
        return;
      }

      setPodId(userData.podId);
      await fetchPodDetails(userData.podId);
    } catch (error) {
      console.error('Failed to fetch pod data:', error);
    }
  };

  const fetchPodDetails = async (podIdToFetch: string) => {
    try {
      // Get pod info
      const podResponse = await fetch(`/api/pods?podId=${podIdToFetch}`);
      if (podResponse.ok) {
        const pod = await podResponse.json();
        setPodName(pod.name);

        // Get pod members (simplified - just show current user for now)
        setMembers([{
          id: user!.fid,
          name: user!.username,
          avatar: '👤',
        }]);
      }

      // Get recent wins
      const winsResponse = await fetch(`/api/wins?podId=${podIdToFetch}&limit=10`);
      if (winsResponse.ok) {
        const podWins = await winsResponse.json();
        setWins(podWins);
      }
    } catch (error) {
      console.error('Failed to fetch pod details:', error);
    }
  };

  const handleShareWin = async () => {
    if (!user || !podId || !winContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/wins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.fid,
          podId,
          content: winContent.trim(),
        }),
      });

      if (response.ok) {
        setWinContent('');
        setShowShareForm(false);
        await fetchPodDetails(podId);
        onWinShared?.();

        // Send notifications to pod members
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: '', // Will be set for each member
            type: 'pod_win',
            podId,
            winId: (await response.json()).id,
            excludeUserId: user.fid,
          }),
        });
      }
    } catch (error) {
      console.error('Failed to share win:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (winId: string, reactionEmoji: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/wins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winId,
          userId: user.fid,
        }),
      });

      if (response.ok) {
        // Update local state
        setWins(prevWins =>
          prevWins.map(win =>
            win.id === winId
              ? { ...win, reactions: [...win.reactions, user.fid] }
              : win
          )
        );
      }
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          {podName}
        </h3>
        <span className="text-xs text-text-muted">{members.length} members</span>
      </div>

      {showShareForm && (
        <div className="mb-4 p-3 bg-surface-light rounded-lg">
          <textarea
            placeholder="What did you accomplish today?"
            value={winContent}
            onChange={(e) => setWinContent(e.target.value)}
            maxLength={200}
            className="w-full p-2 mb-2 rounded bg-surface border border-surface-light focus:border-primary outline-none resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-muted">{winContent.length}/200</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShareWin}
              disabled={loading || !winContent.trim()}
              className="btn-primary text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sharing...' : 'Share Win'}
            </button>
            <button
              onClick={() => setShowShareForm(false)}
              className="btn-outline text-sm flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {wins.slice(0, 5).map((win) => (
          <div key={win.id} className="bg-surface-light rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👤</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Pod Member</p>
                <p className="text-sm text-text-muted mt-1">{win.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    {reactions.map((reaction, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleReaction(win.id, reaction.emoji)}
                        disabled={win.reactions.includes(user?.fid || '')}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full bg-surface hover:bg-opacity-80 transition-all duration-200 ${
                          win.reactions.includes(user?.fid || '') ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <reaction.icon className="w-4 h-4 text-text-muted" />
                      </button>
                    ))}
                  </div>
                  {win.reactions.length > 0 && (
                    <span className="text-xs text-text-muted">{win.reactions.length} reactions</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {wins.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No wins shared yet.</p>
            <p className="text-xs">Be the first to share your progress!</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowShareForm(!showShareForm)}
        className="w-full mt-3 py-2 text-sm text-primary hover:text-primary-light font-medium flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Share Your Win
      </button>
    </div>
  );
}
