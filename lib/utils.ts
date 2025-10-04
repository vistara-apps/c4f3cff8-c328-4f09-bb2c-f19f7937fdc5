export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatStreak(days: number): string {
  if (days === 0) return 'Start your streak!';
  if (days === 1) return '1 day';
  return `${days} days`;
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function calculateProgress(current: number, target: number): number {
  return Math.min(Math.round((current / target) * 100), 100);
}
