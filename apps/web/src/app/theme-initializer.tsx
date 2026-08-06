'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

/**
 * Client component that ensures the <html> element has the correct
 * `dark` class based on the current theme. Runs on every render to
 * survive client-side navigations where React re-renders the layout.
 */
export function ThemeInitializer() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return null;
}
