'use client';

import type { PlayerCardDef } from '@/store/types';
import { cn, PACK_STYLES, TIER_BADGE, TIER_STRIPE_BG } from '@/lib/ui';

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
  const packStyle = PACK_STYLES[card.pack];
  const tierBadge = TIER_BADGE[card.tier];
  const stripeBg = TIER_STRIPE_BG[card.tier];
  const s = SIZES[size];
  const rating = displayRating ?? card.rating;
  const downgraded = displayRating !== undefined && displayRating < card.rating;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 text-left transition-transform',
        packStyle.bg,
        packStyle.border,
        s.w,
        s.pad,
        onClick && 'cursor-pointer hover:scale-[1.04]',
        selected && cn('ring-4', packStyle.ring),
        dimmed && 'opacity-40 grayscale',
        className
      )}
    >
      {/* Tier stripe overlay */}
      {stripeBg && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ background: stripeBg }}
        />
      )}

      {/* Foil shimmer */}
      {foil && <div className="foil-overlay absolute inset-0 animate-shimmer" />}

      <div className="relative flex flex-col gap-1.5">
        {/* Rating + tier badge */}
        <div className="flex items-start justify-between gap-1">
          <span
            className={cn(
              'font-black leading-none tabular-nums',
              s.rating,
              downgraded ? 'text-red-400' : 'text-white'
            )}
          >
            {rating}
          </span>
          <span
            className={cn(
              'rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
              tierBadge
            )}
          >
            {card.tier}
          </span>
        </div>

        {/* Position badges */}
        <div className="flex flex-wrap items-center gap-1">
          {card.positions.map((p) => (
            <span
              key={p}
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-bold text-white',
                packStyle.posBadge
              )}
            >
              {p}
            </span>
          ))}
          {downgraded && (
            <span className="text-[10px] font-bold text-red-400">▼ OOP</span>
          )}
        </div>

        {/* Divider */}
        <div className="my-0.5 border-t border-white/15" />

        {/* Player info */}
        <div>
          <div className={cn('truncate font-black uppercase tracking-tight text-white', s.name)}>
            {card.playerName}
          </div>
          <div className="mt-0.5 truncate text-[10px] font-semibold text-white/70">
            {card.nationality}
          </div>
          <div className="truncate text-[10px] text-white/50">{card.club}</div>
        </div>
      </div>
    </button>
  );
}
