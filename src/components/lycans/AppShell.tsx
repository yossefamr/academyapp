'use client';

import { LogOut, Home, MessageSquare, Star, Shield, Swords } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { ClawMarks } from '@/components/lycans/logo';
import ThemeToggle from '@/components/lycans/ThemeToggle';
import { RoleBadge, SkillBadge, RankBadge } from '@/components/lycans/badges';
import { cn } from '@/lib/utils';
import type { ScreenView } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const NAV: { view: ScreenView; label: string; icon: typeof Home; adminOnly?: boolean }[] = [
  { view: 'dashboard', label: 'Home', icon: Home },
  { view: 'chat', label: 'Chat', icon: MessageSquare },
  { view: 'feedback', label: 'Feedback', icon: Star },
  { view: 'admin', label: 'Admin', icon: Shield, adminOnly: true },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const logout = useAppStore((s) => s.logout);
  const { toast } = useToast();

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const navItems = NAV.filter((n) => !n.adminOnly || isAdmin);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    logout();
    toast({ title: 'Signed out', description: 'Until the moon rises again. 🌙' });
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border/50 bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6">
        <button onClick={() => setView('dashboard')} className="flex items-center gap-2.5">
          <ClawMarks color="var(--blood)" count={3} className="h-7 w-7" />
          <span className="font-display text-sm tracking-[0.25em] text-foreground sm:text-base">LYCANS</span>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:inline">Fight Club</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              data-active={view === item.view}
              className={cn(
                'nav-claw relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors',
                view === item.view ? 'text-blood' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9 border-2 border-blood/40">
              <AvatarImage src={user.photo} alt={user.name} />
              <AvatarFallback className="bg-blood/20 text-blood font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold leading-tight">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{user.rankTitle}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-blood/60 hover:text-blood"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="sticky bottom-0 z-40 flex items-center justify-around border-t border-border/50 bg-background/85 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors',
              view === item.view ? 'text-blood' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: typeof Swords }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blood/30 bg-blood/10">
          <Icon className="h-5 w-5" style={{ color: 'var(--blood)' }} />
        </div>
      )}
      <div>
        <h1 className="font-display text-xl tracking-[0.15em] text-foreground sm:text-2xl">{title}</h1>
        {subtitle && <p className="text-xs uppercase tracking-wider text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
