import { ClawMarks } from '@/components/lycans/logo';
import { Moon } from 'lucide-react';

export default function Offline() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="absolute right-[10%] top-[8%] atmo-moon animate-float h-32 w-32 opacity-60" />
      <div className="atmo-smoke" />
      <div className="relative flex flex-col items-center gap-5">
        <ClawMarks color="var(--blood)" count={4} className="h-16 w-16" />
        <Moon className="h-10 w-10 text-muted-foreground" />
        <h1 className="font-display text-2xl tracking-[0.18em] text-foreground">YOU&apos;RE OFFLINE</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          The moon is hidden behind the clouds. Reconnect to return to the den.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest text-white"
          style={{ background: 'linear-gradient(90deg, var(--blood), color-mix(in oklch, var(--blood) 55%, black))' }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
