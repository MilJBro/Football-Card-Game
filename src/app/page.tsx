'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { GAME_MODES } from '@/data/gameModes';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { cn } from '@/lib/ui';
import { ENGLAND_WC_YEARS } from '@/lib/worldCupEngine';

// null = random draw, number = specific WC year
const ALL_YEAR_OPTIONS: (number | null)[] = [null, ...ENGLAND_WC_YEARS];

const STAGE_LABELS: Record<string, string> = {
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-Final',
  sf: 'Semi-Final',
  final: 'The Final',
  won: 'Champions',
};

// Worst → best, for ranking the furthest stage ever reached.
const STAGE_ORDER = ['group', 'r32', 'r16', 'qf', 'sf', 'final', 'won'];

export default function HomePage() {
  const hydrated = useHydrated();
  const completions = useGameStore((s) => s.completions);
  const history = useGameStore((s) => s.history);
  const currentStage = useGameStore((s) => s.currentStage);
  const tournamentWon = useGameStore((s) => s.tournamentWon);
  const tournamentEliminated = useGameStore((s) => s.tournamentEliminated);
  const manager = useGameStore((s) => s.manager);
  const realisticGroupsYear = useGameStore((s) => s.realisticGroupsYear);
  const setRealisticGroupsYear = useGameStore((s) => s.setRealisticGroupsYear);
  const mode = GAME_MODES[0];
  const completion = hydrated ? completions[mode.id] : undefined;

  const runInProgress = hydrated && currentStage && !tournamentWon && !tournamentEliminated;

  const wins = completion?.timesCompleted ?? 0;
  const played = hydrated ? history.length : 0;
  const bestRating = completion?.bestSquadRating ?? 0;

  const modeRuns = hydrated ? history.filter((r) => r.modeId === mode.id) : [];
  const furthestIdx = modeRuns.reduce(
    (max, r) => Math.max(max, STAGE_ORDER.indexOf(r.reachedStage)),
    -1,
  );
  const furthestStage = furthestIdx >= 0 ? STAGE_ORDER[furthestIdx] : null;
  const winRate =
    modeRuns.length > 0
      ? Math.round((modeRuns.filter((r) => r.success).length / modeRuns.length) * 100)
      : 0;

  const yearScrollRef = useRef<HTMLDivElement>(null);
  const firstScrollRef = useRef(true);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the selected item centred in the wheel
  useEffect(() => {
    if (!hydrated || !yearScrollRef.current) return;
    const idx = ALL_YEAR_OPTIONS.indexOf(realisticGroupsYear);
    if (idx < 0) return;
    const ITEM_W = 56; // w-14
    const left = idx * ITEM_W;
    if (firstScrollRef.current) {
      yearScrollRef.current.scrollLeft = left;
      firstScrollRef.current = false;
    } else {
      yearScrollRef.current.scrollTo({ left, behavior: 'smooth' });
    }
  }, [realisticGroupsYear, hydrated]);

  function handleYearScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const ITEM_W = 56;
      const idx = Math.round(el.scrollLeft / ITEM_W);
      const clamped = Math.max(0, Math.min(idx, ALL_YEAR_OPTIONS.length - 1));
      setRealisticGroupsYear(ALL_YEAR_OPTIONS[clamped]);
    }, 120);
  }

  return (
    /* 10.5rem = navbar (~3rem) + pt-6 (1.5rem) + pb-24 (6rem) */
    <div className="mx-auto flex max-w-sm flex-col gap-3" style={{ minHeight: 'calc(100svh - 10.5rem)' }}>

      {/* Challenge card — grows to fill available space */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border-2 border-white/15 bg-gradient-to-b from-pitch-light to-pitch-dark shadow-xl">

        {/* Main content — centred and evenly spaced */}
        <div className="flex flex-1 flex-col items-center justify-evenly px-6 py-8 text-center">

          {/* Flag */}
          <div className="relative flex items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
            <span className="relative text-[6.5rem] leading-none drop-shadow-2xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
          </div>

          {/* Title + status chips */}
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-black">Golden XI</h2>

            {hydrated && runInProgress && manager && (
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="text-xs font-bold text-white/70">{manager.name}</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                  {manager.formation}
                </span>
              </div>
            )}

            {hydrated && (tournamentWon || tournamentEliminated) && (
              <span className={`rounded-full px-3 py-1 text-xs font-black ${tournamentWon ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                {tournamentWon ? '🏆 Champions' : '💔 Eliminated'}
              </span>
            )}

            {hydrated && runInProgress && currentStage && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {STAGE_LABELS[currentStage]}
              </span>
            )}
          </div>

          <Link
            href={`/modes/${mode.id}/`}
            className="rounded-full bg-emerald-500 px-10 py-3 text-base font-black text-emerald-950 transition-transform hover:scale-105"
          >
            {runInProgress ? 'Continue →' : 'Play →'}
          </Link>
        </div>

        {/* Stats row */}
        {hydrated && (
          <div className="flex border-t border-white/10">
            <div className="flex flex-1 flex-col items-center py-3">
              <span className="text-lg font-black text-amber-300">{wins}</span>
              <span className="text-[10px] uppercase tracking-wide text-white/40">Wins</span>
            </div>
            <div className="flex flex-1 flex-col items-center border-x border-white/10 py-3">
              <span className="text-lg font-black text-emerald-300">{bestRating || '—'}</span>
              <span className="text-[10px] uppercase tracking-wide text-white/40">Best Rating</span>
            </div>
            <div className="flex flex-1 flex-col items-center py-3">
              <span className="text-lg font-black text-white">{played}</span>
              <span className="text-[10px] uppercase tracking-wide text-white/40">Played</span>
            </div>
          </div>
        )}
      </div>

      {/* Group stage wheel */}
      {hydrated && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-baseline justify-between px-4 pb-1 pt-3">
            <div className="text-sm font-black text-white">Group Stage</div>
            <div className="text-[11px] text-white/40">
              {realisticGroupsYear !== null ? `${realisticGroupsYear} World Cup` : 'Random draw'}
            </div>
          </div>

          {/* Wheel */}
          <div className="relative py-1">
            {/* Centre selection ring */}
            <div className="pointer-events-none absolute inset-y-1 left-1/2 z-10 w-14 -translate-x-1/2 rounded-lg border border-emerald-500/30 bg-emerald-500/10" />
            {/* Left fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#060D1E] to-transparent" />
            {/* Right fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#060D1E] to-transparent" />

            <div
              ref={yearScrollRef}
              className="no-scrollbar flex overflow-x-scroll"
              onScroll={handleYearScroll}
              style={{
                scrollSnapType: 'x mandatory',
                paddingInline: 'calc(50% - 28px)',
              }}
            >
              {ALL_YEAR_OPTIONS.map((year) => (
                <div
                  key={year ?? 'rnd'}
                  className={cn(
                    'w-14 flex-none py-2 text-center text-xs font-bold transition-colors duration-150',
                    realisticGroupsYear === year ? 'text-emerald-400' : 'text-white/30',
                  )}
                  style={{ scrollSnapAlign: 'center' }}
                >
                  {year ?? 'Random'}
                </div>
              ))}
            </div>
          </div>

          {runInProgress && (
            <p className="border-t border-white/10 px-4 py-2 text-[10px] text-white/30">
              Takes effect on your next tournament
            </p>
          )}
        </div>
      )}

      {/* Best run + win rate — appears once at least one tournament is played */}
      {hydrated && modeRuns.length > 0 && (
        <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex flex-1 flex-col items-center gap-0.5 py-3">
            <span className="text-[10px] uppercase tracking-wide text-white/40">Best Run</span>
            <span
              className={`text-sm font-black ${
                furthestStage === 'won' ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              {furthestStage ? STAGE_LABELS[furthestStage] : '—'}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5 border-l border-white/10 py-3">
            <span className="text-[10px] uppercase tracking-wide text-white/40">Win Rate</span>
            <span className="text-sm font-black text-white">{winRate}%</span>
          </div>
        </div>
      )}

    </div>
  );
}
