'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Calendar, Flame, QrCode, ScanLine, MessageSquare, Star,
  TrendingUp, Clock, Swords, Moon, Award, Activity,
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { PageHeader } from '@/components/lycans/AppShell';
import { SkillBadge, RankBadge, RoleBadge } from '@/components/lycans/badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/lycans/QRScanner';
import QRPassModal from '@/components/lycans/QRPassModal';
import type { Attendance, Member } from '@/lib/types';
import { SKILL_LABELS, SKILL_ORDER } from '@/lib/types';

export default function DashboardScreen() {
  const user = useAppStore((s) => s.user);
  const setView = useAppStore((s) => s.setView);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [count, setCount] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (!user) return;
    fetch('/api/attendance')
      .then((r) => r.json())
      .then((d) => {
        setAttendance(d.attendance || []);
        setCount(d.attendance?.length || 0);
      })
      .catch(() => {});
  }, [user]);

  if (!user) return null;

  const skillIdx = SKILL_ORDER.indexOf(user.skillLevel);
  const skillProgress = ((skillIdx + 1) / SKILL_ORDER.length) * 100;

  // recent sessions this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const sessionsThisWeek = attendance.filter((a) => new Date(a.checkIn) >= weekAgo).length;

  // last session
  const lastSession = attendance[0];
  const lastDuration = lastSession?.checkOut
    ? Math.round((new Date(lastSession.checkOut).getTime() - new Date(lastSession.checkIn).getTime()) / 60000)
    : null;

  const stats = [
    { label: 'Attendance', value: count, icon: Calendar, accent: 'var(--blood)' },
    { label: 'This Week', value: sessionsThisWeek, icon: Flame, accent: 'var(--blood)' },
    { label: 'Rank', value: `#${user.rank}`, icon: Award, accent: 'var(--silver)' },
    { label: 'Last Session', value: lastDuration ? `${lastDuration}m` : '—', icon: Clock, accent: 'var(--silver)' },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="Your fighter dashboard" icon={Swords} />

      {/* Admin quick scan banner */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-blood/30 bg-gradient-to-r from-blood/15 to-transparent p-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blood/20">
              <ScanLine className="h-5 w-5" style={{ color: 'var(--blood)' }} />
            </div>
            <div>
              <p className="text-sm font-bold">Coach Tools — Track Attendance</p>
              <p className="text-xs text-muted-foreground">Scan a trainee&apos;s QR to log arrival / departure.</p>
            </div>
          </div>
          <Button
            onClick={() => setScannerOpen(true)}
            className="rounded-full px-6 font-bold uppercase tracking-wider"
            style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))', color: 'white' }}
          >
            <ScanLine className="mr-2 h-4 w-4" /> Open Scanner
          </Button>
        </motion.div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="relative overflow-hidden border-blood/20 bg-card/60 backdrop-blur lg:col-span-2">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blood/20 to-transparent" />
          <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-blood/40 shadow-lg">
                  <AvatarImage src={user.photo} alt={user.name} />
                  <AvatarFallback className="bg-blood/20 text-3xl font-black text-blood">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPassOpen(true)}
                className="rounded-full border-blood/40 text-xs uppercase tracking-wider hover:bg-blood/10 animate-pulse-blood"
              >
                <QrCode className="mr-1.5 h-3.5 w-3.5" /> باس الحضور · My QR
              </Button>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="font-display text-2xl tracking-wide">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.bio || 'Fearless fighter in training.'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SkillBadge level={user.skillLevel} />
                <RankBadge rank={user.rank} title={user.rankTitle} />
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" style={{ color: 'var(--blood)' }} />
                  <span className="font-medium text-foreground">{user.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Swords className="h-4 w-4" style={{ color: 'var(--blood)' }} />
                  <span className="font-medium text-foreground">{user.discipline}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="h-4 w-4" style={{ color: 'var(--blood)' }} />
                  <span className="font-medium text-foreground">{user.weightClass || 'Open'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" style={{ color: 'var(--blood)' }} />
                  <span className="font-medium text-foreground">Since {new Date(user.joinedAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Skill progress */}
              <div className="pt-1">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-muted-foreground">Skill Path</span>
                  <span className="font-bold text-blood">{SKILL_LABELS[user.skillLevel]} · {skillIdx + 1}/{SKILL_ORDER.length}</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skillProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 50%, var(--silver)))' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="flex items-center gap-3 border-border/50 bg-card/60 p-4 backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklch, ${s.accent} 15%, transparent)` }}>
                  <s.icon className="h-5 w-5" style={{ color: s.accent }} />
                </div>
                <div>
                  <p className="text-2xl font-black leading-none">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <QuickAction
          icon={MessageSquare}
          title="Pack Chat"
          desc="Talk with the pack — opened by the coach."
          onClick={() => setView('chat')}
        />
        <QuickAction
          icon={Star}
          title="Share Feedback"
          desc="Rate your sessions & leave a note."
          onClick={() => setView('feedback')}
        />
      </div>

      {/* Recent attendance */}
      <Card className="mt-6 border-border/50 bg-card/60 backdrop-blur">
        <div className="flex items-center justify-between border-b border-border/50 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: 'var(--blood)' }} />
            <h3 className="font-display text-sm tracking-widest">RECENT SESSIONS</h3>
          </div>
          <span className="text-xs text-muted-foreground">{count} total</span>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {attendance.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
              <Moon className="h-8 w-8 opacity-40" />
              <p className="text-sm">No sessions yet. The moon awaits.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {attendance.map((a) => {
                const dur = a.checkOut ? Math.round((new Date(a.checkOut).getTime() - new Date(a.checkIn).getTime()) / 60000) : null;
                return (
                  <li key={a.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blood/10">
                        <Calendar className="h-4 w-4" style={{ color: 'var(--blood)' }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{new Date(a.checkIn).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {a.checkOut ? ` → ${new Date(a.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ' · open'}
                        </p>
                      </div>
                    </div>
                    {dur !== null && (
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground">{dur}m</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>

      <QRScanner open={scannerOpen} onClose={() => setScannerOpen(false)} />
      <QRPassModal open={passOpen} onClose={() => setPassOpen(false)} />
    </div>
  );
}

function QuickAction({ icon: Icon, title, desc, onClick }: { icon: typeof MessageSquare; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 text-left backdrop-blur transition-all hover:border-blood/40 hover:bg-blood/5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blood/10 transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" style={{ color: 'var(--blood)' }} />
      </div>
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}
