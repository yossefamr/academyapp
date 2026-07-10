'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Crown, Search, Loader2, Phone, Calendar, Swords,
  Save, ChevronUp, ChevronDown, X, Star, TrendingUp, Award, ScanLine, QrCode,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '@/store/app-store';
import { PageHeader } from '@/components/lycans/AppShell';
import { SkillBadge, RankBadge, RoleBadge } from '@/components/lycans/badges';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Member, Attendance, SkillLevel, Role } from '@/lib/types';
import { SKILL_LABELS, SKILL_ORDER, RANK_TITLES } from '@/lib/types';
import { cn } from '@/lib/utils';
import QRScanner from '@/components/lycans/QRScanner';

type Tab = 'trainees' | 'qrcodes' | 'rankings' | 'overview';

export default function AdminScreen() {
  const user = useAppStore((s) => s.user);
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('trainees');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      setMembers(data.members || []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.email.toLowerCase().includes(query.toLowerCase()) ||
    m.discipline.toLowerCase().includes(query.toLowerCase())
  );

  const selected = members.find((m) => m.id === selectedId) || null;

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center text-muted-foreground">
        <div>
          <Shield className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p>Admin access only.</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Users; superOnly?: boolean }[] = [
    { id: 'trainees', label: 'Trainees', icon: Users },
    { id: 'qrcodes', label: 'QR Codes', icon: QrCode },
    { id: 'rankings', label: 'Rankings', icon: Crown, superOnly: true },
    { id: 'overview', label: 'Overview', icon: TrendingUp },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader title="Admin Den" subtitle={isSuperAdmin ? 'Super admin control panel' : 'Coach control panel'} icon={Shield} />
        <Button
          onClick={() => setScannerOpen(true)}
          className="rounded-full px-5 font-bold uppercase tracking-wider"
          style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))', color: 'white' }}
        >
          <ScanLine className="mr-2 h-4 w-4" /> Scan Attendance
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-full border border-border/50 bg-card/40 p-1 backdrop-blur">
        {tabs.filter((t) => !t.superOnly || isSuperAdmin).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors',
              tab === t.id ? 'bg-blood text-white' : 'text-muted-foreground hover:text-foreground'
            )}
            style={tab === t.id ? { background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))' } : {}}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'trainees' && (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* Trainee list */}
          <Card className="flex flex-col border-border/50 bg-card/60 backdrop-blur">
            <div className="border-b border-border/50 p-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search fighters…"
                  className="border-border/60 bg-background/60 pl-8 text-sm"
                />
              </div>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-2">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : filtered.length === 0 ? (
                <p className="p-6 text-center text-xs text-muted-foreground">No fighters found.</p>
              ) : (
                <ul className="space-y-1">
                  {filtered.map((m) => (
                    <li key={m.id}>
                      <button
                        onClick={() => setSelectedId(m.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors',
                          selectedId === m.id ? 'bg-blood/15 ring-1 ring-blood/40' : 'hover:bg-muted/50'
                        )}
                      >
                        <Avatar className="h-10 w-10 border border-border/40">
                          <AvatarImage src={m.photo} alt={m.name} />
                          <AvatarFallback className="bg-blood/20 text-blood font-bold">{m.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-sm font-bold">{m.name}</p>
                            {m.role === 'SUPER_ADMIN' && <Crown className="h-3 w-3 shrink-0 text-amber-400" />}
                            {m.role === 'ADMIN' && <Shield className="h-3 w-3 shrink-0" style={{ color: 'var(--blood)' }} />}
                          </div>
                          <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                            {m.rankTitle} · {m.attendanceCount || 0} sessions
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-blood">#{m.rank}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {/* Detail editor */}
          <div>
            {selected ? (
              <TraineeEditor
                key={selected.id}
                member={selected}
                isSuperAdmin={isSuperAdmin}
                onUpdate={() => fetchMembers()}
              />
            ) : (
              <Card className="flex h-full min-h-[300px] items-center justify-center border-border/50 bg-card/40 backdrop-blur">
                <div className="text-center text-muted-foreground">
                  <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
                  <p className="text-sm">Select a fighter to view & edit their profile.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {tab === 'qrcodes' && <QRCodesTab members={members} onScan={() => setScannerOpen(true)} />}

      {tab === 'rankings' && isSuperAdmin && (
        <RankingsManager members={members} currentUserId={user.id} onUpdate={fetchMembers} />
      )}

      {tab === 'overview' && <OverviewTab members={members} />}

      <QRScanner open={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}

/* ===== Trainee detail editor ===== */
function TraineeEditor({ member, isSuperAdmin, onUpdate }: { member: Member; isSuperAdmin: boolean; onUpdate: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: member.name,
    phone: member.phone,
    bio: member.bio,
    weightClass: member.weightClass,
    discipline: member.discipline,
    skillLevel: member.skillLevel,
    photo: member.photo,
  });
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: member.name, phone: member.phone, bio: member.bio,
      weightClass: member.weightClass, discipline: member.discipline,
      skillLevel: member.skillLevel, photo: member.photo,
    });
    fetch(`/api/members/${member.id}`).then((r) => r.json()).then((d) => setAttendance(d.attendance || [])).catch(() => {});
  }, [member.id]);

  const photoOptions = Array.from({ length: 8 }, (_, i) => `/trainees/trainee${i + 1}.svg`);
  photoOptions.push('/trainees/coach.svg', '/trainees/superadmin.svg');

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: 'Profile updated', description: `${data.member.name}'s record saved.` });
      onUpdate();
    } catch (err) {
      toast({ title: 'Failed', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  function bumpSkill(dir: 1 | -1) {
    const idx = SKILL_ORDER.indexOf(form.skillLevel);
    const next = Math.max(0, Math.min(SKILL_ORDER.length - 1, idx + dir));
    setForm((f) => ({ ...f, skillLevel: SKILL_ORDER[next] }));
  }

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur">
      <div className="relative border-b border-border/50 bg-gradient-to-r from-blood/15 to-transparent p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 border-4 border-blood/40">
            <AvatarImage src={member.photo} alt={member.name} />
            <AvatarFallback className="bg-blood/20 text-2xl font-black text-blood">{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-display text-xl tracking-wide">{member.name}</h2>
            <p className="text-xs text-muted-foreground">{member.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <RoleBadge role={member.role} />
              <RankBadge rank={member.rank} title={member.rankTitle} />
              <SkillBadge level={member.skillLevel} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-blood">{member.attendanceCount || 0}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sessions</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* Skill level control */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Skill Level</label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => bumpSkill(-1)} className="h-9 w-9 rounded-lg border-blood/30">
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="flex-1 rounded-lg border border-blood/30 bg-blood/5 px-4 py-2 text-center">
              <span className="font-display text-sm tracking-widest text-blood">{SKILL_LABELS[form.skillLevel].toUpperCase()}</span>
              <p className="text-[10px] text-muted-foreground">Tier {SKILL_ORDER.indexOf(form.skillLevel) + 1} / {SKILL_ORDER.length}</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => bumpSkill(1)} className="h-9 w-9 rounded-lg border-blood/30">
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Photo picker */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {photoOptions.map((p) => (
              <button
                key={p}
                onClick={() => setForm((f) => ({ ...f, photo: p }))}
                className={cn('overflow-hidden rounded-full border-2 transition-all', form.photo === p ? 'border-blood scale-105' : 'border-border/40 opacity-60 hover:opacity-100')}
              >
                <img src={p} alt="avatar" className="h-9 w-9 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} icon={Phone} />
          <Field label="Discipline" value={form.discipline} onChange={(v) => setForm((f) => ({ ...f, discipline: v }))} icon={Swords} />
          <Field label="Weight Class" value={form.weightClass} onChange={(v) => setForm((f) => ({ ...f, weightClass: v }))} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            rows={2}
            maxLength={300}
            className="w-full resize-none rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm focus:border-blood/60 focus:outline-none"
          />
        </div>

        <Button
          onClick={save}
          disabled={saving}
          className="w-full rounded-full py-5 text-sm font-bold uppercase tracking-widest"
          style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))', color: 'white' }}
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>

        {/* Recent attendance */}
        <div className="pt-2">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" style={{ color: 'var(--blood)' }} />
            <h3 className="font-display text-xs tracking-widest">RECENT ATTENDANCE</h3>
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-border/40 bg-background/30 p-2">
            {attendance.length === 0 ? (
              <p className="p-3 text-center text-xs text-muted-foreground">No sessions logged.</p>
            ) : attendance.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center justify-between px-2 py-1 text-xs">
                <span className="text-muted-foreground">{new Date(a.checkIn).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                <span className="font-mono">{new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{a.checkOut ? ` → ${new Date(a.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Field({ label, value, onChange, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; icon?: typeof Phone }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-blood/60" />}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn('border-border/60 bg-background/60', Icon && 'pl-8')}
        />
      </div>
    </div>
  );
}

/* ===== Rankings Manager (super admin) ===== */
function RankingsManager({ members, currentUserId, onUpdate }: { members: Member[]; currentUserId: string; onUpdate: () => void }) {
  const { toast } = useToast();
  const [savingId, setSavingId] = useState<string | null>(null);

  // Sort by rank desc
  const ranked = [...members].sort((a, b) => b.rank - a.rank || a.name.localeCompare(b.name));

  async function updateRank(m: Member, newRank: number) {
    setSavingId(m.id);
    try {
      const res = await fetch(`/api/ranks/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rank: newRank }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: `${m.name} → #${data.member.rank} ${data.member.rankTitle}` });
      onUpdate();
    } catch (err) {
      toast({ title: 'Failed', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    } finally {
      setSavingId(null);
    }
  }

  async function updateRole(m: Member, newRole: Role) {
    setSavingId(m.id);
    try {
      const res = await fetch(`/api/ranks/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: `${m.name} is now ${newRole === 'SUPER_ADMIN' ? 'Super Admin' : newRole === 'ADMIN' ? 'Coach' : 'Trainee'}` });
      onUpdate();
    } catch (err) {
      toast({ title: 'Failed', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-border/50 p-4">
        <Crown className="h-5 w-5 text-amber-400" />
        <div>
          <h2 className="font-display text-sm tracking-widest">PACK HIERARCHY</h2>
          <p className="text-xs text-muted-foreground">Super admin controls ranks & roles of every member.</p>
        </div>
      </div>
      <div className="divide-y divide-border/40">
        {ranked.map((m, idx) => {
          const podium = idx < 3;
          const medal = ['🥇', '🥈', '🥉'][idx];
          return (
            <div key={m.id} className={cn('flex flex-wrap items-center gap-3 p-4', podium && 'bg-blood/5')}>
              <div className="flex w-8 items-center justify-center text-lg">{podium ? medal : <span className="text-sm font-bold text-muted-foreground">#{idx + 1}</span>}</div>
              <Avatar className="h-10 w-10 border border-border/40">
                <AvatarImage src={m.photo} alt={m.name} />
                <AvatarFallback className="bg-blood/20 text-blood font-bold">{m.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-bold">{m.name}</p>
                  {m.id === currentUserId && <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] uppercase text-muted-foreground">You</span>}
                </div>
                <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">{m.rankTitle} · {m.discipline}</p>
              </div>

              {/* Role selector */}
              <select
                value={m.role}
                onChange={(e) => updateRole(m, e.target.value as Role)}
                disabled={savingId === m.id || m.id === currentUserId}
                className="rounded-lg border border-border/60 bg-background/60 px-2 py-1.5 text-xs disabled:opacity-50 focus:border-blood/60 focus:outline-none"
              >
                <option value="TRAINEE">Trainee</option>
                <option value="ADMIN">Coach</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>

              {/* Rank stepper */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateRank(m, m.rank - 1)}
                  disabled={savingId === m.id || m.rank <= 0}
                  className="h-8 w-8 rounded-lg border-border/60"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <div className="w-16 text-center">
                  <p className="font-display text-sm font-bold text-blood">#{m.rank}</p>
                  <p className="text-[9px] uppercase text-muted-foreground">{m.rankTitle}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateRank(m, m.rank + 1)}
                  disabled={savingId === m.id || m.rank >= 8}
                  className="h-8 w-8 rounded-lg border-border/60"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ===== Overview tab ===== */
function OverviewTab({ members }: { members: Member[] }) {
  const trainees = members.filter((m) => m.role === 'TRAINEE');
  const coaches = members.filter((m) => m.role === 'ADMIN');
  const totalSessions = members.reduce((a, b) => a + (b.attendanceCount || 0), 0);
  const skillDist = SKILL_ORDER.map((s) => ({ level: s, count: members.filter((m) => m.skillLevel === s).length }));

  const cards = [
    { label: 'Total Fighters', value: members.length, icon: Users, accent: 'var(--blood)' },
    { label: 'Trainees', value: trainees.length, icon: Swords, accent: 'var(--blood)' },
    { label: 'Coaches', value: coaches.length + members.filter((m) => m.role === 'SUPER_ADMIN').length, icon: Shield, accent: 'var(--silver)' },
    { label: 'Sessions Logged', value: totalSessions, icon: Calendar, accent: 'var(--silver)' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="flex items-center gap-3 border-border/50 bg-card/60 p-4 backdrop-blur">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklch, ${c.accent} 15%, transparent)` }}>
              <c.icon className="h-5 w-5" style={{ color: c.accent }} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none">{c.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Skill distribution */}
      <Card className="border-border/50 bg-card/60 p-5 backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-4 w-4" style={{ color: 'var(--blood)' }} />
          <h3 className="font-display text-sm tracking-widest">SKILL DISTRIBUTION</h3>
        </div>
        <div className="space-y-2.5">
          {skillDist.map((s) => {
            const pct = members.length ? (s.count / members.length) * 100 : 0;
            return (
              <div key={s.level} className="flex items-center gap-3">
                <span className="w-20 text-xs font-bold uppercase tracking-wider text-muted-foreground">{SKILL_LABELS[s.level]}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 50%, var(--silver)))' }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-bold">{s.count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top ranked */}
      <Card className="border-border/50 bg-card/60 p-5 backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-400" />
          <h3 className="font-display text-sm tracking-widest">TOP OF THE PACK</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...members].sort((a, b) => b.rank - a.rank).slice(0, 6).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 p-3">
              <span className="text-lg">{['🥇', '🥈', '🥉', '4', '5', '6'][i]}</span>
              <Avatar className="h-9 w-9 border border-border/40">
                <AvatarImage src={m.photo} alt={m.name} />
                <AvatarFallback className="bg-blood/20 text-blood font-bold">{m.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{m.name}</p>
                <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">{m.rankTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ===== QR Codes tab — grid of every trainee's scannable QR ===== */
function QRCodesTab({ members, onScan }: { members: Member[]; onScan: () => void }) {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const trainees = members
    .filter((m) => m.role === 'TRAINEE' || m.role === 'ADMIN' || m.role === 'SUPER_ADMIN')
    .filter((m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      (m.discipline || '').toLowerCase().includes(query.toLowerCase())
    );

  async function copyCode(m: Member) {
    try {
      await navigator.clipboard.writeText(`LYC:${m.id}`);
      toast({ title: `Copied code for ${m.name}` });
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/60 backdrop-blur">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blood/15">
              <QrCode className="h-5 w-5" style={{ color: 'var(--blood)' }} />
            </div>
            <div>
              <h2 className="font-display text-sm tracking-widest">PACK QR CODES</h2>
              <p className="text-xs text-muted-foreground">اعرض أو اطبع أكواد الحضور لكل المقاتلين</p>
            </div>
          </div>
          <Button
            onClick={onScan}
            className="rounded-full px-5 font-bold uppercase tracking-wider"
            style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))', color: 'white' }}
          >
            <ScanLine className="mr-2 h-4 w-4" /> امسح الكود · Scan
          </Button>
        </div>
        <div className="border-t border-border/50 p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن مقاتل…"
              className="border-border/60 bg-background/60 pl-8 text-sm"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {trainees.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.4) }}
          >
            <Card className="flex flex-col items-center gap-3 border-border/50 bg-card/60 p-4 text-center backdrop-blur">
              <div className="flex w-full items-center gap-2 self-start">
                <Avatar className="h-8 w-8 border border-border/40">
                  <AvatarImage src={m.photo} alt={m.name} />
                  <AvatarFallback className="bg-blood/20 text-blood font-bold text-xs">{m.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-xs font-bold">{m.name}</p>
                  <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">{m.rankTitle}</p>
                </div>
                <RoleBadge role={m.role} />
              </div>
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG value={`LYC:${m.id}`} size={120} level="M" fgColor="#0a0a0c" bgColor="#ffffff" />
              </div>
              <p className="font-mono text-[9px] text-muted-foreground/70">LYC:{m.id.slice(-8).toUpperCase()}</p>
              <button
                onClick={() => copyCode(m)}
                className="w-full rounded-full border border-border/60 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-blood/50 hover:text-blood"
              >
                نسخ الكود · Copy
              </button>
            </Card>
          </motion.div>
        ))}
      </div>
      {trainees.length === 0 && (
        <div className="flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
          <QrCode className="h-8 w-8 opacity-40" />
          <p className="text-sm">لا توجد أكواد. No fighters found.</p>
        </div>
      )}
    </div>
  );
}
