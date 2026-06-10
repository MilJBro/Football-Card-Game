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
    const clamped = Math.max(0, Math.min(GAME_MODES.length - 1, i));
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
    setActive(clamped);
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-black sm:text-4xl">
          Pick a <span className="text-emerald-400">Challenge</span>
        </h1>
        <p className="mt-1 max-w-xl text-white/70">
          Choose one of the six challenges below, build your squad, and simulate a season to complete it.
        </p>
      </header>

      {/* Navigation row — arrows + dot indicators */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl font-bold text-white transition-colors hover:bg-white/20 disabled:opacity-20"
          aria-label="Previous challenge"
        >
          ‹
        </button>

        <div className="flex flex-1 items-center justify-center gap-2">
          {GAME_MODES.map((mode, i) => (
            <button
              key={mode.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${mode.name}`}
              className={cn(
                'h-2.5 rounded-full transition-all duration-200',
                i === active
                  ? 'w-6 bg-emerald-400'
                  : 'w-2.5 bg-white/25 hover:bg-white/50',
              )}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(active + 1)}
          disabled={active === GAME_MODES.length - 1}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl font-bold text-white transition-colors hover:bg-white/20 disabled:opacity-20"
          aria-label="Next challenge"
        >
          ›
        </button>
      </div>

      {/* Current challenge name + count */}
      <p className="text-center text-sm font-bold text-white/60">
        <span className="text-white">{GAME_MODES[active].name}</span>
        <span className="ml-2 text-white/30">· {active + 1} / {GAME_MODES.length}</span>
      </p>

      {/* Horizontal snap carousel */}
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

        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl" />
          <Icon className="relative h-28 w-28 text-emerald-300 drop-shadow-lg" />
        </div>

        <div>
          <h2 className="text-2xl font-black group-hover:text-emerald-300">{mode.name}</h2>
          <p className="mx-auto mt-2 max-w-[18rem] text-sm text-white/60">{mode.description}</p>
          <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs">
            <span className="font-bold text-emerald-300">Goal: </span>
            <span className="text-white/70">{mode.winConditionText}</span>
          </div>
          <span className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-2 text-sm font-black text-emerald-950 transition-transform group-hover:scale-105">
            Start Challenge →
          </span>
        </div>
      </Link>
    </div>
  );
}
