'use client';

/* ===== Atmospheric layered background: moon, rain, lightning, smoke ===== */
export default function AtmosphericBackground({
  rain = true,
  lightning = true,
  smoke = true,
  moon = true,
  streaks = false,
}: {
  rain?: boolean;
  lightning?: boolean;
  smoke?: boolean;
  moon?: boolean;
  streaks?: boolean;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 75% 8%, color-mix(in oklch, var(--blood) 14%, transparent), transparent 55%), radial-gradient(ellipse at 12% 92%, color-mix(in oklch, var(--ash) 28%, transparent), transparent 60%), var(--background)',
        }}
      />

      {moon && (
        <div
          className="atmo-moon animate-float"
          style={{
            top: '6%',
            right: '8%',
            width: 'clamp(120px, 18vw, 240px)',
            height: 'clamp(120px, 18vw, 240px)',
          }}
        />
      )}

      {smoke && <div className="atmo-smoke" />}
      {rain && <div className="atmo-rain" />}
      {streaks && <div className="atmo-streaks" />}
      {lightning && <div className="atmo-lightning" />}

      {/* vignette */}
      <div className="atmo-vignette" />
    </div>
  );
}
