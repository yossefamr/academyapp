'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Member, ScreenView } from '@/lib/types';

interface AppState {
  user: Member | null;
  view: ScreenView;
  hydrated: boolean;
  setUser: (user: Member | null) => void;
  setView: (view: ScreenView) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      view: 'home',
      hydrated: false,
      setUser: (user) => set({ user, view: user ? 'dashboard' : 'home' }),
      setView: (view) => set({ view }),
      logout: () => set({ user: null, view: 'home' }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'lycans-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, view: state.view }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

/* Theme store */
interface ThemeState {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggle: () => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      hydrated: false,
      setTheme: (theme) => set({ theme }),
      toggle: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'lycans-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
