'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameModeDef, Squad, TournamentStage, MatchResult, GroupStageResult } from '@/store/types';
import { summariseSquad } from '@/lib/squadUtils';
import {
  simulateGroupStage,
  simulateKnockoutStage,
  getStageLabel,
  getNextStage,
  matchWon,
} from '@/lib/worldCupEngine';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { SeasonReward } from '@/components/modes/SeasonReward';
import { cn } from '@/lib/ui';

type Phase = 'ready' | 'simulating' | 'group-result' | 'knockout-result' | 'won' | 'eliminated';

const STAGE_ORDER: TournamentStage[] = ['group', 'r32', 'r16', 'qf', 'sf', 'final'];

interface SimulationTabProps {
  mode: GameModeDef;
  squad: Squad;
  onSquadChange: (squad: Squad) => void;
  onGoToSquad: () => void;
}

export function SimulationTab({ mode, squad, onSquadChange, onGoToSquad }: SimulationTabProps) {
  const hydrated = useHydrated();
  const ownedCards = useGameStore((s) => s.ownedCards);
  const recordRun = useGameStore((s) => s.recordRun);
  const currentStage = useGameStore((s) => s.currentStage);
  const tournamentWon = useGameStore((s) => s.tournamentWon);
  const tournamentEliminated = useGameStore((s) => s.tournamentEliminated);
  const startTournament = useGameStore((s) => s.startTournament);
  const advanceStage = useGameStore((s) => s.advanceStage);
  const eliminateFromTournament = useGameStore((s) => s.eliminateFromTournament);
  const winTournament = useGameStore((s) => s.winTournament);
  const restartRun = useGameStore((s) => s.restartRun);
  const completions = useGameStore((s) => s.completions);

  const [phase, setPhase] = useState<Phase>(() => {
    if (tournamentWon) return 'won';
    if (tournamentEliminated) return 'eliminated';
    return 'ready';
  });

  const [groupResult, setGroupResult] = useState<GroupStageResult | null>(null);
  const [knockoutResult, setKnockoutResult] = useState<MatchResult | null>(null);
  /** Stage the result on screen belongs to — currentStage may have already advanced. */
  const [playedStage, setPlayedStage] = useState<TournamentStage>('group');
  const [showReward, setShowReward] = useState(false);

  const summary = summariseSquad(squad, ownedCards);
  const stageToSimulate = currentStage ?? 'group';
  const stageLabel = getStageLabel(stageToSimulate);

  function simulate() {
    const isFirst = currentStage === null;
    if (isFirst) startTournament();
    setPhase('simulating');
    setShowReward(false);

    setTimeout(() => {
      const sum = summariseSquad(squad, ownedCards);
      const stage = isFirst ? 'group' : (currentStage ?? 'group');
      setPlayedStage(stage);

      if (stage === 'group') {
        const result = simulateGroupStage(sum.rating);
        setGroupResult(result);
        setPhase('group-result');

        if (!result.qualified) {
          eliminateFromTournament();
          recordRun({ modeId: mode.id, success: false, reachedStage: 'group', squadRating: sum.rating, playedAt: Date.now() });
        } else {
          advanceStage('r32');
        }
      } else {
        const result = simulateKnockoutStage(sum.rating, stage);
        setKnockoutResult(result);
        setPhase('knockout-result');

        if (!matchWon(result)) {
          eliminateFromTournament();
          recordRun({ modeId: mode.id, success: false, reachedStage: stage, squadRating: sum.rating, playedAt: Date.now() });
        } else if (stage === 'final') {
          winTournament();
          recordRun({ modeId: mode.id, success: true, reachedStage: 'won', squadRating: sum.rating, playedAt: Date.now() });
        } else {
          const next = getNextStage(stage);
          advanceStage(next);
        }
      }
    }, 1600);
  }

  function continueToNext() {
    setGroupResult(null);
    setKnockoutResult(null);
    setShowReward(false);

    if (tournamentWon) {
      setPhase('won');
    } else if (tournamentEliminated) {
      setPhase('eliminated');
    } else {
      setPhase('ready');
    }
  }

  function restart() {
    restartRun();
    setGroupResult(null);
    setKnockoutResult(null);
    setShowReward(false);
    setPhase('ready');
  }

  // ---------------------------------------------------------------- Simulating
  if (phase === 'simulating') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-32 text-center">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          ⚽
        </motion.div>
        <p className="text-lg font-bold text-white/70">Simulating the {stageLabel}…</p>
      </div>
    );
  }

  // ---------------------------------------------------------------- Group result
  if (phase === 'group-result' && groupResult) {
    const qualified = groupResult.qualified;
    return (
      <div className="space-y-4">
        <div className={cn(
          'rounded-2xl border-2 p-5 text-center',
          qualified ? 'border-emerald-400 bg-emerald-400/10' : 'border-red-400/50 bg-red-400/10',
        )}>
          <div className="text-5xl">{qualified ? '✅' : '❌'}</div>
          <h1 className="mt-2 text-2xl font-black">
            {qualified ? 'Qualified!' : 'Eliminated'}
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {qualified
              ? `${groupResult.points} points — through to the Round of 32`
              : `Only ${groupResult.points} points — not enough to qualify`}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-white/40">Group Stage Results</div>
          <div className="space-y-2">
            {groupResult.matches.map((m, i) => (
              <MatchCard key={i} match={m} stage="group" />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-black/20 px-4 py-2">
            <span className="text-sm font-bold text-white/60">Total Points</span>
            <span className={cn('text-xl font-black tabular-nums', qualified ? 'text-emerald-300' : 'text-red-400')}>
              {groupResult.points} / 9
            </span>
          </div>
        </div>

        {qualified && !showReward && (
          <Button size="lg" className="w-full" onClick={() => setShowReward(true)}>
            🎰 Spin for Reward
          </Button>
        )}

        {qualified ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="flex-1" onClick={onGoToSquad}>Adjust Squad</Button>
            <Button className="flex-1" onClick={continueToNext}>Round of 32 →</Button>
          </div>
        ) : (
          <Button size="lg" variant="danger" className="w-full" onClick={restart}>
            Start Again
          </Button>
        )}

        {showReward && (
          <SeasonReward
            squad={squad}
            onClaim={(updatedSquad) => onSquadChange(updatedSquad)}
            onDismiss={() => setShowReward(false)}
          />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------- Knockout result
  if (phase === 'knockout-result' && knockoutResult) {
    const won = matchWon(knockoutResult);
    const nextAfterPlayed = getNextStage(playedStage);
    const nextStageName = nextAfterPlayed ? getStageLabel(nextAfterPlayed) : '';
    const wasFinale = playedStage === 'final';

    return (
      <div className="space-y-4">
        <div className={cn(
          'rounded-2xl border-2 p-5 text-center',
          won && wasFinale ? 'border-amber-400 bg-amber-400/10'
            : won ? 'border-emerald-400 bg-emerald-400/10'
            : 'border-red-400/50 bg-red-400/10',
        )}>
          <div className="text-5xl">{won && wasFinale ? '🏆' : won ? '✅' : '❌'}</div>
          <h1 className="mt-2 text-2xl font-black">
            {won && wasFinale ? 'World Champions!' : won ? `${getStageLabel(playedStage)} — Won!` : 'Eliminated'}
          </h1>
          {won && wasFinale && (
            <p className="mt-1 text-sm text-white/60">
              England are World Cup winners — incredible!
            </p>
          )}
          {!won && (
            <p className="mt-1 text-sm text-white/50">
              England are out of the World Cup
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-white/40">
            {getStageLabel(playedStage)}
          </div>
          <MatchCard match={knockoutResult} stage="knockout" />
        </div>

        {won && !showReward && (
          <Button size="lg" className="w-full" onClick={() => setShowReward(true)}>
            🎰 Spin for Reward
          </Button>
        )}

        {won ? (
          wasFinale ? (
            <Button size="lg" className="w-full" onClick={restart}>
              Play Again
            </Button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="flex-1" onClick={onGoToSquad}>Adjust Squad</Button>
              <Button className="flex-1" onClick={continueToNext}>{nextStageName} →</Button>
            </div>
          )
        ) : (
          <Button size="lg" variant="danger" className="w-full" onClick={restart}>
            Start Again
          </Button>
        )}

        {showReward && (
          <SeasonReward
            squad={squad}
            onClaim={(updatedSquad) => onSquadChange(updatedSquad)}
            onDismiss={() => setShowReward(false)}
          />
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------- Won (persistent state)
  if (phase === 'won') {
    const completion = completions[mode.id];
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-400/10 p-6 text-center">
          <div className="text-6xl">🏆</div>
          <h1 className="mt-3 text-3xl font-black text-amber-300">World Champions!</h1>
          <p className="mt-2 text-sm text-white/60">
            England lifted the World Cup — an unforgettable achievement.
          </p>
          {completion && (
            <p className="mt-3 text-xs font-bold text-amber-400">
              Won {completion.timesCompleted} time{completion.timesCompleted !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button size="lg" className="w-full" onClick={restart}>
          Play Again
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------- Eliminated (persistent state)
  if (phase === 'eliminated') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-red-400/50 bg-red-400/10 p-6 text-center">
          <div className="text-5xl">💔</div>
          <h1 className="mt-3 text-2xl font-black">England are Out</h1>
          <p className="mt-2 text-sm text-white/50">
            This squad&apos;s World Cup journey is over. Build a new one and try again.
          </p>
        </div>
        <Button size="lg" variant="danger" className="w-full" onClick={restart}>
          Start Again
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------- Ready
  const ratingColor =
    summary.rating >= 88
      ? 'text-emerald-300'
      : summary.rating >= 80
        ? 'text-yellow-300'
        : 'text-orange-300';

  const completedStages = currentStage
    ? STAGE_ORDER.slice(0, STAGE_ORDER.indexOf(currentStage))
    : [];

  const isFirstSim = currentStage === null && !tournamentWon && !tournamentEliminated;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black">{mode.name}</h1>
        <p className="mt-1 text-white/60">{mode.description}</p>
      </header>

      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm">
        <span className="font-bold text-emerald-300">Objective: </span>
        {mode.winConditionText}.
      </div>

      {/* Tournament progress */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 text-[10px] uppercase tracking-widest text-white/40">Tournament Path</div>
        <div className="flex items-center gap-1">
          {STAGE_ORDER.map((s, i) => {
            const isDone = completedStages.includes(s);
            const isCurrent = s === stageToSimulate;
            const isPending = !isDone && !isCurrent;
            return (
              <div key={s} className="flex flex-1 flex-col items-center gap-1">
                <div className={cn(
                  'h-2 w-full rounded-full',
                  isDone ? 'bg-emerald-400' : isCurrent ? 'bg-white/50' : 'bg-white/10',
                )} />
                <span className={cn(
                  'text-[9px] font-bold text-center leading-tight',
                  isDone ? 'text-emerald-400' : isCurrent ? 'text-white' : 'text-white/30',
                )}>
                  {s === 'group' ? 'Groups' : s === 'r32' ? 'R32' : s === 'r16' ? 'R16' : s === 'qf' ? 'QF' : s === 'sf' ? 'SF' : 'Final'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Squad rating */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wide text-white/40">Squad Rating</div>
            <div className={cn('text-4xl font-black tabular-nums', ratingColor)}>
              {summary.rating || '—'}
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-sm text-white/60">
            {summary.filledSlots}/{summary.totalSlots} players · {squad.formation}
          </div>
        </div>
        <Button variant="secondary" onClick={onGoToSquad}>
          Edit Squad
        </Button>
      </div>

      {/* Next stage callout */}
      {!isFirstSim && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-white/40">Next Stage</div>
          <div className="mt-0.5 text-lg font-black text-white">{stageLabel}</div>
        </div>
      )}

      {summary.isComplete ? (
        <div className="flex justify-center">
          <Button size="lg" className="w-full" onClick={simulate} disabled={!hydrated}>
            {isFirstSim ? '🌍 Start the World Cup' : `⚽ Simulate ${stageLabel}`}
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-12 text-center">
          <p className="text-white/60">Your squad isn&apos;t complete yet.</p>
          <Button className="mt-3" onClick={onGoToSquad}>
            Build your squad
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MatchCard({ match, stage }: { match: MatchResult; stage: 'group' | 'knockout' }) {
  const won = match.englandGoals > match.opponentGoals || match.penaltiesWin === true;
  const lost = match.englandGoals < match.opponentGoals || match.penaltiesLoss === true;
  const drew = match.englandGoals === match.opponentGoals && !match.penaltiesWin && !match.penaltiesLoss;

  const resultColor = won ? 'text-emerald-300' : lost ? 'text-red-400' : 'text-yellow-300';
  const resultLabel = won ? 'W' : lost ? 'L' : 'D';

  const isPens = match.penaltiesWin || match.penaltiesLoss;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3">
      <span className={cn('w-5 text-center text-sm font-black', resultColor)}>{resultLabel}</span>
      <div className="flex flex-1 items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
          <span className="text-xs font-bold text-white">England</span>
        </div>
        <div className="text-center">
          <div className="text-lg font-black tabular-nums text-white">
            {match.englandGoals} – {match.opponentGoals}
          </div>
          {isPens && (
            <div className="text-[10px] text-white/40">
              {match.penaltiesWin ? '(ENG pens)' : '(OPP pens)'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <span className="text-xs font-bold text-white">{match.opponent.name}</span>
          <span className="text-lg">{match.opponent.flag}</span>
        </div>
      </div>
    </div>
  );
}
