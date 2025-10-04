# Momentum - Context-Aware Motivation App

A Base Mini App that provides personalized motivation through AI-powered nudges, streak tracking, and accountability communities.

## 🚀 Features

### Core Features
- **Context-Aware Motivation Engine**: AI-powered system that analyzes user mood, goals, and activity patterns to deliver personalized motivational messages
- **Goal-Linked Micro-Nudges**: Users set goals and receive targeted prompts tied to their specific objectives
- **Accountability Micro-Communities**: Algorithm matches users into small pods (3-5 members) for daily win-sharing and support
- **Streaks-to-Rewards System**: Gamified consistency tracker with milestone unlocks and premium content
- **In-Frame Quick Actions**: One-tap mood check-ins, progress logging, and win sharing

### Technical Features
- **Farcaster Integration**: Built as a MiniApp with wallet-less authentication via FID
- **AI-Powered Content**: OpenAI GPT-4 integration for personalized motivation generation
- **Micro-Transactions**: x402 protocol support for frictionless payments (0.0001-0.001 ETH)
- **Smart Notifications**: Context-aware push notifications respecting user quiet hours
- **Pod Matching**: Intelligent algorithm for creating compatible accountability groups

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Redis for data persistence
- **Authentication**: Farcaster MiniKit SDK
- **Payments**: Base x402 Micro-transaction Protocol
- **AI**: OpenAI GPT-4 API
- **Deployment**: Base L2 for low-fee transactions

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/c4f3cff8-c328-4f09-bb2c-f19f7937fdc5.git
   cd momentum
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: OnchainKit API key
   - `REDIS_URL`: Redis database URL
   - `PAYMENT_RECIPIENT_ADDRESS`: Ethereum address for payments

4. **Start Redis** (if running locally)
   ```bash
   redis-server
   ```

5. **Seed the database** (optional)
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### First-Time Setup
1. **Onboarding**: Users sign in with Farcaster and set up their goals
2. **Goal Selection**: Choose from categories (Launch, Learn, Create, Social) or add custom goals
3. **Timezone Setup**: Configure notification preferences
4. **Mood Baseline**: Initial mood check-in to calibrate the AI

### Daily Flow
1. **Receive Nudges**: Get personalized motivation based on mood, goals, and time
2. **Log Progress**: Mark goals as completed or in progress
3. **Share Wins**: Post achievements to accountability pod
4. **React to Peers**: Support other pod members with emoji reactions

### Premium Features
- **Streak Unlocks**: Earn premium content by maintaining consistency
- **Micro-Payments**: Purchase additional content packs (0.0005 ETH)
- **Pod Upgrades**: Access curated high-engagement pods

## 🏗️ Architecture

### Data Models
- **User**: Profile, streaks, premium unlocks, timezone
- **Goal**: User objectives with progress tracking
- **Pod**: Accountability groups with member management
- **MoodCheckIn**: Emotional state logging
- **ProgressLog**: Goal advancement tracking
- **WinShare**: Social sharing within pods
- **MotivationContent**: AI-generated and static content library

### API Endpoints
- `/api/users`: User management
- `/api/goals`: Goal CRUD operations
- `/api/pods`: Pod matching and management
- `/api/mood`: Mood check-in logging
- `/api/progress`: Progress tracking
- `/api/wins`: Win sharing functionality
- `/api/generate-nudge`: AI-powered nudge generation
- `/api/notifications`: Push notification handling
- `/api/purchase`: Payment processing

### Key Components
- **FrameShell**: Base layout container
- **StreakCounter**: Visual streak display
- **MoodSelector**: 5-emoji mood interface
- **NudgeCard**: Motivation content display
- **GoalProgress**: Goal tracking interface
- **PodFeed**: Social feed for pods
- **ActionBar**: Bottom navigation

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── goals/            # Goals page
│   ├── onboarding/       # Onboarding flow
│   ├── pod/              # Pod page
│   └── settings/         # Settings page
├── lib/                   # Utility libraries
│   ├── auth.ts           # Farcaster authentication
│   ├── redis.ts          # Database operations
│   ├── openai.ts         # AI integration
│   ├── payments.ts       # Micro-transaction handling
│   └── notifications.ts  # Push notification system
└── hooks/                # Custom React hooks
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 🚀 Deployment

### Prerequisites
- Node.js 18+
- Redis database
- OpenAI API key
- OnchainKit API key

### Build & Deploy
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform** (Vercel, Netlify, etc.)

3. **Set environment variables** in your deployment platform

4. **Seed the database** (if needed)
   ```bash
   curl -X POST https://your-domain.com/api/seed
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Farcaster ecosystem
- Powered by Base L2 for micro-transactions
- AI content generation by OpenAI
- UI inspiration from modern mobile apps

## 📞 Support

For support, please open an issue on GitHub or reach out on Farcaster.

---

**Momentum** - Your pocket cheerleader for consistent growth. 🌟

