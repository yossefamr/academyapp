'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/app-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const hydrated = useThemeStore((s) => s.hydrated);
  const setTheme = useThemeStore((s) => s.setTheme);

  // Default to dark until hydrated
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme, hydrated]);

  // On first mount, if not hydrated, apply dark to avoid flash
  useEffect(() => {
    const root = document.documentElement;
    if (!hydrated) {
      root.classList.add('dark');
    }
  }, [hydrated]);

  return <>{children}</>;
}
