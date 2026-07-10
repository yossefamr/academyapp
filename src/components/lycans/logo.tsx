import { cn } from '@/lib/utils';

/* ===== Claw Marks — the signature lycan slash ===== */
export function ClawMarks({
  className,
  color = 'currentColor',
  count = 4,
  style,
}: {
  className?: string;
  color?: string;
  count?: 3 | 4;
  style?: React.CSSProperties;
}) {
  const claws = count === 4
    ? [
        { x: 8, w: 7, h: 78, tilt: -10 },
        { x: 30, w: 9, h: 96, tilt: -3 },
        { x: 54, w: 9, h: 100, tilt: 4 },
        { x: 78, w: 7, h: 84, tilt: 11 },
      ]
    : [
        { x: 12, w: 8, h: 92, tilt: -8 },
        { x: 40, w: 10, h: 100, tilt: 0 },
        { x: 70, w: 8, h: 88, tilt: 9 },
      ];

  return (
    <svg
      viewBox="0 0 96 110"
      className={cn('h-full w-full', className)}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="clawGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="55%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
        <filter id="clawDrip">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
      <g filter="url(#clawDrip)">
        {claws.map((c, i) => (
          <g key={i} transform={`rotate(${c.tilt} ${c.x + c.w / 2} 50)`}>
            <path
              d={`M${c.x} 4
                  C ${c.x - 1.5} 30, ${c.x - 2} 60, ${c.x + c.w * 0.4} ${c.h}
                  C ${c.x + c.w + 2} 60, ${c.x + c.w + 1.5} 30, ${c.x + c.w * 0.6} 4
                  Q ${c.x + c.w / 2} 1, ${c.x} 4 Z`}
              fill="url(#clawGrad)"
            />
            {/* tip point */}
            <path
              d={`M${c.x + c.w * 0.4} ${c.h}
                  C ${c.x + c.w * 0.45} ${c.h + 6}, ${c.x + c.w * 0.55} ${c.h + 6}, ${c.x + c.w * 0.6} ${c.h}
                  L ${c.x + c.w * 0.5} ${c.h + 9} Z`}
              fill="url(#clawGrad)"
            />
            {/* base drip */}
            <circle cx={c.x + c.w / 2} cy="3.5" r="2.2" fill={color} fillOpacity="0.7" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ===== Lycans Wordmark — stacked angular text ===== */
export function LycansWordmark({
  className,
  tagline = true,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <div className={cn('flex flex-col items-center leading-none', className)}>
      <span
        className="font-display text-blood-glow"
        style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)', letterSpacing: '0.12em' }}
      >
        LYCANS
      </span>
      <span
        className="font-display text-foreground"
        style={{ fontSize: 'clamp(0.9rem, 2.4vw, 1.5rem)', letterSpacing: '0.42em', marginTop: '0.2em' }}
      >
        FIGHT CLUB
      </span>
      {tagline && (
        <span
          className="font-display text-muted-foreground"
          style={{ fontSize: 'clamp(0.55rem, 1.4vw, 0.78rem)', letterSpacing: '0.32em', marginTop: '0.55em' }}
        >
          FEARLESS&nbsp;FIGHTERS
        </span>
      )}
    </div>
  );
}

/* ===== Full Lycans Logo — claws over wordmark ===== */
export function LycansLogo({
  className,
  clawCount = 4,
  size = 'md',
}: {
  className?: string;
  clawCount?: 3 | 4;
  size?: 'sm' | 'md' | 'lg';
}) {
  const clawH = size === 'lg' ? 96 : size === 'sm' ? 44 : 70;
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <ClawMarks
        color="var(--blood)"
        count={clawCount}
        className="drop-shadow-[0_0_18px_color-mix(in_oklch,var(--blood)_55%,transparent)]"
        style={{ height: clawH }}
      />
      <LycansWordmark />
    </div>
  );
}

/* ===== Circular Emblem — werewolf crest with ribbon ===== */
export function LycansEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lycans Fight Club emblem"
    >
      <defs>
        <radialGradient id="emblemBg" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#1a1a1f" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
        <linearGradient id="furGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9aa0aa" />
          <stop offset="100%" stopColor="#3a3f47" />
        </linearGradient>
        <linearGradient id="bloodEye" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff2a2a" />
          <stop offset="100%" stopColor="#7a0000" />
        </linearGradient>
      </defs>

      {/* outer ring */}
      <circle cx="100" cy="100" r="94" fill="url(#emblemBg)" stroke="#e8e8ea" strokeWidth="3" />
      <circle cx="100" cy="100" r="88" stroke="#e8e8ea" strokeOpacity="0.35" strokeWidth="1" />

      {/* LYCANS top text */}
      <path id="topArc" d="M 24 100 A 76 76 0 0 1 176 100" fill="none" />
      <text fill="#f4f4f5" fontSize="20" fontWeight="900" letterSpacing="6" fontFamily="sans-serif">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">LYCANS</textPath>
      </text>

      {/* MMA bottom text */}
      <path id="botArc" d="M 30 110 A 70 70 0 0 0 170 110" fill="none" />
      <text fill="#f4f4f5" fontSize="13" fontWeight="800" letterSpacing="8" fontFamily="sans-serif">
        <textPath href="#botArc" startOffset="50%" textAnchor="middle">MMA</textPath>
      </text>

      {/* Werewolf head silhouette */}
      <g transform="translate(100 92)">
        {/* ears */}
        <path d="M -38 -22 L -30 -50 L -18 -24 Z" fill="url(#furGrad)" />
        <path d="M 38 -22 L 30 -50 L 18 -24 Z" fill="url(#furGrad)" />
        <path d="M -34 -24 L -29 -42 L -22 -26 Z" fill="#1a1a1f" />
        <path d="M 34 -24 L 29 -42 L 22 -26 Z" fill="#1a1a1f" />
        {/* head */}
        <path
          d="M -42 -10
             C -44 18, -28 40, 0 44
             C 28 40, 44 18, 42 -10
             C 36 -24, 20 -30, 0 -30
             C -20 -30, -36 -24, -42 -10 Z"
          fill="url(#furGrad)"
        />
        {/* snout */}
        <path
          d="M -16 14
             C -16 28, -8 36, 0 38
             C 8 36, 16 28, 16 14
             C 12 22, 6 26, 0 27
             C -6 26, -12 22, -16 14 Z"
          fill="#23262c"
        />
        {/* blood mark over left eye */}
        <path d="M -26 -6 L -22 -2 L -28 4 L -24 8 L -30 14 L -26 18" stroke="url(#bloodEye)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* eyes */}
        <ellipse cx="-15" cy="-6" rx="5" ry="4" fill="#ff3b3b" />
        <ellipse cx="15" cy="-6" rx="5" ry="4" fill="#ff3b3b" />
        <ellipse cx="-15" cy="-6" rx="1.6" ry="3" fill="#1a0000" />
        <ellipse cx="15" cy="-6" rx="1.6" ry="3" fill="#1a0000" />
        {/* fangs */}
        <path d="M -10 24 L -7 34 L -4 24 Z" fill="#f4f4f5" />
        <path d="M 10 24 L 7 34 L 4 24 Z" fill="#f4f4f5" />
        {/* nose */}
        <ellipse cx="0" cy="18" rx="3.2" ry="2.4" fill="#0a0a0c" />
      </g>

      {/* Clenched fists flanking */}
      <g transform="translate(46 124)">
        <path d="M 0 0 C -2 12, 4 24, 14 26 C 24 24, 26 12, 22 0 C 20 -4, 2 -4, 0 0 Z" fill="url(#furGrad)" />
        <path d="M 4 4 L 18 4 M 3 9 L 19 9 M 4 14 L 18 14" stroke="#23262c" strokeWidth="1.5" />
      </g>
      <g transform="translate(132 124)">
        <path d="M 0 0 C -2 12, 4 24, 14 26 C 24 24, 26 12, 22 0 C 20 -4, 2 -4, 0 0 Z" fill="url(#furGrad)" />
        <path d="M 4 4 L 18 4 M 3 9 L 19 9 M 4 14 L 18 14" stroke="#23262c" strokeWidth="1.5" />
      </g>

      {/* diagonal claw slash across */}
      <g transform="rotate(18 100 100)" opacity="0.92">
        <ClawMarks color="#c8102e" count={3} className="h-[120px] w-[120px]" />
      </g>
    </svg>
  );
}

/* ===== Crossed swords decoration ===== */
export function CrossedSwords({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8e8ea" />
          <stop offset="50%" stopColor="#9aa0aa" />
          <stop offset="100%" stopColor="#4a4f57" />
        </linearGradient>
      </defs>
      <g transform="rotate(45 60 60)">
        <rect x="58" y="14" width="4" height="62" fill="url(#bladeGrad)" />
        <polygon points="58,14 62,14 60,6" fill="#e8e8ea" />
        <rect x="50" y="74" width="20" height="4" fill="#3a3f47" />
        <rect x="56" y="78" width="8" height="20" fill="#5a1010" />
        <circle cx="60" cy="100" r="5" fill="#c8102e" />
      </g>
      <g transform="rotate(-45 60 60)">
        <rect x="58" y="14" width="4" height="62" fill="url(#bladeGrad)" />
        <polygon points="58,14 62,14 60,6" fill="#e8e8ea" />
        <rect x="50" y="74" width="20" height="4" fill="#3a3f47" />
        <rect x="56" y="78" width="8" height="20" fill="#5a1010" />
        <circle cx="60" cy="100" r="5" fill="#c8102e" />
      </g>
    </svg>
  );
}
