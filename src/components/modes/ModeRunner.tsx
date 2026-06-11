'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Squad } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { getMode } from '@/data/gameModes';
import { emptySquad } from '@/lib/squadUtils';
import { SquadBuilder } from '@/components/squad/SquadBuilder';
import { SimulationTab } from '@/components/modes/SimulationTab';
import { BottomTabs, type ChallengeTab } from '@/components/modes/BottomTabs';

const TAB_ORDER: ChallengeTab[] = ['simulation', 'squad'];
const TAB_LABELS: Record<ChallengeTab, string> = {
  simulation: 'Simulate',
  squad: 'Squad',
};

export function ModeRunner({ modeId }: { modeId: string }) {
  const mode = getMode(modeId);
  const resetChallengeState = useGameStore((s) => s.resetChallengeState);
  const setActiveModeId = useGameStore((s) => s.setActiveModeId);
  const setActiveSquad = useGameStore((s) => s.setActiveSquad);
  const ownedCards = useGameStore((s) => s.ownedCards);

  useEffect(() => {
    const { activeModeId } = useGameStore.getState();
    if (activeModeId !== modeId) {
      resetChallengeState();
      setActiveModeId(modeId);
    }
  }, [modeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [squad, setSquad] = useState<Squad>(() => {
    const { activeModeId, activeSquad } = useGameStore.getState();
    return activeModeId === modeId && activeSquad ? activeSquad : emptySquad('4-3-3');
  });

  useEffect(() => {
    setActiveSquad(squad);
  }, [squad]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSquad((prev) => {
      const updated = { ...prev.assignments };
      let changed = false;
      for (const [slotId, cardId] of Object.entries(updated)) {
        if (cardId && !ownedCards[cardId]) {
          updated[slotId] = null;
          changed = true;
        }
      }
      return changed ? { ...prev, assignments: updated } : prev;
    });
  }, [ownedCards]);

  const [tab, setTab] = useState<ChallengeTab>('simulation');

  if (!mode) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/60">Unknown challenge.</p>
        <Link href="/" className="mt-4 inline-block text-emerald-400 underline">
          Back to challenges
        </Link>
      </div>
    );
  }

  const tabIdx = TAB_ORDER.indexOf(tab);
  const hasPrev = tabIdx > 0;
  const hasNext = tabIdx < TAB_ORDER.length - 1;

  return (
    <div className="pb-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Link href="/" className="text-sm font-semibold text-emerald-400 hover:underline">
          ← Challenges
        </Link>
        <span className="truncate text-sm font-bold text-white/70">{mode.name}</span>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl bg-white/5 px-2 py-1.5">
        <button
          onClick={() => hasPrev && setTab(TAB_ORDER[tabIdx - 1])}
          disabled={!hasPrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-20"
          aria-label="Previous section"
        >
          ‹
        </button>
        <span className="flex-1 text-center text-sm font-bold text-white">
          {TAB_LABELS[tab]}
        </span>
        <button
          onClick={() => hasNext && setTab(TAB_ORDER[tabIdx + 1])}
          disabled={!hasNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-20"
          aria-label="Next section"
        >
          ›
        </button>
      </div>

      {tab === 'simulation' && (
        <SimulationTab
          mode={mode}
          squad={squad}
          onSquadChange={setSquad}
          onGoToSquad={() => setTab('squad')}
        />
      )}
      {tab === 'squad' && (
        <div className="space-y-4">
          <h1 className="text-2xl font-black">Squad</h1>
          <SquadBuilder squad={squad} onChange={setSquad} />
        </div>
      )}

      <BottomTabs active={tab} onChange={setTab} />
    </div>
  );
}
