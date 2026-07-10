'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Swords, Moon, Zap } from 'lucide-react';
import PlasmaWave from '@/components/reactbits/PlasmaWave';
import { LycansLogo, ClawMarks, CrossedSwords } from '@/components/lycans/logo';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';

export default function InitialHomeScreen() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col">
      {/* Plasma background — blood & ash waves */}
      <div className="absolute inset-0 -z-10 opacity-70">
        <PlasmaWave
          colors={['#8a0d0d', '#1a1a22']}
          speed1={0.04}
          speed2={0.03}
          dir2={-1}
          focalLength={0.85}
          bend1={1.1}
          bend2={0.6}
          rotationDeg={0}
        />
      </div>
      {/* dark scrim for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <ClawMarks color="var(--blood)" count={3} className="h-9 w-9" />
          <span className="font-display text-sm tracking-[0.3em] text-foreground/80">LYCANS</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="hidden items-center gap-1.5 text-xs uppercase tracking-widest sm:flex">
            <Moon className="h-3.5 w-3.5" /> Nightfall Mode
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <CrossedSwords className="absolute -top-6 left-1/2 h-20 w-20 -translate-x-1/2 opacity-30" />
            <LycansLogo size="lg" clawCount={4} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            A pack forged in shadow. We train under the moon, strike like lightning,
            and rise through blood and silver. Enter the den — become fearless.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() => setView('login')}
              className="group relative overflow-hidden rounded-full px-8 py-6 text-base font-bold uppercase tracking-widest animate-pulse-blood"
              style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 60%, black))', color: 'white' }}
            >
              <Swords className="mr-2 h-4 w-4" />
              Enter The Den
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setView('signup')}
              className="rounded-full border-blood/40 px-8 py-6 text-base font-bold uppercase tracking-widest text-foreground hover:border-blood hover:bg-blood/10"
            >
              Join The Pack
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: Swords, label: 'Live Training' },
            { icon: Zap, label: 'QR Check-in' },
            { icon: Moon, label: 'Night Sessions' },
            { icon: ChevronRight, label: 'Rank Up' },
          ].map((f) => (
            <div
              key={f.label}
              className="glass-panel flex flex-col items-center gap-2 rounded-2xl px-4 py-4"
            >
              <f.icon className="h-5 w-5" style={{ color: 'var(--blood)' }} />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</span>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 py-5 text-center">
        <div className="claw-divider mx-auto mb-4 max-w-md" />
        <p className="font-display text-[11px] tracking-[0.3em] text-muted-foreground">
          WWW.LYCANSFIGHTCLUB.COM
        </p>
      </footer>
    </div>
  );
}
