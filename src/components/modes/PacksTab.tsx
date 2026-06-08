'use client';

import { useState } from 'react';
import { ALL_PACKS } from '@/data/packs';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { PackOpening } from '@/components/opening/PackOpening';
import { cn, TIER_STYLES, formatCoins } from '@/lib/ui';

const CATEGORY_LABEL: Record<string, string> = {
  GK: 'Goalkeepers',
  DEF: 'Defenders',
  MID: 'Midfielders',
  ATT: 'Attackers',
};
const CATEGORY_ORDER = ['GK', 'DEF', 'MID', 'ATT'] as const;

export function PacksTab({ onGoToUpgrades }: { onGoToUpgrades: () => void }) {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const [openingPackId, setOpeningPackId] = useState<string | null>(null);

  // Inline pack-opening view.
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

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-black">Packs</h1>
        <p className="text-white/60">
          Each pack contains 5 cards from one position group and tier. Duplicates unlock foils.
        </p>
      </header>

      {CATEGORY_ORDER.map((cat) => (
        <section key={cat} className="space-y-3">
          <h2 className="text-lg font-bold text-emerald-300">{CATEGORY_LABEL[cat]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_PACKS.filter((p) => p.pack === cat).map((pack) => {
              const styles = TIER_STYLES[pack.tier];
              const affordable = hydrated && coins >= pack.cost;
              return (
                <div
                  key={pack.id}
                  className={cn(
                    'flex flex-col rounded-2xl border-2 bg-gradient-to-b p-5',
                    styles.border,
                    styles.gradient,
                    styles.glow
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black">{pack.name}</h3>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase',
                        styles.border,
                        styles.text
                      )}
                    >
                      {pack.tier}
                    </span>
                  </div>
                  <p className="mt-1 flex-1 text-sm text-white/60">{pack.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-lg font-bold text-yellow-300">
                      🪙 {formatCoins(pack.cost)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setOpeningPackId(pack.id)}
                      disabled={!affordable}
                    >
                      {affordable ? 'Buy' : 'Too pricey'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
