import { create } from 'zustand';

type Theme = 'dark' | 'light';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('testcolony-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
};

const applyTheme = (theme: Theme) => {
  localStorage.setItem('testcolony-theme', theme);
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }>((set, get) => ({
  theme: getInitialTheme(),
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
  setTheme: (t) => { applyTheme(t); set({ theme: t }); },
}));

// Apply theme on module load
if (typeof window !== 'undefined') {
  applyTheme(getInitialTheme());
}
