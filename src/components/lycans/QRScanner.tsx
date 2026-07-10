'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, ScanLine, CheckCircle2, LogIn, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ScanResult {
  action: 'checkin' | 'checkout';
  member: { id: string; name: string; photo: string; rankTitle: string };
  checkIn: string;
  checkOut: string | null;
  durationMin?: number;
}

export default function QRScanner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'qr-reader';
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const lastScanRef = useRef<{ id: string; t: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    setResult(null);
    setError('');
    let mounted = true;

    const start = async () => {
      try {
        const html5 = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = html5;
        await html5.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (decodedText) => {
            if (!mounted) return;
            // debounce same code
            const now = Date.now();
            if (lastScanRef.current && lastScanRef.current.id === decodedText && now - lastScanRef.current.t < 2500) return;
            lastScanRef.current = { id: decodedText, t: now };
            await handleScan(decodedText);
          },
          () => { /* ignore per-frame errors */ }
        );
        if (mounted) setScanning(true);
      } catch (e) {
        if (mounted) setError('Could not access camera. Grant permission and retry.');
      }
    };
    start();

    return () => {
      mounted = false;
      const html5 = scannerRef.current;
      if (html5) {
        html5.stop().then(() => html5.clear()).catch(() => {});
        scannerRef.current = null;
      }
      setScanning(false);
    };
  }, [open]);

  async function handleScan(code: string) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/attendance/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');
      setResult(data);

      // Haptic feedback (vibrate on success)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(data.action === 'checkin' ? [120, 50, 120] : [200]); } catch { /* ignore */ }
      }
      // Soft success beep using Web Audio
      try {
        const AC = (window.AudioContext || (window as any).webkitAudioContext);
        if (AC) {
          const ctx = new AC();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.value = data.action === 'checkin' ? 880 : 660;
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
          osc.start();
          osc.stop(ctx.currentTime + 0.34);
          setTimeout(() => ctx.close(), 600);
        }
      } catch { /* ignore */ }

      toast({
        title: data.action === 'checkin' ? `✓ تم تسجيل الحضور — ${data.member.name}` : `✓ تم تسجيل الانصراف — ${data.member.name}`,
        description: data.action === 'checkout' && data.durationMin ? `مدة التمرين: ${data.durationMin} دقيقة` : `تمام ${new Date(data.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      });
      // pause scanner briefly
      const html5 = scannerRef.current;
      if (html5) {
        html5.pause();
        setTimeout(() => { if (scannerRef.current) scannerRef.current.resume(); }, 2500);
      }
    } catch (e) {
      // Error buzz
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([60, 40, 60]); } catch { /* ignore */ }
      }
      setError(e instanceof Error ? e.message : 'Scan failed');
    } finally {
      setBusy(false);
    }
  }

  async function manualRetry() {
    setResult(null);
    setError('');
    const html5 = scannerRef.current;
    if (html5 && scanning) {
      try { html5.resume(); } catch { /* ignore */ }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blood/30 bg-card p-6 shadow-2xl"
          >
            <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-background/60 p-1.5 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-2">
              <ScanLine className="h-5 w-5" style={{ color: 'var(--blood)' }} />
              <h2 className="font-display text-lg tracking-[0.15em]">QR SCANNER</h2>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">Point at a trainee&apos;s QR code to log arrival / departure.</p>

            {/* Scanner viewport */}
            <div className="relative mx-auto aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl border-2 border-blood/40 bg-black">
              <div id={containerId} className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
              {/* reticle */}
              {!result && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-[60%] w-[60%] rounded-xl border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                  <motion.div
                    className="absolute h-[60%] w-[60%] rounded-xl"
                    style={{ boxShadow: '0 0 18px 2px var(--blood)' }}
                    animate={{ y: [-90, 90, -90] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              )}
              {busy && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-blood" />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-blood/40 bg-blood/10 px-3 py-2 text-xs text-blood">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {/* Result — prominent success with Arabic + English */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="mt-4 overflow-hidden rounded-2xl border-2"
                style={{
                  borderColor: result.action === 'checkin' ? 'color-mix(in oklch, var(--blood) 55%, transparent)' : 'color-mix(in oklch, var(--silver) 55%, transparent)',
                  background: 'linear-gradient(180deg, color-mix(in oklch, ' + (result.action === 'checkin' ? 'var(--blood)' : 'var(--silver)') + ' 14%, transparent), var(--card))',
                }}
              >
                {/* Big success banner */}
                <div className="flex flex-col items-center gap-1 px-4 py-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 320, damping: 14 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      background: result.action === 'checkin' ? 'var(--blood)' : 'var(--silver)',
                      boxShadow: '0 0 32px color-mix(in oklch, ' + (result.action === 'checkin' ? 'var(--blood)' : 'var(--silver)') + ' 60%, transparent)',
                    }}
                  >
                    <CheckCircle2 className="h-9 w-9 text-white" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-1 font-display text-xl tracking-wide text-foreground"
                    dir="rtl"
                  >
                    {result.action === 'checkin' ? 'تم تسجيل الحضور' : 'تم تسجيل الانصراف'}
                  </motion.h3>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {result.action === 'checkin' ? 'Attendance Recorded' : 'Departure Recorded'}
                  </p>
                </div>

                {/* Member card */}
                <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl bg-background/60 p-3">
                  <Avatar className="h-12 w-12 border-2 border-blood/40">
                    <AvatarImage src={result.member.photo} alt={result.member.name} />
                    <AvatarFallback className="bg-blood/20 text-blood">{result.member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{result.member.name}</p>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{result.member.rankTitle}</p>
                  </div>
                </div>

                {/* Times */}
                <div className="mx-3 mb-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-background/50 p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">الحضور · In</p>
                    <p className="mt-0.5 font-mono text-sm font-bold">{new Date(result.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">الانصراف · Out</p>
                    <p className="mt-0.5 font-mono text-sm font-bold">{result.checkOut ? new Date(result.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                  </div>
                </div>

                {result.durationMin !== undefined && (
                  <div className="mx-3 mb-3 flex items-center justify-center gap-1.5 rounded-lg bg-blood/10 py-1.5 text-xs font-bold text-blood">
                    <CheckCircle2 className="h-3.5 w-3.5" /> مدة التمرين: {result.durationMin} دقيقة
                  </div>
                )}

                <button onClick={manualRetry} className="mx-3 mb-3 w-[calc(100%-1.5rem)] rounded-full py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                  style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))' }}>
                  مسح الكود التالي · Scan Next
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
