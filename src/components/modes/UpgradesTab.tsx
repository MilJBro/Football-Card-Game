'use client';

import { useMemo, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { getCard, getEffectiveCardData } from '@/data/players';
import { discardValue, upgradeCost } from '@/lib/coinRewards';
import { PlayerCard } from '@/components/cards/PlayerCard';
import { Button } from '@/components/ui/Button';
import { cn, formatCoins, PACK_STYLES } from '@/lib/ui';
import type { PackCategory, PlayerCardDef } from '@/store/types';

const CATEGORIES: (PackCategory | 'ALL')[] = ['ALL', 'GK', 'DEF', 'MID', 'ATT'];
const LEVELS = ['ALL', '0', '1', '2'] as const;

export function UpgradesTab({ onGoToPacks }: { onGoToPacks: () => void }) {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const ownedCards = useGameStore((s) => s.ownedCards);
  const discardCard = useGameStore((s) => s.discardCard);
  const toggleFoil = useGameStore((s) => s.toggleFoilEquipped);
  const upgradeCard = useGameStore((s) => s.upgradeCard);

  const [cat, setCat] = useState<PackCategory | 'ALL'>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | '0' | '1' | '2'>('ALL');
  const [toast, setToast] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState<PlayerCardDef | null>(null);

  const owned = useMemo(() => {
    return Object.values(ownedCards)
      .map((o) => ({ owned: o, card: getCard(o.cardId)! }))
      .filter((x) => x.card)
      .filter((x) => cat === 'ALL' || x.card.pack === cat)
      .filter((x) => levelFilter === 'ALL' || String(x.owned.upgradeLevel ?? 0) === levelFilter)
      .sort((a, b) => b.card.upgrades[1].rating - a.card.upgrades[1].rating);
  }, [ownedCards, cat, levelFilter]);

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
    setUpgrading(null);
    if (result.ok) {
      showToast('Upgraded!');
    } else if (result.reason) {
      showToast(result.reason);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black">Collection</h1>
        <p className="text-white/60">Tap a card to upgrade or sell.</p>
      </header>

      <div className="flex flex-wrap gap-4">
        <FilterRow label="Position" options={CATEGORIES} value={cat} onChange={setCat} />
        <FilterRow label="Level" options={LEVELS} value={levelFilter} onChange={setLevelFilter} />
      </div>

      {!hydrated ? null : owned.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
          <p className="text-white/60">No cards yet.</p>
          <Button className="mt-3" onClick={onGoToPacks}>
            Open your first pack
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {owned.map(({ owned: o, card }) => {
            const upgradeLevel = (o.upgradeLevel ?? 0) as 0 | 1 | 2;
            const eff = getEffectiveCardData(card, upgradeLevel);
            const packStyle = PACK_STYLES[card.pack];
            return (
              <button
                key={o.cardId}
                onClick={() => setUpgrading(card)}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10"
              >
                {/* Position colour stripe */}
                <div className={cn('h-10 w-1.5 shrink-0 rounded-full', packStyle.posBadge)} />

                {/* Name + era */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-bold text-white">{card.playerName}</span>
                    {o.quantity > 1 && (
                      <span className="shrink-0 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-black text-white">
                        ×{o.quantity}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-white/50">{eff.era}</div>
                </div>

                {/* Level dots */}
                <div className="flex shrink-0 gap-1">
                  {([0, 1, 2] as const).map((lvl) => (
                    <div
                      key={lvl}
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        lvl <= upgradeLevel ? 'bg-amber-400' : 'bg-white/15',
                      )}
                    />
                  ))}
                </div>

                {/* Rating */}
                <div className="shrink-0 text-lg font-black tabular-nums text-white">
                  {eff.rating}
                </div>

                <div className="shrink-0 text-white/30">›</div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Upgrade / sell modal ─────────────────────────────────────── */}
      {upgrading && (() => {
        const ownedEntry = ownedCards[upgrading.id];
        const currentLevel = ((ownedEntry?.upgradeLevel) ?? 0) as 0 | 1 | 2;
        const canUpgrade = currentLevel < 2;
        const cost = canUpgrade ? upgradeCost(currentLevel) : 0;
        const nextLevel = (currentLevel + 1) as 1 | 2;
        const nextEra = canUpgrade
          ? upgrading.upgrades[nextLevel - 1]?.era ?? ''
          : '';

        const eraRows: { label: string; era: string; active: boolean }[] = [
          { label: 'Base', era: upgrading.era, active: true },
          { label: 'Upgrade 1', era: upgrading.upgrades[0].era, active: currentLevel >= 1 },
          { label: 'Upgrade 2', era: upgrading.upgrades[1].era, active: currentLevel >= 2 },
        ];

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
                <h3 className="text-xl font-black uppercase text-white">
                  {canUpgrade ? 'Upgrade Card' : 'Card Info'}
                </h3>
                <button
                  onClick={() => setUpgrading(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Card + player info */}
              <div className="flex items-center gap-4 px-5 pb-4">
                <PlayerCard card={upgrading} upgradeLevel={currentLevel} foil={ownedEntry?.isFoilEquipped} size="md" />
                <div className="flex flex-1 flex-col gap-3">
                  <div className="text-lg font-bold leading-tight text-white">
                    {upgrading.playerName}
                  </div>

                  {/* Era progression */}
                  <div className="space-y-1.5">
                    {eraRows.map((row, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={cn(
                          'h-4 w-4 shrink-0 rounded-full border text-center text-[9px] font-black leading-4',
                          row.active
                            ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                            : 'border-white/20 text-white/30',
                        )}>
                          {row.active ? '✓' : i}
                        </span>
                        <span className={cn('truncate', row.active ? 'text-white' : 'text-white/30')}>
                          {i === 0 ? row.era : `Unlock ${row.era}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Level dots */}
                  <div className="flex gap-1.5">
                    {([0, 1, 2] as const).map((lvl) => (
                      <div
                        key={lvl}
                        className={cn(
                          'h-2 flex-1 rounded-full',
                          lvl <= currentLevel ? 'bg-amber-400' : 'bg-white/15',
                        )}
                      />
                    ))}
                  </div>

                  {ownedEntry?.isFoilUnlocked && (
                    <button
                      onClick={() => toggleFoil(upgrading.id)}
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
                {canUpgrade && (
                  <button
                    onClick={confirmUpgrade}
                    disabled={coins < cost}
                    className="flex w-full flex-col items-center justify-center rounded-2xl bg-emerald-400 py-3.5 text-emerald-950 transition-opacity disabled:opacity-40"
                  >
                    <span className="text-base font-black uppercase">
                      ⬆ Upgrade · 🪙 {formatCoins(cost)}
                    </span>
                    {nextEra && (
                      <span className="mt-0.5 text-[11px] font-semibold opacity-75">
                        Unlock {nextEra}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={() => { sell(upgrading.id); setUpgrading(null); }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-purple-400/40 py-3.5 text-base font-bold text-purple-300 hover:bg-purple-400/10"
                >
                  Sell for 🪙 {formatCoins(discardValue(upgrading, currentLevel))}
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
  options: readonly T[];
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
            {o === '0' ? 'Base' : o === '1' ? 'Lvl 1' : o === '2' ? 'Max' : o}
          </button>
        ))}
      </div>
    </div>
  );
}
