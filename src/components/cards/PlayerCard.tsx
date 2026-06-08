'use client';

import type { PlayerCardDef } from '@/store/types';
import { cn, TIER_STYLES } from '@/lib/ui';

type Size = 'sm' | 'md' | 'lg';

interface PlayerCardProps {
  card: PlayerCardDef;
  size?: Size;
  foil?: boolean;
  selected?: boolean;
  dimmed?: boolean;
  /** Optional rating override (e.g. effective rating in a squad slot). */
  displayRating?: number;
  onClick?: () => void;
  className?: string;
}

const SIZES: Record<Size, { w: string; name: string; rating: string; pad: string }> = {
  sm: { w: 'w-28', name: 'text-[11px]', rating: 'text-2xl', pad: 'p-2' },
  md: { w: 'w-40', name: 'text-sm', rating: 'text-4xl', pad: 'p-3' },
  lg: { w: 'w-52', name: 'text-base', rating: 'text-5xl', pad: 'p-4' },
};

export function PlayerCard({
  card,
  size = 'md',
  foil = false,
  selected = false,
  dimmed = false,
  displayRating,
  onClick,
  className,
}: PlayerCardProps) {
  const styles = TIER_STYLES[card.tier];
  const s = SIZES[size];
  const rating = displayRating ?? card.rating;
  const downgraded = displayRating !== undefined && displayRating < card.rating;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 bg-gradient-to-b text-left transition-transform',
        styles.border,
        styles.gradient,
        s.w,
        s.pad,
        onClick && 'cursor-pointer hover:scale-[1.04]',
        selected && cn('ring-4', styles.ring),
        !selected && styles.glow,
        dimmed && 'opacity-40 grayscale',
        className
      )}
    >
      {/* Foil shimmer */}
      {foil && <div className="foil-overlay absolute inset-0 animate-shimmer" />}

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col">
          <span className={cn('font-black leading-none tabular-nums', s.rating, styles.text)}>
            {rating}
          </span>
          <span className="mt-1 flex flex-wrap gap-1">
            {card.positions.map((p) => (
              <span
                key={p}
                className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white/90"
              >
                {p}
              </span>
            ))}
          </span>
          {downgraded && (
            <span className="mt-1 text-[10px] font-bold text-red-400">
              ▼ out of position
            </span>
          )}
        </div>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            styles.border,
            styles.text
          )}
        >
          {card.tier}
        </span>
      </div>

      {/* Player silhouette placeholder */}
      <div className="relative my-2 flex h-16 items-center justify-center text-4xl opacity-70">
        👤
      </div>

      <div className="relative border-t border-white/15 pt-2">
        <div className={cn('truncate font-bold uppercase tracking-tight', s.name)}>
          {card.playerName}
        </div>
        <div className="truncate text-[10px] text-white/60">{card.era}</div>
      </div>
    </button>
  );
}
