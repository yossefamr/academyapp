'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const hydrated = useThemeStore((s) => s.hydrated);
  const isDark = hydrated ? theme === 'dark' : true;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-blood/60 hover:bg-accent/40',
        className
      )}
    >
      <Sun
        className={cn('h-4 w-4 transition-all', isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100')}
        style={{ color: 'var(--blood)', position: 'absolute' }}
      />
      <Moon
        className={cn('h-4 w-4 transition-all', isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0')}
        style={{ color: 'var(--silver)', position: 'absolute' }}
      />
    </button>
  );
}
