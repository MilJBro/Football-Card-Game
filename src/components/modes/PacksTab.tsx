'use client';

import { useState } from 'react';
import type { PackDef, PackCategory } from '@/store/types';
import { ALL_PACKS } from '@/data/packs';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { PackOpening } from '@/components/opening/PackOpening';
import { PackArt } from '@/components/opening/PackArt';
import { GoalIcon, WallIcon, TargetIcon, CompassStarIcon } from '@/components/ui/icons';
import { cn, formatCoins } from '@/lib/ui';

const CATEGORY_LABEL: Record<PackCategory, string> = {
  GK: 'Goalkeepers',
  DEF: 'Defenders',
  MID: 'Midfielders',
  ATT: 'Attackers',
};

const CATEGORY_ICON: Record<PackCategory, (props: { className?: string }) => JSX.Element> = {
  GK: GoalIcon,
  DEF: WallIcon,
  MID: CompassStarIcon,
  ATT: TargetIcon,
};

const CATEGORY_ORDER: PackCategory[] = ['GK', 'DEF', 'MID', 'ATT'];

interface PacksTabProps {
  category: PackCategory;
  onCategoryChange: (c: PackCategory) => void;
  onGoToUpgrades: () => void;
}

export function PacksTab({ category, onCategoryChange, onGoToUpgrades }: PacksTabProps) {
  const [openingPackId, setOpeningPackId] = useState<string | null>(null);

  if (openingPackId) {
    return (
      <PackOpening
        packId={openingPackId}
        onClose={() => setOpeningPackId(null)}
        onViewCards={() => {
          setOpeningPackId(null);
          onGoToUpgrades();
        }}
      />
    );
  }

  const pack = ALL_PACKS.find((p) => p.pack === category)!;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-black">Packs</h1>
        <p className="text-sm text-white/60">
          Pick a position — every pack holds 4 cards.
        </p>
      </header>

      {/* Category tabs */}
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-black/30 p-1.5">
        {CATEGORY_ORDER.map((cat) => {
          const isActive = cat === category;
          const Icon = CATEGORY_ICON[cat];
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-bold transition-colors',
                isActive
                  ? 'bg-emerald-500 text-emerald-950'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{CATEGORY_LABEL[cat]}</span>
            </button>
          );
        })}
      </div>

      <PackCard pack={pack} onOpen={setOpeningPackId} />
    </div>
  );
}

function PackCard({ pack, onOpen }: { pack: PackDef; onOpen: (id: string) => void }) {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const affordable = hydrated && coins >= pack.cost;

  return (
    <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl border-2 border-white/15 bg-gradient-to-b from-pitch-light to-pitch-dark p-6 text-center shadow-xl">
      <PackArt category={pack.pack} className="h-40 w-40 drop-shadow-lg" />

      <div className="mt-4 w-full">
        <h3 className="text-xl font-black leading-tight">{pack.name}</h3>
        <p className="mx-auto mt-1 max-w-[16rem] text-xs text-white/60">{pack.description}</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1 text-lg font-bold text-yellow-300">
            🪙 {formatCoins(pack.cost)}
          </span>
          <Button size="sm" onClick={() => onOpen(pack.id)} disabled={!affordable}>
            {affordable ? 'Open' : 'Too pricey'}
          </Button>
        </div>
      </div>
    </div>
  );
}
