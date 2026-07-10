'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock, User, Eye, EyeOff, AlertCircle, Facebook, Instagram } from 'lucide-react';
import BorderGlow from '@/components/reactbits/BorderGlow';
import { LycansEmblem, ClawMarks } from '@/components/lycans/logo';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/lycans/ThemeToggle';

export default function LoginScreen() {
  const setView = useAppStore((s) => s.setView);
  const setUser = useAppStore((s) => s.setUser);
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(data.member);
      toast({ title: `Welcome back, ${data.member.name}`, description: 'The pack awaits. 🐺' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center px-4 py-10">
      {/* Diagonal blood streaks background */}
      <div className="atmo-streaks absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Top-right theme toggle */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <button
        onClick={() => setView('home')}
        className="absolute left-4 top-5 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground sm:left-6"
      >
        <ClawMarks color="var(--blood)" count={3} className="h-6 w-6" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <BorderGlow
          glowColor="0 80% 55%"
          backgroundColor="color-mix(in oklch, var(--card) 80%, black)"
          borderRadius={28}
          glowRadius={50}
          glowIntensity={1.2}
          colors={['#c8102e', '#7a0d0d', '#3a3f47']}
          className="mx-auto"
        >
          <div className="flex flex-col items-center px-7 py-9 sm:px-9">
            {/* Emblem */}
            <LycansEmblem className="h-28 w-28 drop-shadow-[0_0_24px_color-mix(in_oklch,var(--blood)_45%,transparent)]" />
            <h1 className="mt-4 font-display text-blood-glow text-3xl tracking-[0.18em]">LYCANS</h1>
            <p className="mt-1 font-display text-xs tracking-[0.4em] text-foreground/70">FIGHT CLUB</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Fearless Fighters</p>

            <div className="claw-divider my-6 w-full" />

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-blood/40 bg-blood/10 px-3 py-2 text-xs text-blood">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-5">
              {/* Username field */}
              <div className="group relative">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-blood">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-blood/70" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter your email"
                    required
                    autoComplete="email"
                    className="w-full border-0 border-b-2 border-blood/40 bg-transparent py-2 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-blood focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="group relative">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-blood">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-blood/70" />
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="enter your code"
                    required
                    autoComplete="current-password"
                    className="w-full border-0 border-b-2 border-blood/40 bg-transparent py-2 pl-7 pr-8 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-blood focus:outline-none focus:ring-0 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-blood">
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-6 text-sm font-bold uppercase tracking-[0.2em] disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))', color: 'white' }}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClawMarks color="white" count={3} className="mr-2 h-4 w-4" />}
                Enter The Pack
              </Button>
            </form>

            {/* Social */}
            <div className="mt-7 flex flex-col items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Don&apos;t Have an Account?</p>
              <div className="flex items-center gap-4">
                {[Facebook, Instagram, ClawMarksIcon].map((Icon, i) => (
                  <button
                    key={i}
                    onClick={() => setView('signup')}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-all hover:border-blood/60 hover:text-blood"
                    aria-label="social"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-7 font-display text-[10px] tracking-[0.3em] text-blood/80">
              WWW.LYCANSFIGHTCLUB.COM
            </p>

            {/* Demo hint */}
            <div className="mt-4 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-center text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground/70">Demo:</span> alpha@lycans.club · coach@lycans.club · trainee1@lycans.club — pass: <span className="font-mono text-blood">lycans123</span>
            </div>
          </div>
        </BorderGlow>
      </motion.div>
    </div>
  );
}

function ClawMarksIcon({ className }: { className?: string }) {
  return <ClawMarks color="currentColor" count={3} className={className} />;
}
