'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import AtmosphericBackground from '@/components/lycans/AtmosphericBackground';
import AppShell from '@/components/lycans/AppShell';
import InitialHomeScreen from '@/components/lycans/screens/InitialHomeScreen';
import LoginScreen from '@/components/lycans/screens/LoginScreen';
import SignupScreen from '@/components/lycans/screens/SignupScreen';
import DashboardScreen from '@/components/lycans/screens/DashboardScreen';
import ChatScreen from '@/components/lycans/screens/ChatScreen';
import FeedbackScreen from '@/components/lycans/screens/FeedbackScreen';
import AdminScreen from '@/components/lycans/screens/AdminScreen';
import { ClawMarks } from '@/components/lycans/logo';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const user = useAppStore((s) => s.user);
  const view = useAppStore((s) => s.view);
  const setUser = useAppStore((s) => s.setUser);
  const setView = useAppStore((s) => s.setView);
  const hydrated = useAppStore((s) => s.hydrated);
  const [checking, setChecking] = useState(true);

  // Restore session on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!cancelled && data.member) {
          setUser(data.member);
        }
      } catch { /* ignore */ } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Loading splash while checking session or hydrating store
  if (checking || !hydrated) {
    return (
      <div className="relative flex min-h-[100dvh] items-center justify-center bg-background">
        <AtmosphericBackground />
        <div className="relative flex flex-col items-center gap-4">
          <div className="animate-pulse-blood rounded-full p-4">
            <ClawMarks color="var(--blood)" count={4} className="h-16 w-16" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-display text-xs tracking-[0.3em]">AWAKENING THE PACK…</span>
          </div>
        </div>
      </div>
    );
  }

  // Auth screens (no shell, no atmosphere heavy)
  if (!user) {
    if (view === 'login') {
      return (
        <div className="relative min-h-[100dvh]">
          <AtmosphericBackground rain={false} lightning={false} moon={false} streaks={false} />
          <LoginScreen />
        </div>
      );
    }
    if (view === 'signup') {
      return (
        <div className="relative min-h-[100dvh]">
          <AtmosphericBackground rain={false} lightning={false} moon={false} streaks={false} />
          <SignupScreen />
        </div>
      );
    }
    // initial home
    return (
      <div className="relative min-h-[100dvh]">
        <InitialHomeScreen />
      </div>
    );
  }

  // Authenticated: ensure view is valid for the user
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  let activeView = view;
  if (view === 'admin' && !isAdmin) activeView = 'dashboard';
  if (view === 'home' || view === 'login' || view === 'signup') activeView = 'dashboard';

  return (
    <div className="relative min-h-[100dvh]">
      <AtmosphericBackground />
      <AppShell>
        {activeView === 'dashboard' && <DashboardScreen />}
        {activeView === 'chat' && <ChatScreen />}
        {activeView === 'feedback' && <FeedbackScreen />}
        {activeView === 'admin' && isAdmin && <AdminScreen />}
      </AppShell>
      {/* Force re-render when view changes */}
      <span className="sr-only">{activeView}</span>
    </div>
  );
}
