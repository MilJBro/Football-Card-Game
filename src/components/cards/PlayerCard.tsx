'use client';

import type { PlayerCardDef, PackCategory } from '@/store/types';
import { getEffectiveCardData } from '@/data/players';
import { cn } from '@/lib/ui';

export type Size = 'sm' | 'md' | 'lg';

// WC-themed accent per pack — matches the game's colour tokens.
const PACK_THEME: Record<PackCategory, {
  border: string; glow: string; text: string; accentBg: string;
}> = {
  GK:  { border: '#3CAC3B', glow: '0 0 22px rgba(60,172,59,0.50)',   text: '#72CB71', accentBg: 'rgba(60,172,59,0.13)'   },
  DEF: { border: '#7AAEF7', glow: '0 0 22px rgba(122,174,247,0.50)', text: '#7AAEF7', accentBg: 'rgba(122,174,247,0.13)' },
  MID: { border: '#7AAEF7', glow: '0 0 22px rgba(122,174,247,0.50)', text: '#7AAEF7', accentBg: 'rgba(122,174,247,0.13)' },
  ATT: { border: '#E61D25', glow: '0 0 22px rgba(230,29,37,0.50)',   text: '#ff6b6b', accentBg: 'rgba(230,29,37,0.13)'   },
};

const SIZES: Record<Size, {
  w: string; stripH: string; ratingPt: string; rating: string;
  pillPx: string; pillText: string; footerPx: string; footerPb: string;
  label: string; val: string; name: string;
}> = {
  sm: {
    w: 'w-24',       stripH: 'h-1',    ratingPt: 'pt-3 pb-2',
    rating: 'text-3xl', pillPx: 'px-2 py-px', pillText: 'text-[7px]',
    footerPx: 'px-2', footerPb: 'pb-2',
    label: 'text-[5.5px]', val: 'text-[7.5px]', name: 'text-[8.5px]',
  },
  md: {
    w: 'w-36',       stripH: 'h-1.5',  ratingPt: 'pt-5 pb-3',
    rating: 'text-5xl', pillPx: 'px-2.5 py-0.5', pillText: 'text-[9px]',
    footerPx: 'px-3', footerPb: 'pb-2.5',
    label: 'text-[7px]', val: 'text-[9px]', name: 'text-[10px]',
  },
  lg: {
    w: 'w-44',       stripH: 'h-2',    ratingPt: 'pt-6 pb-4',
    rating: 'text-6xl', pillPx: 'px-3 py-1', pillText: 'text-[11px]',
    footerPx: 'px-4', footerPb: 'pb-3',
    label: 'text-[8px]', val: 'text-[11px]', name: 'text-xs',
  },
};

interface PlayerCardProps {
  card: PlayerCardDef;
  size?: Size;
  upgradeLevel?: 0 | 1 | 2;
  foil?: boolean;
  selected?: boolean;
  dimmed?: boolean;
  /** Rating override for out-of-position display. */
  displayRating?: number;
  /** Show only surname in compact contexts. */
  showLastNameOnly?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PlayerCard({
  card,
  size = 'md',
  upgradeLevel = 0,
  foil = false,
  selected = false,
  dimmed = false,
  displayRating,
  showLastNameOnly = false,
  onClick,
  className,
}: PlayerCardProps) {
  const theme = PACK_THEME[card.pack];
  const s = SIZES[size];
  const eff = getEffectiveCardData(card, upgradeLevel);
  const rating = displayRating ?? eff.rating;
  const downgraded = displayRating !== undefined && displayRating < eff.rating;
  const ratingColor = downgraded ? '#f87171' : theme.text;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      style={{
        border: `2px solid ${theme.border}`,
        boxShadow: selected
          ? `0 0 0 3px ${theme.border}, ${theme.glow}`
          : theme.glow,
        background: 'linear-gradient(175deg, #0F1E3A 0%, #060D1E 100%)',
      }}
      className={cn(
        'group relative flex aspect-[5/7] flex-col overflow-hidden rounded-2xl text-left transition-transform',
        s.w,
        onClick && 'cursor-pointer hover:scale-[1.04]',
        dimmed && 'opacity-40 grayscale',
        className,
      )}
    >
      {foil && <div className="foil-overlay absolute inset-0 animate-shimmer" />}

      {/* Pack colour strip */}
      <div className={s.stripH} style={{ background: theme.border }} />

      {/* Rating + position pill */}
      <div className={cn('flex flex-col items-center justify-center', s.ratingPt)}>
        <div
          className={cn('font-black leading-none tabular-nums', s.rating)}
          style={{ color: ratingColor }}
        >
          {rating}
          {downgraded && <span className="ml-1 text-sm align-middle">▼</span>}
        </div>
        <div
          className={cn('mt-1.5 rounded-full font-black uppercase tracking-widest', s.pillPx, s.pillText)}
          style={{ background: theme.accentBg, color: theme.text, border: `1px solid ${theme.border}` }}
        >
          {eff.positions.join(' · ')}
        </div>
      </div>

      <div className="flex-1" />

      {/* Footer info */}
      <div className={cn(s.footerPx, s.footerPb)}>
        <div className="h-px w-full" style={{ background: `${theme.border}40` }} />
        <div className="mt-1 space-y-0.5">
          <div className="flex items-center justify-between">
            <span
              className={cn('font-bold uppercase tracking-widest', s.label)}
              style={{ color: `${theme.text}70` }}
            >
              WC
            </span>
            <span className={cn('font-bold text-white tabular-nums', s.val)}>
              {eff.season}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={cn('font-bold uppercase tracking-widest', s.label)}
              style={{ color: `${theme.text}70` }}
            >
              Nation
            </span>
            <span className={cn('font-bold text-white', s.val)}>
              {card.nationality}
            </span>
          </div>
        </div>
        <div className="mt-1 h-px w-full" style={{ background: `${theme.border}40` }} />
        <div
          className={cn('mt-1.5 text-center font-black uppercase tracking-wide text-white', s.name)}
        >
          {showLastNameOnly
            ? card.playerName.split(' ').at(-1)
            : card.playerName}
        </div>
      </div>
    </button>
  );
}
