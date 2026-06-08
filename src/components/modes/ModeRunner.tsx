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

  return (
    <div className="pb-4">
      {/* Slim challenge header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/" className="text-sm font-semibold text-emerald-400 hover:underline">
          ← Challenges
        </Link>
        <span className="truncate text-sm font-bold text-white/70">{mode.name}</span>
      </div>

      {tab === 'simulation' && (
        <SimulationTab mode={mode} squad={squad} onGoToSquad={() => setTab('squad')} />
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
