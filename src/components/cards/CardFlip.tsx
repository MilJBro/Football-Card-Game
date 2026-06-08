'use client';

import { motion } from 'framer-motion';
import type { PlayerCardDef } from '@/store/types';
import { PlayerCard } from '@/components/cards/PlayerCard';
import { cn, TIER_STYLES } from '@/lib/ui';

interface CardFlipProps {
  card: PlayerCardDef;
  flipped: boolean;
  foil?: boolean;
  isNew?: boolean;
  onClick?: () => void;
}

/** A card that flips from a generic back to its face on `flipped`. */
export function CardFlip({ card, flipped, foil, isNew, onClick }: CardFlipProps) {
  const styles = TIER_STYLES[card.tier];
  return (
    <div className="relative" style={{ perspective: 1000 }}>
      <motion.div
        className="relative h-[224px] w-40 cursor-pointer [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        onClick={onClick}
      >
        {/* Back */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-xl border-2 border-emerald-700 bg-gradient-to-b from-emerald-900 to-emerald-950 [backface-visibility:hidden]'
          )}
        >
          <span className="text-3xl font-black text-emerald-500">⚽</span>
        </div>

        {/* Front */}
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <PlayerCard card={card} foil={foil} className="!w-40" />
          {isNew && flipped && (
            <span className="absolute -right-1 -top-1 animate-coin-pop rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-emerald-950">
              NEW
            </span>
          )}
          {foil && flipped && (
            <span
              className={cn(
                'absolute -left-1 -top-1 rounded-full bg-pl-cyan px-2 py-0.5 text-[10px] font-black text-pl-purple'
              )}
            >
              FOIL
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
