'use client';

import { useEffect, useState } from 'react';
import { Download, X, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app-store';

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

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(getInitiallyInstalled);
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // Show after a short delay (only on home/auth screens — not intrusive)
      setTimeout(() => setShow(true), 2500);
    };

    const onInstalled = () => {
      setInstalled(true);
      setShow(false);
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
    if (choice.outcome === 'accepted') {
      setInstalled(true);
    }
    setShow(false);
    setDeferred(null);
  }

  // Don't show once installed or when no deferred event yet (no browser support = manual APK)
  if (installed || !deferred) return null;
  // Only show on non-authenticated home screen to avoid clutter
  if (user) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md sm:bottom-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-blood/40 bg-card/95 p-4 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setShow(false)}
              className="absolute right-2 top-2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 pr-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blood/20">
                <Swords className="h-5 w-5" style={{ color: 'var(--blood)' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Install Lycans App</p>
                <p className="text-[11px] text-muted-foreground">Add to your home screen for the full pack experience.</p>
              </div>
            </div>
            <button
              onClick={handleInstall}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold uppercase tracking-wider text-white"
              style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))' }}
            >
              <Download className="h-4 w-4" /> Install Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
