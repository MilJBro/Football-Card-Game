'use client';

import { useId } from 'react';
import type { PackCategory } from '@/store/types';

// Per-category accent used for the glow behind the ball.
const GLOW: Record<PackCategory, string> = {
  GK: '#00ff85',
  DEF: '#f5b301',
  MID: '#04f5ff',
  ATT: '#e90052',
};

const ICON: Record<PackCategory, string> = {
  GK: '🧤',
  DEF: '🛡️',
  MID: '🎯',
  ATT: '⚡',
};

function pentagon(cx: number, cy: number, r: number, rotDeg: number): string {
  return Array.from({ length: 5 }, (_, i) => {
    const a = ((rotDeg - 90 + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

/** Self-contained SVG pack art: a soccer ball over a category-tinted glow. */
export function PackArt({
  category,
  className,
}: {
  category: PackCategory;
  className?: string;
}) {
  const uid = useId();
  const glow = GLOW[category];
  const C = 32;
  const BALL_R = 22;

  // Five seam endpoints on the rim + the centre-pentagon vertices they join to.
  const arms = Array.from({ length: 5 }, (_, i) => {
    const aDeg = -90 + i * 72;
    const a = (aDeg * Math.PI) / 180;
    return {
      vx: C + 9 * Math.cos(a), // centre-pentagon vertex
      vy: C + 9 * Math.sin(a),
      ex: C + BALL_R * Math.cos(a), // rim point
      ey: C + BALL_R * Math.sin(a),
      rot: aDeg + 180,
    };
  });

  return (
    <div className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <defs>
          <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.65" />
            <stop offset="65%" stopColor={glow} stopOpacity="0.12" />
            <stop offset="100%" stopColor={glow} stopOpacity="0" />
          </radialGradient>
          <clipPath id={`ball-${uid}`}>
            <circle cx={C} cy={C} r={BALL_R} />
          </clipPath>
        </defs>

        {/* Category glow */}
        <circle cx={C} cy={C} r={31} fill={`url(#glow-${uid})`} />

        {/* Ball body */}
        <circle cx={C} cy={C} r={BALL_R} fill="#fcfcfc" />

        {/* Black panels, clipped to the ball */}
        <g clipPath={`url(#ball-${uid})`}>
          {arms.map((arm, i) => (
            <line
              key={`s${i}`}
              x1={arm.vx}
              y1={arm.vy}
              x2={arm.ex}
              y2={arm.ey}
              stroke="#0c0c0c"
              strokeWidth="1.1"
            />
          ))}
          <polygon points={pentagon(C, C, 9, 0)} fill="#0c0c0c" />
          {arms.map((arm, i) => (
            <polygon
              key={`p${i}`}
              points={pentagon(arm.ex, arm.ey, 5, arm.rot)}
              fill="#0c0c0c"
            />
          ))}
        </g>

        {/* Ball outline */}
        <circle cx={C} cy={C} r={BALL_R} fill="none" stroke="#0c0c0c" strokeWidth="1.2" />
      </svg>

      {/* Category emblem */}
      <div className="pointer-events-none -mt-6 flex justify-center">
        <span className="rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-base backdrop-blur">
          {ICON[category]}
        </span>
      </div>
    </div>
  );
}
