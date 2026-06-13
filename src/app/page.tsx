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
    <div className="mx-auto max-w-sm space-y-3">
      {/* Challenge card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-white/15 bg-gradient-to-b from-pitch-light to-pitch-dark p-5 text-center shadow-xl">
        {completion && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
            🏆 ×{completion.timesCompleted}
          </span>
        )}

        {/* Flag */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
          <span className="relative text-[5rem] drop-shadow-2xl leading-none">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
        </div>

        <h2 className="text-xl font-black">England World Cup</h2>

        {/* Status */}
        {statusLine && (
          <p className="mt-2 text-xs font-bold text-white/50">{statusLine}</p>
        )}

        <Link
          href={`/modes/${mode.id}/`}
          className="mt-4 inline-block rounded-full bg-emerald-500 px-8 py-2.5 text-sm font-black text-emerald-950 transition-transform hover:scale-105"
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
