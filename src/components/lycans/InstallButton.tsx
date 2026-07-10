'use client';

import { useEffect, useState } from 'react';
import { Download, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function getInitiallyInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  if ((window.navigator as any).standalone === true) return true;
  return false;
}

export default function InstallButton({ className }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(getInitiallyInstalled);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setDeferred(null);
  }

  // Already installed (running as standalone app) — show confirmation
  if (installed) {
    return (
      <div
        className={cn(
          'hidden items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-green-500 sm:flex',
          className
        )}
        title="App installed"
      >
        <Check className="h-3 w-3" /> App
      </div>
    );
  }

  // Installable
  if (deferred) {
    return (
      <button
        onClick={handleInstall}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse-blood',
          className
        )}
        style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))' }}
        title="Install as app"
      >
        <Download className="h-3 w-3" /> ثبّت · Install
      </button>
    );
  }

  // Not installable yet (e.g. iOS Safari — needs manual Add to Home Screen)
  return null;
}
