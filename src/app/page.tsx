'use client';

import Link from 'next/link';
import { GAME_MODES } from '@/data/gameModes';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';

const STAGE_LABELS: Record<string, string> = {
  group: 'Groups',
  r32: 'R32',
  r16: 'R16',
  qf: 'QF',
  sf: 'SF',
  final: 'Final',
};

const STAGE_ORDER = ['group', 'r32', 'r16', 'qf', 'sf', 'final'];

export default function HomePage() {
  const hydrated = useHydrated();
  const completions = useGameStore((s) => s.completions);
  const currentStage = useGameStore((s) => s.currentStage);
  const tournamentWon = useGameStore((s) => s.tournamentWon);
  const tournamentEliminated = useGameStore((s) => s.tournamentEliminated);
  const mode = GAME_MODES[0];
  const completion = hydrated ? completions[mode.id] : undefined;

  const statusLine = !hydrated ? null
    : tournamentWon ? 'Champions — play again?'
    : tournamentEliminated ? 'Eliminated — try again'
    : currentStage ? `In progress: ${STAGE_LABELS[currentStage] ?? currentStage}`
    : null;

  const currentStageIndex = currentStage ? STAGE_ORDER.indexOf(currentStage) : -1;

  return (
    /* 10.5rem = navbar (~3rem) + pt-6 (1.5rem) + pb-24 (6rem) */
    <div className="mx-auto flex max-w-sm flex-col gap-3" style={{ minHeight: 'calc(100svh - 10.5rem)' }}>

      {/* Challenge card — grows to fill available space */}
      <div className="relative flex flex-1 flex-col items-center justify-evenly overflow-hidden rounded-3xl border-2 border-white/15 bg-gradient-to-b from-pitch-light to-pitch-dark px-6 py-8 text-center shadow-xl">
        {completion && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
            🏆 ×{completion.timesCompleted}
          </span>
        )}

        {/* Flag */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
          <span className="relative text-[6.5rem] leading-none drop-shadow-2xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
        </div>

        <div>
          <h2 className="text-2xl font-black">England World Cup</h2>
          {statusLine && (
            <p className="mt-1.5 text-xs font-bold text-white/50">{statusLine}</p>
          )}
        </div>

        <Link
          href={`/modes/${mode.id}/`}
          className="rounded-full bg-emerald-500 px-10 py-3 text-base font-black text-emerald-950 transition-transform hover:scale-105"
        >
          {currentStage && !tournamentWon && !tournamentEliminated ? 'Continue →' : 'Play →'}
        </Link>
      </div>

      {/* Stage roadmap */}
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">Tournament Path</div>
        <div className="flex items-end gap-1">
          {STAGE_ORDER.map((stage, i) => {
            const isPast = currentStageIndex > i || tournamentWon;
            const isCurrent = currentStageIndex === i && !tournamentWon && !tournamentEliminated;
            return (
              <div key={stage} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={
                    isCurrent
                      ? 'text-[10px] font-black text-emerald-400'
                      : isPast
                        ? 'text-[10px] font-bold text-white/60'
                        : 'text-[10px] font-bold text-white/25'
                  }
                >
                  {STAGE_LABELS[stage]}
                </span>
                <div
                  className={
                    'h-1 w-full rounded-full ' +
                    (isCurrent
                      ? 'bg-emerald-400'
                      : isPast
                        ? 'bg-emerald-800'
                        : 'bg-white/10')
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
