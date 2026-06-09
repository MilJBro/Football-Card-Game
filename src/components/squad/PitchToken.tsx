'use client';

import type { PlayerCardDef } from '@/store/types';
import { cn, PACK_STYLES, shortName } from '@/lib/ui';

interface PitchTokenProps {
  card: PlayerCardDef;
  slotLabel: string;
  /** Effective rating in this slot (may be downgraded for out-of-position). */
  effectiveRating?: number;
  onClick?: () => void;
}

/** Compact representation of a card slotted on the pitch. */
export function PitchToken({ card, slotLabel, effectiveRating, onClick }: PitchTokenProps) {
  const style = PACK_STYLES[card.pack];
  const rating = effectiveRating ?? card.rating;
  const oop = effectiveRating !== undefined && effectiveRating < card.rating;

  return (
    <button onClick={onClick} className="flex w-[62px] flex-col items-center">
      <div
        className={cn(
          'relative w-full rounded-lg border-2 px-1 py-1 text-center shadow-lg',
          style.bg,
          oop ? 'border-red-500' : style.border
        )}
      >
        <div
          className={cn(
            'text-lg font-black leading-none tabular-nums',
            oop ? 'text-red-300' : 'text-white'
          )}
        >
          {rating}
        </div>
        <div className="mt-0.5 w-full truncate text-[8px] font-bold uppercase leading-tight text-white/85">
          {shortName(card.playerName)}
        </div>
        {oop && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white">
            !
          </span>
        )}
      </div>
      <span className="mt-0.5 rounded bg-black/70 px-1.5 text-[8px] font-bold uppercase tracking-wide text-white/80">
        {slotLabel}
      </span>
    </button>
  );
}

/** Empty slot placeholder on the pitch. */
export function EmptyToken({ slotLabel, onClick }: { slotLabel: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-[62px] flex-col items-center"
    >
      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 border-dashed border-white/35 bg-black/25 text-white/60 transition-colors hover:border-emerald-400 hover:text-emerald-300">
        <span className="text-lg leading-none">+</span>
      </div>
      <span className="mt-0.5 rounded bg-black/50 px-1.5 text-[8px] font-bold uppercase tracking-wide text-white/60">
        {slotLabel}
      </span>
    </button>
  );
}
