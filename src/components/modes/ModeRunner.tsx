'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Squad } from '@/store/types';
import { getMode } from '@/data/gameModes';
import { emptySquad } from '@/lib/squadUtils';
import { SquadBuilder } from '@/components/squad/SquadBuilder';
import { SimulationTab } from '@/components/modes/SimulationTab';
import { PacksTab } from '@/components/modes/PacksTab';
import { UpgradesTab } from '@/components/modes/UpgradesTab';
import { BottomTabs, type ChallengeTab } from '@/components/modes/BottomTabs';

const TAB_ORDER: ChallengeTab[] = ['simulation', 'squad', 'packs', 'upgrades'];
const TAB_LABELS: Record<ChallengeTab, string> = {
  simulation: 'Simulate',
  squad: 'Squad',
  packs: 'Packs',
  upgrades: 'Upgrades',
};

export function ModeRunner({ modeId }: { modeId: string }) {
  const mode = getMode(modeId);

  // Squad is per-challenge and shared between the Squad and Simulation tabs.
  const [squad, setSquad] = useState<Squad>(() => emptySquad('4-3-3'));
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
      {/* Slim challenge header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <Link href="/" className="text-sm font-semibold text-emerald-400 hover:underline">
          ← Challenges
        </Link>
        <span className="truncate text-sm font-bold text-white/70">{mode.name}</span>
      </div>

      {/* Tab navigation arrows */}
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
          onGoToSquad={() => setTab('squad')}
          onGoToPacks={() => setTab('packs')}
          onGoToUpgrades={() => setTab('upgrades')}
        />
      )}
      {tab === 'squad' && (
        <div className="space-y-4">
          <h1 className="text-2xl font-black">Squad</h1>
          <SquadBuilder squad={squad} onChange={setSquad} />
        </div>
      )}
      {tab === 'packs' && <PacksTab onGoToUpgrades={() => setTab('upgrades')} />}
      {tab === 'upgrades' && <UpgradesTab onGoToPacks={() => setTab('packs')} />}

      <BottomTabs active={tab} onChange={setTab} />
    </div>
  );
}
