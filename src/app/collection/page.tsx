'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { getCard, ALL_CARDS } from '@/data/players';
import { discardValue } from '@/lib/coinRewards';
import { PlayerCard } from '@/components/cards/PlayerCard';
import { Button } from '@/components/ui/Button';
import { cn, formatCoins } from '@/lib/ui';
import type { PackCategory, Tier } from '@/store/types';

const CATEGORIES: (PackCategory | 'ALL')[] = ['ALL', 'GK', 'DEF', 'MID', 'ATT'];
const TIERS: (Tier | 'ALL')[] = ['ALL', 'Rising', 'Star', 'Legend'];

export default function CollectionPage() {
  const hydrated = useHydrated();
  const ownedCards = useGameStore((s) => s.ownedCards);
  const discardCard = useGameStore((s) => s.discardCard);
  const toggleFoil = useGameStore((s) => s.toggleFoilEquipped);

  const [cat, setCat] = useState<PackCategory | 'ALL'>('ALL');
  const [tier, setTier] = useState<Tier | 'ALL'>('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const owned = useMemo(() => {
    return Object.values(ownedCards)
      .map((o) => ({ owned: o, card: getCard(o.cardId)! }))
      .filter((x) => x.card)
      .filter((x) => cat === 'ALL' || x.card.pack === cat)
      .filter((x) => tier === 'ALL' || x.card.tier === tier)
      .sort((a, b) => b.card.rating - a.card.rating);
  }, [ownedCards, cat, tier]);

  function sell(cardId: string) {
    const gained = discardCard(cardId);
    if (gained > 0) {
      setToast(`Sold for 🪙 ${formatCoins(gained)}`);
      setTimeout(() => setToast(null), 1800);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Collection</h1>
          <p className="text-white/60">
            {hydrated
              ? `${Object.keys(ownedCards).length} of ${ALL_CARDS.length} unique cards owned`
              : '—'}
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <FilterRow label="Position" options={CATEGORIES} value={cat} onChange={setCat} />
        <FilterRow label="Tier" options={TIERS} value={tier} onChange={setTier} />
      </div>

      {!hydrated ? null : owned.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
          <p className="text-white/60">No cards yet.</p>
          <Link href="/shop" className="mt-3 inline-block">
            <Button>Open your first pack</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {owned.map(({ owned: o, card }) => (
            <div key={o.cardId} className="flex flex-col items-center gap-2">
              <div className="relative">
                <PlayerCard card={card} foil={o.isFoilEquipped} size="md" />
                {o.quantity > 1 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-0.5 text-xs font-black text-black">
                    ×{o.quantity}
                  </span>
                )}
              </div>
              <div className="flex w-40 flex-col gap-1">
                {o.isFoilUnlocked && (
                  <Button
                    size="sm"
                    variant={o.isFoilEquipped ? 'primary' : 'secondary'}
                    onClick={() => toggleFoil(o.cardId)}
                  >
                    {o.isFoilEquipped ? '✨ Foil On' : 'Foil Off'}
                  </Button>
                )}
                <Button size="sm" variant="danger" onClick={() => sell(o.cardId)}>
                  Sell 🪙 {formatCoins(discardValue(card))}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-coin-pop rounded-lg bg-emerald-500 px-4 py-2 font-bold text-emerald-950 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
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
              value === o ? 'bg-emerald-500 text-emerald-950' : 'bg-white/10 text-white/70 hover:bg-white/20'
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
