'use client';

import type { PlayerCardDef } from '@/store/types';
import { cn, PACK_STYLES } from '@/lib/ui';

export type Size = 'sm' | 'md' | 'lg';

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

const SIZES: Record<Size, {
  w: string; rating: string; pos: string;
  label: string; val: string; name: string;
  pad: string; dot: string; rowPy: string;
}> = {
  sm: { w: 'w-24',  rating: 'text-3xl', pos: 'text-[9px]',  label: 'text-[6px]',  val: 'text-[8px]',  name: 'text-[9px]',  pad: 'p-2',   dot: 'h-2.5 w-2.5', rowPy: 'py-0.5' },
  md: { w: 'w-36',  rating: 'text-4xl', pos: 'text-[11px]', label: 'text-[7px]',  val: 'text-[10px]', name: 'text-[11px]', pad: 'p-2.5', dot: 'h-3 w-3',     rowPy: 'py-1'   },
  lg: { w: 'w-44',  rating: 'text-5xl', pos: 'text-[13px]', label: 'text-[8px]',  val: 'text-[12px]', name: 'text-sm',     pad: 'p-3',   dot: 'h-3.5 w-3.5', rowPy: 'py-1.5' },
};

const TIER_DOT: Record<string, string> = {
  Rising: 'bg-amber-400',
  Star:   'bg-slate-300',
  Legend: 'bg-red-500',
};

/** "2008" → "2007/08", "1993" → "1992/93" */
function toSeason(year: string): string {
  const y = parseInt(year, 10);
  if (isNaN(y)) return year;
  return `${y - 1}/${String(y).slice(2).padStart(2, '0')}`;
}

export function PlayerCard({
  card, size = 'md', foil = false, selected = false,
  dimmed = false, displayRating, onClick, className,
}: PlayerCardProps) {
  const packStyle = PACK_STYLES[card.pack];
  const s = SIZES[size];
  const rating = displayRating ?? card.rating;
  const downgraded = displayRating !== undefined && displayRating < card.rating;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'group relative flex aspect-[5/7] flex-col overflow-hidden rounded-2xl border-2 text-left transition-transform',
        'bg-[#1c0d00]',
        packStyle.border,
        packStyle.glow,
        s.w,
        s.pad,
        onClick && 'cursor-pointer hover:scale-[1.04]',
        selected && cn('ring-4', packStyle.ring),
        dimmed && 'opacity-40 grayscale',
        className,
      )}
    >
      {foil && <div className="foil-overlay absolute inset-0 animate-shimmer" />}

      {/* Rating + tier dot */}
      <div className="relative flex items-start justify-between">
        <div>
          <div className={cn(
            'font-black leading-none tabular-nums',
            s.rating,
            downgraded ? 'text-red-400' : 'text-amber-400',
          )}>
            {rating}
          </div>
          <div className={cn(
            'mt-0.5 font-bold',
            s.pos,
            downgraded ? 'text-red-400' : 'text-amber-500/80',
          )}>
            {card.positions[0]}
            {downgraded && <span className="ml-1">▼</span>}
          </div>
        </div>
        <div className={cn('rounded-full', s.dot, TIER_DOT[card.tier])} />
      </div>

      <div className="flex-1" />

      {/* SEASON / CLUB / NATION rows */}
      <div className="relative">
        {([
          { label: 'SEASON', value: toSeason(card.season) },
          { label: 'CLUB',   value: card.club             },
          { label: 'NATION', value: card.nationality      },
        ] as const).map(({ label, value }) => (
          <div key={label}>
            <div className="h-px w-full bg-white/10" />
            <div className={cn('flex items-center justify-between', s.rowPy)}>
              <span className={cn('font-bold uppercase tracking-wider text-amber-900/90', s.label)}>
                {label}
              </span>
              <span className={cn('font-bold text-white', s.val)}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Player name */}
      <div className={cn(
        'relative mt-1.5 border-t border-white/10 pt-1.5 text-center font-black uppercase tracking-tight text-white',
        s.name,
      )}>
        {card.playerName}
      </div>
    </button>
  );
}
