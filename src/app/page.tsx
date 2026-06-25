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

  const mode = GAME_MODES[0];
  const activeClub = hydrated ? PL_CLUBS.find((c) => c.id === selectedClub) : null;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-2">

      {/* Hero */}
      {hydrated && activeClub ? (
        <div
          className="flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/10 px-4 py-3"
          style={{ background: `linear-gradient(135deg, ${activeClub.primary}ee 0%, ${activeClub.secondary}88 100%)` }}
        >
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/60">{activeClub.short}</div>
            <div className="truncate text-sm font-black text-white">{activeClub.name}</div>
          </div>
          <Link
            href={`/modes/${mode.id}/`}
            className="flex-none rounded-full bg-white px-5 py-2 text-sm font-black transition-transform hover:scale-105"
            style={{ color: activeClub.primary }}
          >
            Play →
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-xl">⚽</span>
          <div>
            <p className="text-sm font-black text-white">Pick your club</p>
            <p className="text-[11px] text-white/40">Select a Premier League side to get started</p>
          </div>
        </div>
      )}

      {/* Club grid */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-3 py-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-white/50">Premier League 2026/27</span>
        </div>
        <div className="grid grid-cols-4 gap-2 p-2">
          {PL_CLUBS.map((club) => {
            const isSelected = hydrated && selectedClub === club.id;
            return (
              <button
                key={club.id}
                onClick={() => setSelectedClub(club.id)}
                className={cn(
                  'relative overflow-hidden rounded-xl px-2.5 py-3 text-left transition-all',
                  isSelected
                    ? 'ring-2 ring-[#00FF85] ring-offset-1 ring-offset-[#38003C]'
                    : 'ring-1 ring-white/10 hover:ring-white/20',
                )}
                style={{
                  background: `linear-gradient(135deg, ${club.primary}cc 0%, ${club.secondary}55 100%)`,
                }}
              >
                <div className="text-[9px] font-black uppercase tracking-widest text-white/50">{club.short}</div>
                <div className="text-[11px] font-black leading-tight text-white">{club.name}</div>
                {isSelected && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#00FF85]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
