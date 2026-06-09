'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { GAME_MODES } from '@/data/gameModes';
import type { GameModeDef, ModeId, ModeCompletion } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import {
  TrophyIcon,
  GlobeIcon,
  WallIcon,
  MedalIcon,
  ShieldIcon,
  CrownIcon,
} from '@/components/ui/icons';
import { cn } from '@/lib/ui';

const MODE_ICON: Record<ModeId, (props: { className?: string }) => JSX.Element> = {
  'domestic-double': TrophyIcon,
  'european-glory': GlobeIcon,
  'iron-defence': WallIcon,
  centurions: MedalIcon,
  invincibles: ShieldIcon,
  quadruple: CrownIcon,
};

export default function HomePage() {
  const hydrated = useHydrated();
  const completions = useGameStore((s) => s.completions);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  }

  function goTo(i: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-black sm:text-4xl">
          Pick a <span className="text-emerald-400">Challenge</span>
        </h1>
        <p className="mt-1 max-w-xl text-white/70">
          Swipe through the challenges, build a squad from Premier League greats, and simulate a
          season to complete one.
        </p>
      </header>

      {/* Story progress segments */}
      <div className="flex gap-1.5">
        {GAME_MODES.map((mode, i) => (
          <button
            key={mode.id}
            onClick={() => goTo(i)}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"
            aria-label={`Go to ${mode.name}`}
          >
            <span
              className={cn(
                'block h-full rounded-full bg-emerald-400 transition-all',
                i === active ? 'w-full' : 'w-0'
              )}
            />
          </button>
        ))}
      </div>

      {/* Horizontal snap carousel of challenge cards */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {GAME_MODES.map((mode) => (
          <ChallengeCard
            key={mode.id}
            mode={mode}
            done={hydrated ? completions[mode.id] : undefined}
          />
        ))}
      </div>

      <p className="text-center text-xs text-white/40">
        {active + 1} / {GAME_MODES.length}
      </p>
    </div>
  );
}

function ChallengeCard({ mode, done }: { mode: GameModeDef; done?: ModeCompletion }) {
  const Icon = MODE_ICON[mode.id];
  return (
    <div className="flex w-full min-w-full shrink-0 snap-center justify-center px-2 py-1">
      <Link
        href={`/modes/${mode.id}/`}
        className="group relative flex aspect-[5/7] w-full max-w-xs flex-col overflow-hidden rounded-3xl border-2 border-white/15 bg-gradient-to-b from-pitch-light to-pitch-dark p-6 text-center shadow-xl transition-colors hover:border-emerald-400/60"
      >
        {done && (
          <span className="absolute right-4 top-4 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
            ✓ ×{done.timesCompleted}
          </span>
        )}

        {/* Icon art over a glow */}
        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl" />
          <Icon className="relative h-28 w-28 text-emerald-300 drop-shadow-lg" />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-2xl font-black group-hover:text-emerald-300">{mode.name}</h2>
          <p className="mx-auto mt-2 max-w-[18rem] text-sm text-white/60">{mode.description}</p>
          <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs">
            <span className="font-bold text-emerald-300">Goal: </span>
            <span className="text-white/70">{mode.winConditionText}</span>
          </div>
          <p className="mx-auto mt-2 max-w-[18rem] text-[11px] text-white/40">{mode.focus}</p>
          <span className="mt-3 inline-block rounded-full bg-emerald-500 px-6 py-2 text-sm font-black text-emerald-950 transition-transform group-hover:scale-105">
            Start Challenge
          </span>
        </div>
      </Link>
    </div>
  );
}
