'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScanLine, Sun, Moon, Maximize2 } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RankBadge, SkillBadge } from '@/components/lycans/badges';
import { ClawMarks } from '@/components/lycans/logo';
import { useEffect, useState } from 'react';

export default function QRPassModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAppStore((s) => s.user);
  const [bright, setBright] = useState(false);

  // Keep screen awake while pass is open
  useEffect(() => {
    if (!open) return;
    let wakeLock: any = null;
    const req = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch { /* ignore */ }
    };
    req();
    return () => { try { wakeLock?.release(); } catch { /* ignore */ } };
  }, [open]);

  if (!user) return null;
  const qrValue = `LYC:${user.id}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: bright ? 'rgba(255,255,255,0.97)' : 'rgba(0,0,0,0.92)' }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 transition-colors"
            style={{ color: bright ? '#000' : '#fff', background: bright ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)' }}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Brightness toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); setBright((b) => !b); }}
            className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
            style={{ color: bright ? '#000' : '#fff', background: bright ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)' }}
          >
            {bright ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {bright ? 'Bright' : 'Dim'}
          </button>

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl p-6 text-center"
            style={{
              background: bright ? '#fff' : 'linear-gradient(180deg, #14141a, #0a0a0c)',
              color: bright ? '#0a0a0c' : '#fff',
              border: bright ? '1px solid #eee' : '1px solid rgba(200,16,46,0.4)',
              boxShadow: '0 0 60px rgba(200,16,46,0.25)',
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center gap-1">
              <ClawMarks color="var(--blood)" count={3} className="h-7 w-7" />
              <h2 className="font-display text-lg tracking-[0.18em]" style={{ color: 'var(--blood)' }}>
                LYCANS PACK PASS
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">باس الحضور</p>
            </div>

            {/* Avatar + name */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16 border-4 border-blood/40">
                <AvatarImage src={user.photo} alt={user.name} />
                <AvatarFallback className="bg-blood/20 text-2xl font-black text-blood">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-display text-base tracking-wide">{user.name}</p>
                <p className="text-[11px] uppercase tracking-wider opacity-60">{user.rankTitle}</p>
              </div>
            </div>

            {/* QR code */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-2xl bg-white p-4"
            >
              <QRCodeSVG value={qrValue} size={200} level="H" fgColor="#0a0a0c" bgColor="#ffffff" />
            </motion.div>

            <p className="text-[10px] font-mono opacity-50">{qrValue}</p>

            {/* Instruction */}
            <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider"
              style={{ background: 'color-mix(in oklch, var(--blood) 15%, transparent)', color: 'var(--blood)' }}>
              <ScanLine className="h-4 w-4" />
              اعرض الكود للمدرب · Show to coach
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <RankBadge rank={user.rank} title={user.rankTitle} />
              <SkillBadge level={user.skillLevel} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
