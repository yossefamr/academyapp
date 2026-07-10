'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock, Mail, User, Phone, Eye, EyeOff, AlertCircle, Swords } from 'lucide-react';
import BorderGlow from '@/components/reactbits/BorderGlow';
import { LycansEmblem, ClawMarks } from '@/components/lycans/logo';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/lycans/ThemeToggle';
import { ACADEMY } from '@/lib/academy';

export default function SignupScreen() {
  const setView = useAppStore((s) => s.setView);
  const setUser = useAppStore((s) => s.setUser);
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign-up failed');
      setUser(data.member);
      toast({ title: `Welcome to the pack, ${data.member.name}`, description: 'Your lycan journey begins. 🐺' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    'w-full border-0 border-b-2 border-blood/40 bg-transparent py-2 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-blood focus:outline-none focus:ring-0 transition-colors';

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center px-4 py-10">
      <div className="atmo-streaks absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

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
            <LycansEmblem className="h-24 w-24 drop-shadow-[0_0_24px_color-mix(in_oklch,var(--blood)_45%,transparent)]" />
            <h1 className="mt-4 font-display text-blood-glow text-2xl tracking-[0.18em]">JOIN THE PACK</h1>
            <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Become a Fearless Fighter</p>

            <div className="claw-divider my-6 w-full" />

            {error && (
              <div className="mb-4 flex w-full items-center gap-2 rounded-lg border border-blood/40 bg-blood/10 px-3 py-2 text-xs text-blood">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-blood">Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-blood/70" />
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="your warrior name" className={fieldClass} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-blood">Email</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-blood/70" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="warrior@lycans.club" className={fieldClass} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-blood">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-blood/70" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+20 ..." className={fieldClass} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-blood">Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-blood/70" />
                  <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="min 6 chars" className={fieldClass} />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-blood">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-blood/70" />
                  <input type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="re-enter" className={fieldClass} />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-6 text-sm font-bold uppercase tracking-[0.2em] disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))', color: 'white' }}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Swords className="mr-2 h-4 w-4" />}
                Forge My Path
              </Button>
            </form>

            <p className="mt-6 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
              Already a fighter?{' '}
              <button onClick={() => setView('login')} className="font-bold text-blood hover:underline">
                Sign in
              </button>
            </p>
            <a href={ACADEMY.website} target="_blank" rel="noopener noreferrer" className="mt-5 font-display text-[10px] tracking-[0.3em] text-blood/80 hover:underline">
              {ACADEMY.websiteDisplay.toUpperCase()}
            </a>
          </div>
        </BorderGlow>
      </motion.div>
    </div>
  );
}
