'use client';

import type { PackCategory } from '@/store/types';
import { GlovesIcon, WallIcon, TargetIcon, CompassStarIcon } from '@/components/ui/icons';

// Per-category accent used for the glow + ring behind the emblem.
const ACCENT: Record<PackCategory, string> = {
  GK: '#00ff85',
  DEF: '#f5b301',
  MID: '#04f5ff',
  ATT: '#e90052',
};

const ICON: Record<PackCategory, (props: { className?: string }) => JSX.Element> = {
  GK: GlovesIcon,
  DEF: WallIcon,
  MID: CompassStarIcon,
  ATT: TargetIcon,
};

/** Self-contained pack art: the category emblem over a category-tinted glow disc. */
export function PackArt({
  category,
  className,
}: {
  category: PackCategory;
  className?: string;
}) {
  const accent = ACCENT[category];
  const Emblem = ICON[category];

  return (
    <div
      className={className}
      style={{
        background: `radial-gradient(closest-side, ${accent}33, ${accent}10 60%, transparent 72%)`,
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-full"
        style={{ color: accent }}
      >
        <Emblem className="h-3/5 w-3/5 drop-shadow-[0_0_10px_currentColor]" />
      </div>
    </div>
  );
}
