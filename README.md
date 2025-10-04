# Momentum - Your Pocket Cheerleader

A context-aware motivation app built as a Base Mini App that sends personalized nudges, tracks streaks, and connects you with accountability peers.

## Features

- 🔥 **Streak Tracking**: Visual streak counter with milestone celebrations
- 💪 **Context-Aware Nudges**: AI-powered motivational messages at optimal times
- 🎯 **Goal Progress**: Track multiple goals with visual progress indicators
- 👥 **Accountability Pods**: Small peer groups for mutual support
- 😊 **Mood Check-Ins**: Quick emotional state tracking
- 💎 **Premium Content**: Unlock motivational packs via micro-transactions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base L2 via OnchainKit
- **Identity**: Farcaster MiniKit SDK
- **Styling**: Tailwind CSS with custom design system
- **Database**: Upstash Redis (recommended)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Add your API keys
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Design System

### Colors
- **Primary**: Purple gradient (hsl(262, 83%, 58%))
- **Accent**: Green (hsl(142, 76%, 36%))
- **Background**: Dark (hsl(240, 10%, 4%))

### Components
- `FrameShell`: Main container with gradient background
- `StreakCounter`: Displays current streak with flame icon
- `MoodSelector`: 5-emoji mood check-in interface
- `NudgeCard`: Motivational message display
- `GoalProgress`: Visual goal tracking cards
- `PodFeed`: Accountability group activity feed
- `ActionBar`: Bottom navigation

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## License

MIT
