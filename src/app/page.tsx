'use client';

import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { GAME_MODES } from '@/data/gameModes';
import { formatCoins } from '@/lib/ui';

const TILES = [
  { href: '/shop', emoji: '📦', title: 'Pack Shop', desc: 'Spend coins on packs' },
  { href: '/collection', emoji: '🗂️', title: 'Your Cards', desc: 'Upgrade & sell players' },
  { href: '/modes', emoji: '🏆', title: 'Challenges', desc: 'Build a squad, play a season' },
];

export default function HomePage() {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const completions = useGameStore((s) => s.completions);

  const completedModes = Object.keys(completions).length;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-pitch/40 p-6 sm:p-8">
        <h1 className="text-3xl font-black sm:text-4xl">
          Welcome back, <span className="text-emerald-400">Gaffer</span>
        </h1>
        <p className="mt-2 max-w-xl text-white/70">
          Build a squad from Premier League greats and simulate a season to complete the
          challenges. Pick one up whenever you have a spare moment.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
          <Stat label="Coins" value={hydrated ? formatCoins(coins) : '—'} />
          <Stat
            label="Challenges"
            value={hydrated ? `${completedModes}/${GAME_MODES.length}` : '—'}
          />
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
