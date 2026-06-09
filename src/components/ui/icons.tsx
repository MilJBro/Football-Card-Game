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

/** Goalkeeper glove — GK packs. */
export function GlovesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g fill="currentColor">
        {/* Thumb */}
        <rect
          x="3.6"
          y="10.5"
          width="2.6"
          height="6"
          rx="1.3"
          transform="rotate(-35 4.9 13.5)"
        />
        {/* Four fingers */}
        <rect x="6.8" y="6.5" width="2.6" height="8.5" rx="1.3" />
        <rect x="9.7" y="5.2" width="2.6" height="9.8" rx="1.3" />
        <rect x="12.6" y="6" width="2.6" height="9" rx="1.3" />
        <rect x="15.5" y="7.8" width="2.5" height="7.2" rx="1.25" />
        {/* Palm with rounded base */}
        <path d="M6.5 12h12v3.5a3.5 3.5 0 0 1-3.5 3.5h-5A3.5 3.5 0 0 1 6.5 15.5Z" />
      </g>
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
