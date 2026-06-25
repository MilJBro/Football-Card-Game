'use client';

import Link from 'next/link';
import { GAME_MODES } from '@/data/gameModes';
import { PL_CLUBS } from '@/data/clubs';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { cn } from '@/lib/ui';

export default function HomePage() {
  const hydrated = useHydrated();
  const selectedClub = useGameStore((s) => s.selectedClub);
  const setSelectedClub = useGameStore((s) => s.setSelectedClub);
  const completions = useGameStore((s) => s.completions);
  const history = useGameStore((s) => s.history);
  const currentStage = useGameStore((s) => s.currentStage);
  const tournamentWon = useGameStore((s) => s.tournamentWon);
  const tournamentEliminated = useGameStore((s) => s.tournamentEliminated);

  const mode = GAME_MODES[0];
  const completion = hydrated ? completions[mode.id] : undefined;

  const runInProgress = hydrated && currentStage && !tournamentWon && !tournamentEliminated;
  const wins = completion?.timesCompleted ?? 0;
  const played = hydrated ? history.length : 0;

  const activeClub = hydrated ? PL_CLUBS.find((c) => c.id === selectedClub) : null;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3" style={{ minHeight: 'calc(100svh - 10.5rem)' }}>

      {/* Selected club + play button */}
      {hydrated && activeClub ? (
        <div
          className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 border-white/15 px-6 py-10 shadow-xl"
          style={{ background: `linear-gradient(135deg, ${activeClub.primary}cc 0%, ${activeClub.secondary}88 100%)` }}
        >
          <div className="text-center">
            <div className="text-[11px] font-black uppercase tracking-widest text-white/50">{activeClub.short}</div>
            <div className="text-2xl font-black text-white">{activeClub.name}</div>
          </div>

          {hydrated && tournamentWon && (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300">
              🏆 Champions
            </span>
          )}

          <Link
            href={`/modes/${mode.id}/`}
            className="rounded-full bg-white px-10 py-3 text-base font-black transition-transform hover:scale-105"
            style={{ color: activeClub.primary }}
          >
            {runInProgress ? 'Continue →' : 'Play →'}
          </Link>

          {/* Stats */}
          {(wins > 0 || played > 0) && (
            <div className="flex w-full divide-x divide-white/20 rounded-2xl border border-white/20 bg-black/20">
              <div className="flex flex-1 flex-col items-center py-3">
                <span className="text-lg font-black text-amber-300">{wins}</span>
                <span className="text-[10px] uppercase tracking-wide text-white/40">Wins</span>
              </div>
              <div className="flex flex-1 flex-col items-center py-3">
                <span className="text-lg font-black text-white">{played}</span>
                <span className="text-[10px] uppercase tracking-wide text-white/40">Played</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Placeholder before hydration or no club selected */
        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-white/15 bg-white/5 px-6 py-10 text-center">
          <span className="text-3xl">⚽</span>
          <p className="text-sm font-black text-white">Pick your club below</p>
          <p className="text-xs text-white/40">Select a Premier League side to get started</p>
        </div>
      )}

      {/* Club grid */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-4 py-3">
          <span className="text-sm font-black text-white">Premier League</span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-2">
          {PL_CLUBS.map((club) => {
            const isSelected = hydrated && selectedClub === club.id;
            return (
              <button
                key={club.id}
                onClick={() => setSelectedClub(club.id)}
                className={cn(
                  'relative overflow-hidden rounded-xl px-3 py-3 text-left transition-all',
                  isSelected
                    ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-[#060D1E]'
                    : 'ring-1 ring-white/10 hover:ring-white/25',
                )}
                style={{
                  background: `linear-gradient(135deg, ${club.primary}cc 0%, ${club.secondary}55 100%)`,
                }}
              >
                <div className="text-[9px] font-black uppercase tracking-widest text-white/50">{club.short}</div>
                <div className="text-xs font-black leading-tight text-white">{club.name}</div>
                {isSelected && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
