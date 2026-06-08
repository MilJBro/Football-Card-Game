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
import { PitchToken, EmptyToken } from '@/components/squad/PitchToken';
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
      {/* Stat bar */}
      <div className="flex items-stretch gap-2 rounded-2xl border border-white/10 bg-black/30 p-2">
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/5 py-2">
          <div className="text-[9px] uppercase tracking-wide text-white/40">Rating</div>
          <div className={cn('text-2xl font-black leading-none tabular-nums', ratingColor)}>
            {summary.rating || '—'}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/5 py-2">
          <div className="text-[9px] uppercase tracking-wide text-white/40">Attack</div>
          <div className="text-2xl font-black leading-none tabular-nums text-pl-pink">
            {summary.attackRating || '—'}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/5 py-2">
          <div className="text-[9px] uppercase tracking-wide text-white/40">Defence</div>
          <div className="text-2xl font-black leading-none tabular-nums text-pl-cyan">
            {summary.defenceRating || '—'}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/5 py-2">
          <div className="text-[9px] uppercase tracking-wide text-white/40">Players</div>
          <div className="text-2xl font-black leading-none tabular-nums text-white">
            {summary.filledSlots}
            <span className="text-sm text-white/40">/{summary.totalSlots}</span>
          </div>
        </div>
      </div>

      {/* Formation selector */}
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

      {/* Pitch */}
      <div className="relative mx-auto aspect-[3/4.2] w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-emerald-900/50 via-pitch to-pitch-dark shadow-2xl">
        {/* mown-grass stripes */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'repeating-linear-gradient(180deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 32px,transparent 32px,transparent 64px)',
          }}
        />
        {/* pitch markings */}
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
                  onClick={() => setActiveSlot(slot.slotId)}
                />
              ) : (
                <EmptyToken slotLabel={slot.label} onClick={() => setActiveSlot(slot.slotId)} />
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
