'use client';

import { useGameStore } from '@/store/useGameStore';
import { cn } from '@/lib/ui';
import type { ModeId, TournamentRunResult } from '@/store/types';

const STAGE_LABELS: Record<string, string> = {
  won:   'World Champions',
  final: 'Final',
  sf:    'Semi-Final',
  qf:    'Quarter-Final',
  r16:   'Round of 16',
  r32:   'Round of 32',
  group: 'Group Stage',
};

function relativeDate(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function resultColor(run: TournamentRunResult): string {
  if (run.reachedStage === 'won') return 'bg-amber-400';
  if (run.reachedStage === 'final' || run.reachedStage === 'sf') return 'bg-emerald-400';
  if (run.reachedStage === 'qf' || run.reachedStage === 'r16') return 'bg-yellow-400';
  return 'bg-red-400/70';
}

export function HistoryTab({ modeId }: { modeId: ModeId }) {
  const history = useGameStore((s) => s.history).filter((r) => r.modeId === modeId);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="text-5xl opacity-30">🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
        <p className="text-sm font-bold text-white/40">No runs yet</p>
        <p className="text-xs text-white/25">Play your first tournament to see results here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="px-1 text-[10px] uppercase tracking-widest text-white/30">
        {history.length} run{history.length !== 1 ? 's' : ''} played
      </p>
      {history.map((run, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <div className={cn('h-2.5 w-2.5 shrink-0 rounded-full', resultColor(run))} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className={cn(
                'text-sm font-black',
                run.reachedStage === 'won' ? 'text-amber-300' : 'text-white',
              )}>
                {STAGE_LABELS[run.reachedStage] ?? run.reachedStage}
              </span>
              <span className="shrink-0 text-[10px] text-white/30">{relativeDate(run.playedAt)}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/40">
              {run.managerName && <span>{run.managerName}</span>}
              {run.managerName && <span>·</span>}
              <span>Rating {run.squadRating || '—'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
