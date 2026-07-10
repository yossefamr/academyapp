import { cn } from '@/lib/utils';
import type { SkillLevel, Role } from '@/lib/types';
import { SKILL_LABELS, SKILL_ORDER } from '@/lib/types';
import { Crown, Shield, Swords } from 'lucide-react';

export function SkillBadge({ level, className }: { level: SkillLevel; className?: string }) {
  const idx = SKILL_ORDER.indexOf(level);
  const intensity = ['opacity-60', 'opacity-70', 'opacity-80', 'opacity-90', 'opacity-95', 'opacity-100'][idx];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border',
        className
      )}
      style={{
        color: 'var(--blood)',
        borderColor: 'color-mix(in oklch, var(--blood) 45%, transparent)',
        background: 'color-mix(in oklch, var(--blood) 12%, transparent)',
      }}
    >
      <Swords className={cn('h-3 w-3', intensity)} />
      {SKILL_LABELS[level]}
    </span>
  );
}

export function RankBadge({ rank, title, className }: { rank: number; title: string; className?: string }) {
  const tier = rank >= 7 ? 'gold' : rank >= 5 ? 'silver' : rank >= 3 ? 'bronze' : 'ash';
  const colors: Record<string, { fg: string; bg: string; bd: string }> = {
    gold: { fg: '#f5d97a', bg: 'rgba(245,217,122,0.12)', bd: 'rgba(245,217,122,0.5)' },
    silver: { fg: 'var(--silver)', bg: 'color-mix(in oklch, var(--silver) 14%, transparent)', bd: 'color-mix(in oklch, var(--silver) 50%, transparent)' },
    bronze: { fg: '#d98a4a', bg: 'rgba(217,138,74,0.12)', bd: 'rgba(217,138,74,0.5)' },
    ash: { fg: 'var(--muted-foreground)', bg: 'color-mix(in oklch, var(--muted) 50%, transparent)', bd: 'color-mix(in oklch, var(--muted-foreground) 35%, transparent)' },
  };
  const c = colors[tier];
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border', className)}
      style={{ color: c.fg, borderColor: c.bd, background: c.bg }}
    >
      <Crown className="h-3 w-3" />
      #{rank} {title}
    </span>
  );
}

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const map: Record<Role, { label: string; icon: typeof Crown; fg: string; bg: string; bd: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', icon: Crown, fg: '#f5d97a', bg: 'rgba(245,217,122,0.12)', bd: 'rgba(245,217,122,0.5)' },
    ADMIN: { label: 'Coach', icon: Shield, fg: 'var(--blood)', bg: 'color-mix(in oklch, var(--blood) 14%, transparent)', bd: 'color-mix(in oklch, var(--blood) 50%, transparent)' },
    TRAINEE: { label: 'Trainee', icon: Swords, fg: 'var(--silver)', bg: 'color-mix(in oklch, var(--silver) 12%, transparent)', bd: 'color-mix(in oklch, var(--silver) 40%, transparent)' },
  };
  const c = map[role];
  const Icon = c.icon;
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border', className)}
      style={{ color: c.fg, borderColor: c.bd, background: c.bg }}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
