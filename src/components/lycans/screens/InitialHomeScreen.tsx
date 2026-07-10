'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Swords, Moon, Zap, MapPin, Phone, ArrowRight } from 'lucide-react';
import PlasmaWave from '@/components/reactbits/PlasmaWave';
import { LycansLogo, ClawMarks, CrossedSwords } from '@/components/lycans/logo';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { DISCIPLINES, ACADEMY } from '@/lib/academy';
import ContactFooter from '@/components/lycans/ContactFooter';

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
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <ClawMarks color="var(--blood)" count={3} className="h-9 w-9" />
          <span className="font-display text-sm tracking-[0.25em] text-foreground/80 sm:text-base">LYCANS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground sm:flex">
            <Moon className="h-3.5 w-3.5" /> Nightfall Mode
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center px-6 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-5xl flex-col items-center"
        >
          <div className="relative">
            <CrossedSwords className="absolute -top-6 left-1/2 h-20 w-20 -translate-x-1/2 opacity-30" />
            <LycansLogo size="lg" clawCount={4} />
          </div>

          {/* Academy full name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-blood/40 bg-blood/10 px-4 py-1.5"
          >
            <Swords className="h-3.5 w-3.5" style={{ color: 'var(--blood)' }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blood sm:text-xs">MMA Academy</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            A pack forged in shadow. We train under the moon, strike like lightning,
            and rise through blood and silver. 10,000+ fighters. 3,000+ champions.
            Enter the den — become fearless.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
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

        {/* Quick info pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: Swords, label: '8 Disciplines' },
            { icon: Zap, label: 'QR Check-in' },
            { icon: Moon, label: 'Night Sessions' },
            { icon: ChevronRight, label: 'Rank Up' },
          ].map((f) => (
            <div key={f.label} className="glass-panel flex flex-col items-center gap-2 rounded-2xl px-4 py-4">
              <f.icon className="h-5 w-5" style={{ color: 'var(--blood)' }} />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Disciplines showcase */}
        <section className="mt-20 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="claw-divider mx-auto mb-4 w-32" />
            <h2 className="font-display text-2xl tracking-[0.18em] text-foreground sm:text-3xl">
              THE <span className="text-blood-glow">ARTS</span> OF WAR
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Eight disciplines. One pack. Total combat mastery.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DISCIPLINES.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 text-left backdrop-blur transition-all hover:border-blood/40 hover:bg-card/80"
              >
                <div
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-30"
                  style={{ background: d.accent }}
                />
                <div className="relative">
                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `color-mix(in oklch, ${d.accent} 18%, transparent)` }}
                  >
                    <d.icon className="h-5 w-5" style={{ color: d.accent }} />
                  </div>
                  <h3 className="font-display text-base tracking-wide text-foreground">{d.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blood">{d.tagline}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Location CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 w-full max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-3xl border border-blood/30 bg-gradient-to-br from-blood/15 via-card/60 to-card/60 p-6 backdrop-blur sm:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blood/20 blur-3xl" />
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blood/20">
                  <MapPin className="h-6 w-6" style={{ color: 'var(--blood)' }} />
                </div>
                <div>
                  <h3 className="font-display text-lg tracking-wide text-foreground">Find Your Den</h3>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">{ACADEMY.address}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ACADEMY.branches.map((b) => (
                      <span key={b} className="rounded-full border border-border/50 bg-background/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <a
                  href={ACADEMY.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105"
                  style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))' }}
                >
                  <MapPin className="h-4 w-4" /> Open in Maps <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`tel:${ACADEMY.phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:border-blood/60 hover:bg-blood/5"
                >
                  <Phone className="h-4 w-4" style={{ color: 'var(--blood)' }} /> {ACADEMY.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact footer */}
        <div className="mt-16 w-full max-w-5xl">
          <ContactFooter variant="full" />
        </div>
      </main>
    </div>
  );
}
