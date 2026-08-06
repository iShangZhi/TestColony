'use client';

import { create } from 'zustand';

type Theme = 'dark' | 'light';

// Client-only init
let initTheme: Theme = 'dark';
if (typeof window !== 'undefined') {
  initTheme = (localStorage.getItem('testcolony-theme') as Theme) || 'dark';
  // Apply immediately on module load
  document.documentElement.classList.toggle('dark', initTheme === 'dark');
}

export const useThemeStore = create<{
  theme: Theme;
  mounted: boolean;
  toggle: () => void;
  init: () => void;
}>((set, get) => ({
  theme: initTheme,
  mounted: false,
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('testcolony-theme', next);
    set({ theme: next });
  },
  init: () => set({ mounted: true }),
}));
