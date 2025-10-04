import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        accent: 'var(--color-accent)',
        primary: 'var(--color-primary)',
        surface: 'var(--color-surface)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        'text-muted': 'var(--color-text-muted)',
        'accent-light': 'var(--color-accent-light)',
        'primary-light': 'var(--color-primary-light)',
        'surface-light': 'var(--color-surface-light)',
      },
      borderRadius: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(262, 83%, 58%, 0.12)',
        'glow': '0 0 40px hsla(262, 83%, 58%, 0.3)',
        'card-hover': '0 12px 32px hsla(262, 83%, 58%, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
