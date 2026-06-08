'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { ALL_CARDS } from '@/data/players';
import { GAME_MODES } from '@/data/gameModes';
import { formatCoins } from '@/lib/ui';

const TILES = [
  { href: '/shop', emoji: '📦', title: 'Pack Shop', desc: 'Spend coins on packs' },
  { href: '/collection', emoji: '🗂️', title: 'Collection', desc: 'View & sell your cards' },
  { href: '/modes', emoji: '🏆', title: 'Challenges', desc: 'Build a squad, play a season' },
];

export default function HomePage() {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const ownedCards = useGameStore((s) => s.ownedCards);
  const completions = useGameStore((s) => s.completions);
  const loginStreak = useGameStore((s) => s.loginStreak);
  const lastLoginDate = useGameStore((s) => s.lastLoginDate);
  const claimDailyLogin = useGameStore((s) => s.claimDailyLogin);

  const [claimed, setClaimed] = useState<number | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const alreadyClaimed = lastLoginDate === today;

  // Auto-evaluate claim availability after hydration.
  useEffect(() => {
    if (hydrated && claimed === null && alreadyClaimed) setClaimed(0);
  }, [hydrated, alreadyClaimed, claimed]);

  const ownedCount = Object.keys(ownedCards).length;
  const completedModes = Object.keys(completions).length;

  function handleClaim() {
    const reward = claimDailyLogin();
    if (reward !== null) setClaimed(reward);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-pitch/40 p-6 sm:p-8">
        <h1 className="text-3xl font-black sm:text-4xl">
          Welcome back, <span className="text-emerald-400">Gaffer</span>
        </h1>
        <p className="mt-2 max-w-xl text-white/70">
          Collect Premier League greats across their careers, build the perfect squad, and
          simulate a season to chase glory.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
          <Stat label="Coins" value={hydrated ? formatCoins(coins) : '—'} />
          <Stat label="Cards" value={hydrated ? `${ownedCount}/${ALL_CARDS.length}` : '—'} />
          <Stat
            label="Challenges"
            value={hydrated ? `${completedModes}/${GAME_MODES.length}` : '—'}
          />
        </div>
      </section>

      {/* Daily login */}
      <section className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-yellow-300">Daily Reward</h2>
            <p className="text-sm text-white/60">
              {hydrated ? `Login streak: ${loginStreak} day${loginStreak === 1 ? '' : 's'}` : '—'}
            </p>
          </div>
          {hydrated && (alreadyClaimed && claimed === 0) ? (
            <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white/50">
              ✓ Claimed today
            </span>
          ) : claimed && claimed > 0 ? (
            <span className="animate-coin-pop rounded-lg bg-yellow-400/20 px-4 py-2 text-sm font-bold text-yellow-300">
              +{formatCoins(claimed)} 🪙
            </span>
          ) : (
            <Button onClick={handleClaim} disabled={!hydrated}>
              Claim Daily Reward
            </Button>
          )}
        </div>
      </section>

      {/* Nav tiles */}
      <section className="grid gap-4 sm:grid-cols-3">
        {TILES.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/5"
          >
            <div className="text-4xl">{t.emoji}</div>
            <h3 className="mt-3 text-lg font-bold group-hover:text-emerald-300">{t.title}</h3>
            <p className="text-sm text-white/60">{t.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/30 p-3 text-center">
      <div className="text-xl font-black tabular-nums text-emerald-300">{value}</div>
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
    </div>
  );
}
