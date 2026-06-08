'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ALL_PACKS } from '@/data/packs';
import type { PackDef } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { cn, TIER_STYLES, formatCoins } from '@/lib/ui';

const CATEGORY_LABEL: Record<string, string> = {
  GK: 'Goalkeepers',
  DEF: 'Defenders',
  MID: 'Midfielders',
  ATT: 'Attackers',
};
const CATEGORY_ORDER = ['GK', 'DEF', 'MID', 'ATT'] as const;

export default function ShopPage() {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const router = useRouter();
  const [pending, setPending] = useState<PackDef | null>(null);

  function buy(pack: PackDef) {
    // Spend happens on the opening page so a refresh can't double-charge; here
    // we just gate on affordability and navigate.
    if (coins < pack.cost) return;
    router.push(`/open/${pack.id}/`);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black">Pack Shop</h1>
        <p className="text-white/60">
          Each pack contains 5 cards from one position group and tier. Duplicates unlock foils.
        </p>
      </header>

      {CATEGORY_ORDER.map((cat) => (
        <section key={cat} className="space-y-3">
          <h2 className="text-xl font-bold text-emerald-300">{CATEGORY_LABEL[cat]}</h2>
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
                      onClick={() => setPending(pack)}
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

      {/* Confirm modal */}
      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPending(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/15 bg-pitch-dark p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold">Open {pending.name}?</h3>
            <p className="mt-1 text-sm text-white/60">
              This will cost <span className="font-bold text-yellow-300">🪙 {formatCoins(pending.cost)}</span>{' '}
              and reveal 5 cards.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setPending(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const p = pending;
                  setPending(null);
                  buy(p);
                }}
              >
                Open Pack
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
