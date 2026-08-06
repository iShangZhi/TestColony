import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic theme colors - values come from CSS variables
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          dark: 'rgb(var(--color-surface-dark) / <alpha-value>)',
          card: 'rgb(var(--color-surface-card) / <alpha-value>)',
          border: 'rgb(var(--color-surface-border) / <alpha-value>)',
          hover: 'rgb(var(--color-surface-hover) / <alpha-value>)',
        },
        app: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          nav: 'rgb(var(--color-bg-nav) / <alpha-value>)',
          input: 'rgb(var(--color-bg-input) / <alpha-value>)',
        },
        // Accent colors (same in both themes)
        primary: { DEFAULT: '#7C3AED', dark: '#6D28D9', light: '#A78BFA' },
        secondary: { DEFAULT: '#059669' },
        accent: { DEFAULT: '#F59E0B' },
        danger: { DEFAULT: '#EF4444' },
        status: {
          passed: '#22C55E', failed: '#EF4444', skipped: '#F59E0B',
          running: '#3B82F6', pending: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
