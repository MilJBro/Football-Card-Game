'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Squad } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { getMode } from '@/data/gameModes';
import { emptySquad } from '@/lib/squadUtils';
import { SquadBuilder } from '@/components/squad/SquadBuilder';
import { ManagerWheel } from '@/components/squad/ManagerWheel';
import { SimulationTab } from '@/components/modes/SimulationTab';
import { BottomTabs, type ChallengeTab } from '@/components/modes/BottomTabs';

export function ModeRunner({ modeId }: { modeId: string }) {
  const mode = getMode(modeId);
  const resetChallengeState = useGameStore((s) => s.resetChallengeState);
  const setActiveModeId = useGameStore((s) => s.setActiveModeId);
  const setActiveSquad = useGameStore((s) => s.setActiveSquad);
  const ownedCards = useGameStore((s) => s.ownedCards);
  const manager = useGameStore((s) => s.manager);
  const setManager = useGameStore((s) => s.setManager);

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
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="mb-2 flex items-center justify-between gap-3">
        <Link href="/" className="text-sm font-semibold text-emerald-400 hover:underline">
          ← Home
        </Link>
        <span className="truncate text-sm font-bold text-white/70">{mode.name}</span>
      </div>

      {tab === 'simulation' && (
        <SimulationTab
          mode={mode}
          squad={squad}
          onGoToSquad={() => setTab('squad')}
        />
      )}
      {tab === 'squad' && (
        manager ? (
          <SquadBuilder squad={squad} onChange={setSquad} manager={manager} />
        ) : (
          <ManagerWheel
            onComplete={(m) => {
              setManager(m);
              setSquad(emptySquad(m.formation));
            }}
          />
        )
      )}

      <BottomTabs active={tab} onChange={setTab} />
    </div>
  );
}
