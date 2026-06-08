'use client';

import { useMemo, useState } from 'react';
import type { Formation, Squad } from '@/store/types';
import { FORMATION_LIST, getFormation } from '@/data/formations';
import { getCard } from '@/data/players';
import { useGameStore } from '@/store/useGameStore';
import {
  emptySquad,
  summariseSquad,
  penaltyForCardInSlot,
} from '@/lib/squadUtils';
import { PlayerCard } from '@/components/cards/PlayerCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/ui';

interface SquadBuilderProps {
  squad: Squad;
  onChange: (squad: Squad) => void;
}

export function SquadBuilder({ squad, onChange }: SquadBuilderProps) {
  const ownedCards = useGameStore((s) => s.ownedCards);
  const formation = getFormation(squad.formation);
  const summary = useMemo(() => summariseSquad(squad), [squad]);

  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  // Cards already used elsewhere can't be reused in the same squad.
  const usedCardIds = useMemo(
    () => new Set(Object.values(squad.assignments).filter(Boolean) as string[]),
    [squad.assignments]
  );

  function setFormation(f: Formation) {
    // Carry nothing over — switching formation resets the squad for clarity.
    onChange(emptySquad(f));
    setActiveSlot(null);
  }

  function assign(slotId: string, cardId: string) {
    onChange({
      ...squad,
      assignments: { ...squad.assignments, [slotId]: cardId },
    });
    setActiveSlot(null);
  }

  function clearSlot(slotId: string) {
    onChange({
      ...squad,
      assignments: { ...squad.assignments, [slotId]: null },
    });
  }

  const activeSlotDef = activeSlot
    ? formation.slots.find((s) => s.slotId === activeSlot) ?? null
    : null;

  // Owned cards sorted by best fit for the active slot.
  const pickerCards = useMemo(() => {
    if (!activeSlotDef) return [];
    return Object.values(ownedCards)
      .map((o) => getCard(o.cardId)!)
      .filter(Boolean)
      .filter((c) => !usedCardIds.has(c.id))
      .map((c) => {
        const penalty = penaltyForCardInSlot(c.positions, activeSlotDef.naturalPosition);
        return { card: c, penalty, effective: Math.max(1, c.rating - penalty) };
      })
      .sort((a, b) => b.effective - a.effective);
  }, [ownedCards, usedCardIds, activeSlotDef]);

  const ratingColor =
    summary.rating >= 85
      ? 'text-emerald-300'
      : summary.rating >= 75
        ? 'text-yellow-300'
        : 'text-orange-300';

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-2">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-white/40">Squad Rating</div>
            <div className={cn('text-2xl font-black tabular-nums', ratingColor)}>
              {summary.rating || '—'}
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-sm text-white/60">
            {summary.filledSlots}/{summary.totalSlots} players
          </div>
        </div>
      </div>

      {/* Pitch */}
      <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-emerald-700/40 bg-gradient-to-b from-pitch-light to-pitch-dark">
        {/* pitch markings */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/15" />
          <div className="absolute left-1/2 top-0 h-16 w-32 -translate-x-1/2 border border-t-0 border-white/15" />
          <div className="absolute bottom-0 left-1/2 h-16 w-32 -translate-x-1/2 border border-b-0 border-white/15" />
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
                <button
                  onClick={() => setActiveSlot(slot.slotId)}
                  className="flex w-16 flex-col items-center"
                >
                  <PlayerCard
                    card={card}
                    size="sm"
                    displayRating={evalForSlot?.effectiveRating}
                    className="!w-16 !p-1"
                  />
                  <span className="mt-0.5 rounded bg-black/60 px-1 text-[9px] font-bold">
                    {slot.label}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveSlot(slot.slotId)}
                  className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-dashed border-white/40 bg-black/30 text-white/70 transition-colors hover:border-emerald-400 hover:text-emerald-300"
                >
                  <span className="text-lg">+</span>
                  <span className="text-[9px] font-bold">{slot.label}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Player picker drawer */}
      {activeSlotDef && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center"
          onClick={() => setActiveSlot(null)}
        >
          <div
            className="thin-scroll max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/15 bg-pitch-dark p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Pick for <span className="text-emerald-300">{activeSlotDef.label}</span>
              </h3>
              <div className="flex gap-2">
                {squad.assignments[activeSlotDef.slotId] && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => clearSlot(activeSlotDef.slotId)}
                  >
                    Remove
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setActiveSlot(null)}>
                  Close
                </Button>
              </div>
            </div>

            {pickerCards.length === 0 ? (
              <p className="py-8 text-center text-white/50">
                No available cards. Open packs to get more players.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {pickerCards.map(({ card, penalty, effective }) => (
                  <div key={card.id} className="flex flex-col items-center gap-1">
                    <PlayerCard
                      card={card}
                      size="sm"
                      displayRating={effective}
                      onClick={() => assign(activeSlotDef.slotId, card.id)}
                    />
                    {penalty > 0 && (
                      <span className="text-[10px] font-bold text-red-400">−{penalty} OOP</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
