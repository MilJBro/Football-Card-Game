'use client';

import Link from 'next/link';
import { GAME_MODES } from '@/data/gameModes';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { cn, formatCoins } from '@/lib/ui';

function Stars({ n }: { n: number }) {
  return (
    <span className="text-yellow-400">
      {'★'.repeat(n)}
      <span className="text-white/20">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export default function HomePage() {
  const hydrated = useHydrated();
  const completions = useGameStore((s) => s.completions);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black sm:text-4xl">
          Pick a <span className="text-emerald-400">Challenge</span>
        </h1>
        <p className="mt-1 max-w-xl text-white/70">
          Choose a challenge, build a squad from Premier League greats, and simulate a season to
          complete it. Each challenge is its own run.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {GAME_MODES.map((mode) => {
          const done = hydrated ? completions[mode.id] : undefined;
          return (
            <Link
              key={mode.id}
              href={`/modes/${mode.id}/`}
              className={cn(
                'group rounded-2xl border bg-white/5 p-5 transition-colors hover:bg-emerald-400/5',
                done ? 'border-emerald-400/40' : 'border-white/10 hover:border-emerald-400/40'
              )}
            >
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-black group-hover:text-emerald-300">{mode.name}</h2>
                {done && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                    ✓ ×{done.timesCompleted}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-white/60">{mode.description}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  <Stars n={mode.difficulty} />
                </span>
                <span className="text-white/50">Rec. rating {mode.recommendedRating}</span>
                <span className="font-bold text-yellow-300">🪙 {formatCoins(mode.firstReward)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
