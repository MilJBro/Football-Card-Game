// Simple, self-contained line/solid SVG icons. All use `currentColor` so they
// inherit text colour from their container.

interface IconProps {
  className?: string;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Referee whistle — Simulation. */
export function WhistleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        {...stroke}
        d="M21 8.5H11a5.5 5.5 0 1 0 4.4 8.8L21 13.5a1 1 0 0 0 .8-1V9.5a1 1 0 0 0-.8-1Z"
      />
      <circle {...stroke} strokeWidth={1.6} cx="8.5" cy="14" r="1.9" />
      <path {...stroke} d="M14.5 8.5V6" />
    </svg>
  );
}

/** Substitutes bench — Squad. */
export function BenchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path {...stroke} d="M3 9h18" />
      <path {...stroke} d="M3 14h18" />
      <path {...stroke} d="M5 9v5M12 9v5M19 9v5" />
      <path {...stroke} d="M5 14v6M19 14v6" />
    </svg>
  );
}

/** Trading card — Packs. */
export function CardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect {...stroke} x="5" y="3" width="14" height="18" rx="2.5" />
      <path
        fill="currentColor"
        d="m12 7 1.2 2.6 2.8.3-2.1 1.9.6 2.8L12 14.1 9.5 15.5l.6-2.8L8 10.9l2.8-.3Z"
      />
    </svg>
  );
}

/** Level-up double chevron — Upgrades. */
export function UpgradeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path {...stroke} strokeWidth={2.2} d="M6 13l6-6 6 6" />
      <path {...stroke} strokeWidth={2.2} d="M6 18l6-6 6 6" />
    </svg>
  );
}

/** Football goal — GK packs. */
export function GoalIcon({ className }: IconProps) {
  const net = { fill: 'none', stroke: 'currentColor', strokeWidth: 1, strokeLinecap: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {/* Net mesh */}
      <path {...net} d="M8 6v12M12 6v12M16 6v12M4 10h16M4 14h16" />
      {/* Goal frame + ground line */}
      <path {...stroke} d="M4 18V6h16v12" />
      <path {...stroke} d="M2 18h20" />
    </svg>
  );
}

/** Brick wall — Defender packs. */
export function WallIcon({ className }: IconProps) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect {...s} x="3" y="5" width="18" height="14" rx="1" />
      <path {...s} d="M3 9.7h18M3 14.3h18" />
      <path {...s} d="M9 5v4.7M15 5v4.7" />
      <path {...s} d="M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6" />
      <path {...s} d="M9 14.3V19M15 14.3V19" />
    </svg>
  );
}

/** Target — Attacker packs. */
export function TargetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle {...stroke} cx="12" cy="12" r="9" />
      <circle {...stroke} cx="12" cy="12" r="5" />
      <circle fill="currentColor" cx="12" cy="12" r="1.8" />
    </svg>
  );
}

/** Compass star — Midfielder packs (all-round / good at everything). */
export function CompassStarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2 15.4 8.6 22 12 15.4 15.4 12 22 8.6 15.4 2 12 8.6 8.6Z"
      />
    </svg>
  );
}

/** Trophy — Cup Run. */
export function TrophyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path {...stroke} d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path {...stroke} d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
      <path {...stroke} d="M12 14v3M9 20h6M10 20l.5-3h3l.5 3" />
    </svg>
  );
}

/** Globe — European Tour. */
export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle {...stroke} cx="12" cy="12" r="9" />
      <path {...stroke} d="M3 12h18" />
      <path {...stroke} d="M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
    </svg>
  );
}

/** Shield — Invincibles. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path {...stroke} d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z" />
      <path {...stroke} d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Medal — Centurions. */
export function MedalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path {...stroke} d="M8 3 6 9M16 3l2 6" />
      <circle {...stroke} cx="12" cy="15" r="5.5" />
      <path {...stroke} d="m12 12.5 1 2 2 .2-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 14.7l2-.2Z" />
    </svg>
  );
}

/** Crown — The Quadruple. */
export function CrownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path {...stroke} d="M4 8l3 9h10l3-9-5 4-3-6-3 6-5-4Z" />
      <path {...stroke} d="M7 20h10" />
    </svg>
  );
}
