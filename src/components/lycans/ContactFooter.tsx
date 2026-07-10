'use client';

import { Mail, Phone, MapPin, Globe, MessageCircle, Instagram, Facebook, Music2, ExternalLink } from 'lucide-react';
import { ACADEMY } from '@/lib/academy';
import { ClawMarks } from '@/components/lycans/logo';

export default function ContactFooter({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const socials = [
    { icon: Instagram, label: 'Instagram', url: ACADEMY.instagram, color: '#E1306C' },
    { icon: Facebook, label: 'Facebook', url: ACADEMY.facebook, color: '#1877F2' },
    { icon: Music2, label: 'TikTok', url: ACADEMY.tiktok, color: '#ffffff' },
    { icon: Globe, label: 'Website', url: ACADEMY.website, color: 'var(--silver)' },
  ];

  return (
    <footer className="relative mt-16 border-t border-border/40 bg-card/30 backdrop-blur">
      <div className="claw-divider absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Brand row */}
        <div className="flex flex-col items-center gap-4 text-center">
          <ClawMarks color="var(--blood)" count={4} className="h-12 w-12" />
          <div>
            <h3 className="font-display text-lg tracking-[0.15em] text-foreground sm:text-xl">{ACADEMY.name}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{ACADEMY.tagline}</p>
          </div>
          {/* Branches */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {ACADEMY.branches.map((b) => (
              <span key={b} className="rounded-full border border-blood/30 bg-blood/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blood">
                {b} Branch
              </span>
            ))}
          </div>
        </div>

        {variant === 'full' && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <a
              href={`tel:${ACADEMY.phone}`}
              className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-background/40 p-4 transition-all hover:border-blood/40 hover:bg-blood/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood/15">
                <Phone className="h-5 w-5" style={{ color: 'var(--blood)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Call Us</p>
                <p className="truncate text-sm font-bold text-foreground">{ACADEMY.phoneDisplay}</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${ACADEMY.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-background/40 p-4 transition-all hover:border-green-500/40 hover:bg-green-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15">
                <MessageCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">WhatsApp</p>
                <p className="truncate text-sm font-bold text-foreground">{ACADEMY.phoneDisplay}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${ACADEMY.email}`}
              className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-background/40 p-4 transition-all hover:border-blood/40 hover:bg-blood/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood/15">
                <Mail className="h-5 w-5" style={{ color: 'var(--blood)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                <p className="truncate text-sm font-bold text-foreground">{ACADEMY.email}</p>
              </div>
            </a>

            {/* Location */}
            <a
              href={ACADEMY.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-background/40 p-4 transition-all hover:border-blood/40 hover:bg-blood/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood/15">
                <MapPin className="h-5 w-5" style={{ color: 'var(--blood)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Visit Us</p>
                <p className="truncate text-sm font-bold text-foreground">{ACADEMY.addressShort}</p>
                <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-blood">Open in Maps <ExternalLink className="h-2.5 w-2.5" /></p>
              </div>
            </a>
          </div>
        )}

        {/* Address line (full variant) */}
        {variant === 'full' && (
          <div className="mt-5 flex items-start justify-center gap-2 rounded-2xl border border-border/40 bg-background/30 p-3 text-center text-xs text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blood" />
            <span className="mx-auto max-w-2xl">{ACADEMY.address}</span>
          </div>
        )}

        {/* Socials */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Follow The Pack</p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-all hover:scale-110 hover:border-blood/60"
                style={{ color: undefined }}
                onMouseEnter={(e) => (e.currentTarget.style.color = s.color)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border/40 pt-6 text-center">
          <p className="font-display text-[10px] tracking-[0.3em] text-blood/80">
            <a href={ACADEMY.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {ACADEMY.websiteDisplay.toUpperCase()}
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} {ACADEMY.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
