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

const SIZES: Record<
  Size,
  { w: string; name: string; meta: string; rating: string; pos: string; pad: string }
> = {
  sm: { w: 'w-24', name: 'text-[10px]', meta: 'text-[8px]', rating: 'text-2xl', pos: 'text-[8px]', pad: 'p-2' },
  md: { w: 'w-36', name: 'text-xs', meta: 'text-[9px]', rating: 'text-4xl', pos: 'text-[9px]', pad: 'p-2.5' },
  lg: { w: 'w-44', name: 'text-sm', meta: 'text-[10px]', rating: 'text-5xl', pos: 'text-[10px]', pad: 'p-3' },
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
        'group relative flex aspect-[5/7] flex-col overflow-hidden rounded-2xl border text-left transition-transform',
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
          className="pointer-events-none absolute inset-0"
          style={{ background: stripeBg }}
        />
      )}

      {/* Foil shimmer */}
      {foil && <div className="foil-overlay absolute inset-0 animate-shimmer" />}

      {/* Top: rating + tier badge */}
      <div className="relative flex items-start justify-between gap-1">
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
            'rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide',
            tierBadge
          )}
        >
          {card.tier}
        </span>
      </div>

      {/* Positions */}
      <div className="relative mt-1.5 flex flex-wrap items-center gap-1">
        {card.positions.map((p) => (
          <span
            key={p}
            className={cn('rounded px-1.5 py-0.5 font-bold text-white', s.pos, packStyle.posBadge)}
          >
            {p}
          </span>
        ))}
        {downgraded && <span className={cn('font-bold text-red-400', s.pos)}>▼ OOP</span>}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom: player identity */}
      <div className="relative leading-tight">
        <div className="h-px w-full bg-white/15" />
        <div className={cn('mt-1.5 truncate font-extrabold uppercase tracking-tight text-white', s.name)}>
          {card.playerName}
        </div>
        <div className={cn('mt-0.5 truncate text-white/60', s.meta)}>{card.nationality}</div>
        <div className={cn('truncate text-white/40', s.meta)}>
          {card.club} · {card.season}
        </div>
      </div>
    </button>
  );
}
