'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlayerCardDef, Squad } from '@/store/types';
import type { Position } from '@/store/types';
import { getFormation } from '@/data/formations';
import { ALL_CARDS } from '@/data/players';
import { useGameStore } from '@/store/useGameStore';
import { PlayerCard } from '@/components/cards/PlayerCard';
import { Button } from '@/components/ui/Button';

const POSITION_TO_PACK: Record<Position, PlayerCardDef['pack']> = {
  GK: 'GK',
  RB: 'DEF', CB: 'DEF', LB: 'DEF',
  CM: 'MID',
  RW: 'ATT', LW: 'ATT', ST: 'ATT',
};

type ReelSymbol = 'new-player' | 'upgrade-token';

const REEL_SEQUENCE: ReelSymbol[] = [
  'new-player', 'upgrade-token', 'new-player', 'upgrade-token',
  'new-player', 'upgrade-token', 'new-player', 'upgrade-token',
];

// Spin delays in ms — starts fast, slows to a stop
const SPIN_DELAYS = [60, 65, 70, 80, 95, 115, 140, 170, 210, 260, 320, 390];

type Reward =
  | { type: 'new-player'; slotId: string; position: Position; positionLabel: string; card: PlayerCardDef }
  | { type: 'upgrade-token' };

function determineReward(squad: Squad): Reward {
  const formation = getFormation(squad.formation);

  // Prefer empty slots, fall back to any slot
  const emptySlots = formation.slots.filter((s) => !squad.assignments[s.slotId]);
  const candidates = emptySlots.length > 0 ? emptySlots : formation.slots;
  const slot = candidates[Math.floor(Math.random() * candidates.length)];
  const position = slot.naturalPosition;
  const pack = POSITION_TO_PACK[position];

  const pool = ALL_CARDS.filter((c) => c.pack === pack && c.positions.includes(position));
  const canGivePlayer = pool.length > 0;

  // 50/50 split, but force upgrade-token if no players available
  if (!canGivePlayer || Math.random() < 0.5) {
    return { type: 'upgrade-token' };
  }

  const card = pool[Math.floor(Math.random() * pool.length)];
  return { type: 'new-player', slotId: slot.slotId, position, positionLabel: slot.label, card };
}

interface SeasonRewardProps {
  squad: Squad;
  onClaim: (squad: Squad) => void;
  onDismiss: () => void;
}

export function SeasonReward({ squad, onClaim, onDismiss }: SeasonRewardProps) {
  const addCards = useGameStore((s) => s.addCards);
  const addUpgradeToken = useGameStore((s) => s.addUpgradeToken);

  const reward = useMemo(() => determineReward(squad), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [spinning, setSpinning] = useState(true);
  const [currentSymbol, setCurrentSymbol] = useState<ReelSymbol>('new-player');
  const [claimed, setClaimed] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [flipDone, setFlipDone] = useState(false);
  const delayIdx = useRef(0);
  const reelIdx = useRef(0);

  useEffect(() => {
    function tick() {
      reelIdx.current = (reelIdx.current + 1) % REEL_SEQUENCE.length;
      setCurrentSymbol(REEL_SEQUENCE[reelIdx.current]);
      delayIdx.current += 1;

      if (delayIdx.current < SPIN_DELAYS.length) {
        setTimeout(tick, SPIN_DELAYS[delayIdx.current]);
      } else {
        // Land on the result
        setCurrentSymbol(reward.type);
        setSpinning(false);
      }
    }
    setTimeout(tick, SPIN_DELAYS[0]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function claim() {
    if (reward.type === 'upgrade-token') {
      addUpgradeToken();
      setClaimed(true);
    } else {
      addCards([reward.card.id]);
      setFlipping(true);
    }
  }

  function onFlipComplete() {
    setFlipDone(true);
    if (reward.type !== 'new-player') return;
    const updatedSquad: Squad = {
      ...squad,
      assignments: { ...squad.assignments, [reward.slotId]: reward.card.id },
    };
    onClaim(updatedSquad);
    setClaimed(true);
  }

  const isNewPlayer = reward.type === 'new-player';
  const symbolConfig = {
    'new-player': { icon: '🃏', label: 'New Player', color: 'text-emerald-300', border: 'border-emerald-400' },
    'upgrade-token': { icon: '⬆', label: 'Upgrade Token', color: 'text-amber-300', border: 'border-amber-400' },
  };
  const config = symbolConfig[currentSymbol];
  const resultConfig = symbolConfig[reward.type];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl border border-white/15 bg-pitch-dark p-6 sm:rounded-2xl">
        {/* Header */}
        <div className="mb-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/40">Season Reward</p>
          <h2 className="mt-1 text-xl font-black text-white">Spin the Wheel</h2>
        </div>

        {/* Slot reel */}
        <div className="mb-6 flex justify-center">
          <div className={`relative flex h-28 w-52 items-center justify-center overflow-hidden rounded-2xl border-2 bg-black/40 transition-colors duration-300 ${spinning ? 'border-white/20' : resultConfig.border}`}>
            {/* Side fade masks */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/60 to-transparent" />

            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentSymbol + String(delayIdx.current)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.06 }}
                className="flex flex-col items-center gap-1"
              >
                <span className={`text-4xl ${spinning ? 'blur-[1px]' : ''}`}>{config.icon}</span>
                <span className={`text-sm font-black ${spinning ? 'text-white/40' : config.color}`}>
                  {config.label}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Result / claim area */}
        {!spinning && !claimed && !flipping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <p className={`text-center text-lg font-black ${resultConfig.color}`}>
              {isNewPlayer
                ? `You got a new ${(reward as Extract<Reward, { type: 'new-player' }>).positionLabel}!`
                : 'You got an Upgrade Token!'}
            </p>
            {!isNewPlayer && (
              <p className="text-center text-sm text-white/50">
                Use it in your squad to upgrade any player to the next tier.
              </p>
            )}
            <Button size="lg" className="w-full" onClick={claim}>
              Claim
            </Button>
          </motion.div>
        )}

        {/* Card flip for new player */}
        {flipping && !flipDone && reward.type === 'new-player' && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">
              {reward.positionLabel}
            </p>
            <div style={{ perspective: 800 }}>
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                onAnimationComplete={onFlipComplete}
                style={{ transformStyle: 'preserve-3d', position: 'relative', width: 120, height: 168 }}
              >
                <div
                  style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
                  className="flex items-center justify-center rounded-xl border-2 border-white/20 bg-gradient-to-br from-emerald-900 to-pitch-dark"
                >
                  <span className="text-3xl font-black text-white/20">⚽</span>
                </div>
                <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}>
                  <PlayerCard card={reward.card} upgradeLevel={0} size="sm" />
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Claimed confirmation */}
        {claimed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            {reward.type === 'upgrade-token' ? (
              <p className="text-center font-bold text-amber-300">Upgrade Token added to your squad!</p>
            ) : (
              <p className="text-center font-bold text-emerald-300">
                {(reward as Extract<Reward, { type: 'new-player' }>).card.playerName} placed in your squad!
              </p>
            )}
            <Button variant="ghost" className="w-full" onClick={onDismiss}>
              Continue
            </Button>
          </motion.div>
        )}

        {/* Dismiss during spin */}
        {spinning && (
          <p className="mt-2 text-center text-xs text-white/30">Spinning…</p>
        )}
      </div>
    </div>
  );
}
