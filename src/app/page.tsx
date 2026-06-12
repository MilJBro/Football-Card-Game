'use client';

import Link from 'next/link';
import { GAME_MODES } from '@/data/gameModes';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';

export default function HomePage() {
  const hydrated = useHydrated();
  const completions = useGameStore((s) => s.completions);
  const currentStage = useGameStore((s) => s.currentStage);
  const tournamentWon = useGameStore((s) => s.tournamentWon);
  const tournamentEliminated = useGameStore((s) => s.tournamentEliminated);
  const mode = GAME_MODES[0];
  const completion = hydrated ? completions[mode.id] : undefined;

  const stageLabels: Record<string, string> = {
    group: 'Group Stage',
    r16: 'Round of 16',
    qf: 'Quarter-Final',
    sf: 'Semi-Final',
    final: 'The Final',
  };

  const statusLine = !hydrated ? null
    : tournamentWon ? '🏆 Champions — play again?'
    : tournamentEliminated ? '💔 Eliminated — try again'
    : currentStage ? `In progress: ${stageLabels[currentStage] ?? currentStage}`
    : 'Ready to start';

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black sm:text-4xl">
          <span className="text-emerald-400">England</span> World Cup
        </h1>
        <p className="mt-1 max-w-xl text-white/70">
          Build your England squad from World Cup legends, then guide them through the group stage
          and knockouts — all the way to the final.
        </p>
      </header>

      <div className="mx-auto max-w-sm space-y-4">
        {/* Challenge card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-white/15 bg-gradient-to-b from-pitch-light to-pitch-dark p-6 text-center shadow-xl">
          {completion && (
            <span className="absolute right-4 top-4 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
              🏆 ×{completion.timesCompleted}
            </span>
          )}

          {/* Flag / icon */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl" />
            <span className="relative text-[7rem] drop-shadow-2xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
          </div>

          <h2 className="text-2xl font-black">England</h2>
          <p className="mx-auto mt-2 max-w-[18rem] text-sm text-white/60">{mode.description}</p>

          {/* Goal box */}
          <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs">
            <span className="font-bold text-emerald-300">Goal: </span>
            <span className="text-white/70">{mode.winConditionText}</span>
          </div>

          {/* Status */}
          {statusLine && (
            <p className="mt-3 text-xs font-bold text-white/50">{statusLine}</p>
          )}

          <Link
            href={`/modes/${mode.id}/`}
            className="mt-5 inline-block rounded-full bg-emerald-500 px-8 py-2.5 text-sm font-black text-emerald-950 transition-transform hover:scale-105"
          >
            {currentStage && !tournamentWon && !tournamentEliminated ? 'Continue →' : 'Play →'}
          </Link>
        </div>

        {/* Stage roadmap */}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">Tournament Path</div>
          <div className="flex items-center justify-between gap-1 text-center text-[10px] font-bold text-white/40">
            {['Groups', 'R16', 'QF', 'SF', 'Final'].map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                {i > 0 && <div className="h-px w-full bg-white/10 -mt-2" />}
                <span className="relative text-[10px]">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            {['Groups', 'R16', 'QF', 'SF', 'Final'].map((label) => (
              <div key={label} className="h-1 flex-1 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
