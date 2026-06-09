'use client';

import { useMemo, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { getCard, getNextTierCard } from '@/data/players';
import { discardValue, upgradeCost } from '@/lib/coinRewards';
import { PlayerCard } from '@/components/cards/PlayerCard';
import { Button } from '@/components/ui/Button';
import { cn, formatCoins } from '@/lib/ui';
import type { PackCategory, PlayerCardDef, Tier } from '@/store/types';

const CATEGORIES: (PackCategory | 'ALL')[] = ['ALL', 'GK', 'DEF', 'MID', 'ATT'];
const TIERS: (Tier | 'ALL')[] = ['ALL', 'Rising', 'Star', 'Legend'];
const TIER_ORDER: Tier[] = ['Rising', 'Star', 'Legend'];

export function UpgradesTab({ onGoToPacks }: { onGoToPacks: () => void }) {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const ownedCards = useGameStore((s) => s.ownedCards);
  const discardCard = useGameStore((s) => s.discardCard);
  const toggleFoil = useGameStore((s) => s.toggleFoilEquipped);
  const upgradeCard = useGameStore((s) => s.upgradeCard);

  const [cat, setCat] = useState<PackCategory | 'ALL'>('ALL');
  const [tier, setTier] = useState<Tier | 'ALL'>('ALL');
  const [toast, setToast] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState<PlayerCardDef | null>(null);

  const owned = useMemo(() => {
    return Object.values(ownedCards)
      .map((o) => ({ owned: o, card: getCard(o.cardId)! }))
      .filter((x) => x.card)
      .filter((x) => cat === 'ALL' || x.card.pack === cat)
      .filter((x) => tier === 'ALL' || x.card.tier === tier)
      .sort((a, b) => b.card.rating - a.card.rating);
  }, [ownedCards, cat, tier]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function sell(cardId: string) {
    const gained = discardCard(cardId);
    if (gained > 0) showToast(`Sold for 🪙 ${formatCoins(gained)}`);
  }

  function confirmUpgrade() {
    if (!upgrading) return;
    const result = upgradeCard(upgrading.id);
    const next = getNextTierCard(upgrading.id);
    setUpgrading(null);
    if (result.ok && next) {
      showToast(`Upgraded to ${next.tier}!${result.foilUnlocked ? ' ✨ Foil unlocked!' : ''}`);
    } else if (result.reason) {
      showToast(result.reason);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black">Upgrades</h1>
        <p className="text-white/60">Upgrade, sell and manage your players.</p>
      </header>

      <div className="flex flex-wrap gap-4">
        <FilterRow label="Position" options={CATEGORIES} value={cat} onChange={setCat} />
        <FilterRow label="Tier" options={TIERS} value={tier} onChange={setTier} />
      </div>

      {!hydrated ? null : owned.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
          <p className="text-white/60">No cards yet.</p>
          <Button className="mt-3" onClick={onGoToPacks}>
            Open your first pack
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {owned.map(({ owned: o, card }) => (
            <div key={o.cardId} className="flex flex-col items-center">
              <div className="relative">
                <PlayerCard
                  card={card}
                  foil={o.isFoilEquipped}
                  size="md"
                  onClick={() => setUpgrading(card)}
                />
                {o.quantity > 1 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-0.5 text-xs font-black text-black">
                    ×{o.quantity}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upgrade / sell modal ─────────────────────────────────────── */}
      {upgrading && (() => {
        const next = getNextTierCard(upgrading.id);
        const cost = next ? upgradeCost(upgrading.tier) : 0;
        const ownedEntry = ownedCards[upgrading.id];
        const currentTierIdx = TIER_ORDER.indexOf(upgrading.tier);

        return (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 sm:items-center"
            onClick={() => setUpgrading(null)}
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-3xl bg-[#1a0a2e]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <h3 className="text-xl font-black uppercase text-white">Upgrade Card</h3>
                <button
                  onClick={() => setUpgrading(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Card + player info */}
              <div className="flex items-center gap-4 px-5 pb-5">
                <PlayerCard card={upgrading} foil={ownedEntry?.isFoilEquipped} size="md" />
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <div className="text-lg font-bold leading-tight text-white">
                      {upgrading.playerName}
                    </div>
                    <div className="mt-0.5 text-sm text-white/50">
                      {upgrading.club} · {upgrading.season}
                    </div>
                  </div>
                  {/* Tier progress bar */}
                  <div className="flex gap-1.5">
                    {TIER_ORDER.map((t, i) => (
                      <div
                        key={t}
                        className={cn(
                          'h-2 flex-1 rounded-full',
                          i <= currentTierIdx ? 'bg-amber-400' : 'bg-white/15',
                        )}
                      />
                    ))}
                  </div>
                  {ownedEntry?.isFoilUnlocked && (
                    <button
                      onClick={() => { toggleFoil(upgrading.id); }}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                        ownedEntry.isFoilEquipped
                          ? 'bg-emerald-500 text-emerald-950'
                          : 'bg-white/10 text-white/70 hover:bg-white/20',
                      )}
                    >
                      {ownedEntry.isFoilEquipped ? '✨ Foil On' : 'Foil Off'}
                    </button>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 px-5 pb-5">
                {next && (
                  <button
                    onClick={confirmUpgrade}
                    disabled={coins < cost}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 py-4 text-base font-black uppercase text-emerald-950 transition-opacity disabled:opacity-40"
                  >
                    ⬆ Upgrade · 🪙 {formatCoins(cost)}
                  </button>
                )}
                <button
                  onClick={() => { sell(upgrading.id); setUpgrading(null); }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-purple-400/40 py-3.5 text-base font-bold text-purple-300 hover:bg-purple-400/10"
                >
                  Sell for 🪙 {formatCoins(discardValue(upgrading))}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 animate-coin-pop rounded-lg bg-emerald-500 px-4 py-2 font-bold text-emerald-950 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function FilterRow<T extends string>({
  label, options, value, onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-wide text-white/40">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
              value === o ? 'bg-emerald-500 text-emerald-950' : 'bg-white/10 text-white/70 hover:bg-white/20',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
