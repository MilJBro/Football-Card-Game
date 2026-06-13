'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Formation, Squad, PlayerCardDef, EnglandManager } from '@/store/types';
import type { Position } from '@/store/types';
import { FORMATION_LIST, getFormation } from '@/data/formations';
import { getCard, getEffectiveCardData, ALL_CARDS } from '@/data/players';
import { useGameStore } from '@/store/useGameStore';
import { emptySquad, summariseSquad, penaltyForCardInSlot } from '@/lib/squadUtils';
import { PlayerCard } from '@/components/cards/PlayerCard';
import { PitchToken, EmptyToken } from '@/components/squad/PitchToken';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/ui';

const POSITION_TO_PACK: Record<Position, PlayerCardDef['pack']> = {
  GK: 'GK',
  RB: 'DEF', CB: 'DEF', LB: 'DEF',
  CM: 'MID',
  RW: 'ATT', LW: 'ATT', ST: 'ATT',
};

function getRandomCardForPosition(position: Position, excludeIds: Set<string>): PlayerCardDef | null {
  const pack = POSITION_TO_PACK[position];
  const pool = ALL_CARDS.filter(
    (c) => c.pack === pack && c.positions.includes(position) && !excludeIds.has(c.id)
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface SquadBuilderProps {
  squad: Squad;
  onChange: (squad: Squad) => void;
  /** When set, the formation is locked to the manager's preferred shape. */
  manager?: EnglandManager | null;
  onGoToSimulation?: () => void;
}

export function SquadBuilder({ squad, onChange, manager, onGoToSimulation }: SquadBuilderProps) {
  const ownedCards = useGameStore((s) => s.ownedCards);
  const addCards = useGameStore((s) => s.addCards);
  const formation = getFormation(squad.formation);
  const summary = useMemo(() => summariseSquad(squad, ownedCards), [squad, ownedCards]);

  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [drawnCards, setDrawnCards] = useState<PlayerCardDef[]>([]);
  const [flipsDone, setFlipsDone] = useState(0);

  const usedCardIds = useMemo(
    () => new Set(Object.values(squad.assignments).filter(Boolean) as string[]),
    [squad.assignments]
  );

  function setFormation(f: Formation) {
    onChange(emptySquad(f));
    setActiveSlot(null);
  }

  function openSlot(slotId: string) {
    setActiveSlot(slotId);
    setIsFlipping(false);
    setDrawnCards([]);
    setFlipsDone(0);
  }

  function closeDrawer() {
    setActiveSlot(null);
    setIsFlipping(false);
    setDrawnCards([]);
    setFlipsDone(0);
  }

  function assign(slotId: string, cardId: string) {
    onChange({ ...squad, assignments: { ...squad.assignments, [slotId]: cardId } });
  }

  function drawTwoCards(slotId: string, position: Position) {
    const excludeIds = new Set(
      Object.entries(squad.assignments)
        .filter(([id, cardId]) => id !== slotId && cardId)
        .map(([, cardId]) => cardId as string)
    );

    const card1 = getRandomCardForPosition(position, excludeIds);
    if (!card1) return;
    const card2 = getRandomCardForPosition(position, new Set(Array.from(excludeIds).concat(card1.id)));
    const cards = card2 ? [card1, card2] : [card1];

    setDrawnCards(cards);
    setFlipsDone(0);
    setIsFlipping(true);
  }

  function handleFlipComplete(totalCards: number) {
    setFlipsDone((prev) => {
      const next = prev + 1;
      if (next >= totalCards) {
        setTimeout(() => setIsFlipping(false), 300);
      }
      return next;
    });
  }

  function pickCard(card: PlayerCardDef) {
    if (!activeSlot) return;
    addCards([card.id]);
    assign(activeSlot, card.id);
    closeDrawer();
  }

  const activeSlotDef = activeSlot
    ? formation.slots.find((s) => s.slotId === activeSlot) ?? null
    : null;

  const activeCardId = activeSlot ? squad.assignments[activeSlot] : null;
  const activeCard = activeCardId ? getCard(activeCardId) : null;
  const activeOwned = activeCardId ? ownedCards[activeCardId] : null;
  const activeUpgradeLevel = ((activeOwned?.upgradeLevel) ?? 0) as 0 | 1 | 2;

  const ratingColor =
    summary.rating >= 85
      ? 'text-emerald-300'
      : summary.rating >= 75
        ? 'text-yellow-300'
        : 'text-orange-300';

  return (
    <div className="space-y-2.5">
      {/* Stat bar */}
      <div className="flex items-stretch gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-1.5">
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/5 py-1.5">
          <div className="text-[9px] uppercase tracking-wide text-white/40">Rating</div>
          <div className={cn('text-xl font-black leading-none tabular-nums', ratingColor)}>
            {summary.rating || '—'}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/5 py-1.5">
          <div className="text-[9px] uppercase tracking-wide text-white/40">Attack</div>
          <div className="text-xl font-black leading-none tabular-nums text-pl-pink">
            {summary.attackRating || '—'}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/5 py-1.5">
          <div className="text-[9px] uppercase tracking-wide text-white/40">Defence</div>
          <div className="text-xl font-black leading-none tabular-nums text-pl-cyan">
            {summary.defenceRating || '—'}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/5 py-1.5">
          <div className="text-[9px] uppercase tracking-wide text-white/40">Players</div>
          <div className="text-xl font-black leading-none tabular-nums text-white">
            {summary.filledSlots}
            <span className="text-sm text-white/40">/{summary.totalSlots}</span>
          </div>
        </div>
      </div>

      {/* Formation — locked to the manager's shape when one is appointed */}
      {manager ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
          <div className="text-xs font-black text-white">
            {manager.name}
            <span className="ml-2 font-normal text-white/40">England {manager.era}</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-black text-emerald-300">
            {manager.formation}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-white/40">Formation</span>
          <div className="flex gap-1">
            {FORMATION_LIST.map((f) => (
              <button
                key={f}
                onClick={() => setFormation(f)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-bold transition-colors',
                  squad.formation === f
                    ? 'bg-emerald-500 text-emerald-950'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pitch */}
      <div className="relative mx-auto aspect-[3/3.5] w-full max-w-[21rem] overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-emerald-900/50 via-pitch to-pitch-dark shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'repeating-linear-gradient(180deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 32px,transparent 32px,transparent 64px)',
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20" />
          <div className="absolute left-1/2 top-0 h-16 w-36 -translate-x-1/2 rounded-b-lg border border-t-0 border-white/20" />
          <div className="absolute bottom-0 left-1/2 h-16 w-36 -translate-x-1/2 rounded-t-lg border border-b-0 border-white/20" />
          <div className="absolute left-1/2 top-0 h-7 w-20 -translate-x-1/2 rounded-b border border-t-0 border-white/15" />
          <div className="absolute bottom-0 left-1/2 h-7 w-20 -translate-x-1/2 rounded-t border border-b-0 border-white/15" />
        </div>

        {formation.slots.map((slot) => {
          const cardId = squad.assignments[slot.slotId];
          const card = cardId ? getCard(cardId) : null;
          const evalForSlot = summary.evaluations.find((e) => e.slotId === slot.slotId);
          return (
            <div
              key={slot.slotId}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              {card ? (
                <PitchToken
                  card={card}
                  slotLabel={slot.label}
                  effectiveRating={evalForSlot?.effectiveRating}
                  onClick={() => openSlot(slot.slotId)}
                />
              ) : (
                <EmptyToken slotLabel={slot.label} onClick={() => openSlot(slot.slotId)} />
              )}
            </div>
          );
        })}
      </div>

      {/* Slot drawer */}
      {activeSlotDef && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 pb-16 sm:items-center sm:pb-0"
          onClick={closeDrawer}
        >
          <div
            className="w-full max-w-sm rounded-t-2xl border border-white/15 bg-pitch-dark p-6 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {activeCard ? (
              /* Filled slot — view only */
              <div className="flex flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between">
                  <h3 className="text-lg font-bold">
                    <span className="text-emerald-300">{activeSlotDef.label}</span>
                  </h3>
                  <Button size="sm" variant="ghost" onClick={closeDrawer}>Close</Button>
                </div>
                <PlayerCard card={activeCard} upgradeLevel={activeUpgradeLevel} size="sm" />
              </div>
            ) : (
              /* Empty slot — pick from two drawn cards */
              <div className="flex flex-col gap-4">
                <div className="flex w-full items-center justify-between">
                  <h3 className="text-lg font-bold">
                    Get a <span className="text-emerald-300">{activeSlotDef.label}</span>
                  </h3>
                  <Button size="sm" variant="ghost" onClick={closeDrawer} disabled={isFlipping}>
                    Close
                  </Button>
                </div>

                {/* Card area */}
                <div className="flex justify-center gap-4">
                  {drawnCards.length > 0 ? (
                    drawnCards.map((card, i) => (
                      <div key={card.id} className="flex flex-col items-center gap-2">
                        {isFlipping ? (
                          <div style={{ perspective: 800 }}>
                            <motion.div
                              initial={{ rotateY: 0 }}
                              animate={{ rotateY: 900 }}
                              transition={{ duration: 2.2, delay: i * 0.15, ease: [0.15, 0.05, 0.2, 1] }}
                              onAnimationComplete={() => handleFlipComplete(drawnCards.length)}
                              style={{ transformStyle: 'preserve-3d', position: 'relative', width: 120, height: 168 }}
                            >
                              <div
                                style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
                                className="flex items-center justify-center rounded-xl border-2 border-white/20 bg-gradient-to-br from-emerald-900 to-pitch-dark"
                              >
                                <span className="text-3xl font-black text-white/20">⚽</span>
                              </div>
                              <div
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
                                className="flex items-center justify-center"
                              >
                                <PlayerCard card={card} upgradeLevel={0} size="sm" />
                              </div>
                            </motion.div>
                          </div>
                        ) : (
                          <>
                            <PlayerCard card={card} upgradeLevel={0} size="sm" />
                            <Button size="sm" className="w-[120px]" onClick={() => pickCard(card)}>
                              Pick
                            </Button>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    /* Idle placeholders */
                    <>
                      <div className="flex h-[168px] w-[120px] items-center justify-center rounded-xl border-2 border-dashed border-white/20">
                        <span className="text-4xl text-white/20">?</span>
                      </div>
                      <div className="flex h-[168px] w-[120px] items-center justify-center rounded-xl border-2 border-dashed border-white/20">
                        <span className="text-4xl text-white/20">?</span>
                      </div>
                    </>
                  )}
                </div>

                {drawnCards.length === 0 && (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => drawTwoCards(activeSlotDef.slotId, activeSlotDef.naturalPosition)}
                  >
                    Get Cards
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Go to simulation — fixed bar above the bottom tabs, appears when squad is full */}
      {summary.isComplete && onGoToSimulation && (
        <div className="fixed inset-x-0 bottom-14 z-[55] px-4 pb-2">
          <button
            onClick={onGoToSimulation}
            className="w-full rounded-2xl bg-emerald-500 py-3.5 text-base font-black text-emerald-950 shadow-lg transition-transform hover:scale-[1.02]"
          >
            Simulate →
          </button>
        </div>
      )}
    </div>
  );
}
