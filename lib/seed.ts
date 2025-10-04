import { db } from './redis';

export const motivationContent = [
  // Launch category
  {
    category: 'launch',
    mood: 'energized',
    timeOfDay: 'morning',
    text: "Morning champion! Your launch energy is palpable. What's the one thing you'll ship today that moves the needle?",
    isPremium: false,
  },
  {
    category: 'launch',
    mood: 'focused',
    timeOfDay: 'afternoon',
    text: "Stay locked in! Every line of code you write today brings your launch closer. What's your next move?",
    isPremium: false,
  },
  {
    category: 'launch',
    mood: 'struggling',
    timeOfDay: 'evening',
    text: "Launch days are tough, but you're tougher. Take a breath, then tackle one more thing before calling it a night.",
    isPremium: false,
  },

  // Learn category
  {
    category: 'learn',
    mood: 'energized',
    timeOfDay: 'morning',
    text: "Your learning energy is contagious! What's one concept you'll master today?",
    isPremium: false,
  },
  {
    category: 'learn',
    mood: 'focused',
    timeOfDay: 'afternoon',
    text: "Deep in the learning zone - that's where breakthroughs happen. What's clicking for you right now?",
    isPremium: false,
  },
  {
    category: 'learn',
    mood: 'struggling',
    timeOfDay: 'evening',
    text: "Learning curves are steep, but you're climbing. Tomorrow brings fresh perspective and energy.",
    isPremium: false,
  },

  // Create category
  {
    category: 'create',
    mood: 'energized',
    timeOfDay: 'morning',
    text: "Creative fire is burning bright! What's the next masterpiece you'll bring to life?",
    isPremium: false,
  },
  {
    category: 'create',
    mood: 'focused',
    timeOfDay: 'afternoon',
    text: "In the creative flow - this is where magic happens. What's taking shape under your hands?",
    isPremium: false,
  },
  {
    category: 'create',
    mood: 'struggling',
    timeOfDay: 'evening',
    text: "Creative blocks are temporary. Your next breakthrough idea is closer than you think.",
    isPremium: false,
  },

  // Social category
  {
    category: 'social',
    mood: 'energized',
    timeOfDay: 'morning',
    text: "Your social energy is magnetic! Who's one person you'll connect with meaningfully today?",
    isPremium: false,
  },
  {
    category: 'social',
    mood: 'focused',
    timeOfDay: 'afternoon',
    text: "Building relationships takes focus and intention. What's one connection you'll nurture today?",
    isPremium: false,
  },
  {
    category: 'social',
    mood: 'struggling',
    timeOfDay: 'evening',
    text: "Social momentum builds over time. Your consistent effort today creates tomorrow's opportunities.",
    isPremium: false,
  },

  // Premium content
  {
    category: 'launch',
    mood: 'overwhelmed',
    timeOfDay: 'morning',
    text: "Launch anxiety is real, but so is your capability. Break it down: what's the smallest, safest next step?",
    isPremium: true,
    unlockStreak: 7,
  },
  {
    category: 'learn',
    mood: 'celebrate',
    timeOfDay: 'evening',
    text: "Knowledge compounds like interest. Today's learning becomes tomorrow's breakthrough. Celebrate your growth!",
    isPremium: true,
    unlockStreak: 30,
  },
  {
    category: 'create',
    mood: 'overwhelmed',
    timeOfDay: 'afternoon',
    text: "Creative overwhelm often masks excitement. You're not stuck - you're percolating. Trust the process.",
    isPremium: true,
    unlockStreak: 14,
  },
];

export async function seedMotivationContent() {
  console.log('Seeding motivation content...');

  for (const content of motivationContent) {
    try {
      await db.createMotivationContent(content);
      console.log(`Seeded: ${content.category} - ${content.mood} - ${content.timeOfDay}`);
    } catch (error) {
      console.error('Error seeding content:', error);
    }
  }

  console.log('Motivation content seeding complete!');
}

