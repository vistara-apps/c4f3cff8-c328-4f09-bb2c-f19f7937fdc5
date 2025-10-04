'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-error bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-text-muted mb-6">
          Don't worry, even champions stumble. Let's get you back on track.
        </p>
        <button onClick={reset} className="btn-primary w-full">
          Try Again
        </button>
      </div>
    </div>
  );
}
