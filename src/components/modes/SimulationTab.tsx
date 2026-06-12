'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { GameModeDef, Squad, TournamentStage, MatchResult } from '@/store/types';
import { summariseSquad } from '@/lib/squadUtils';
import {
  simulateGroupMatch,
  simulateKnockoutMatch,
  simulateOtherGroupMatch,
  drawGroupOpponents,
  otherFixtureForMatchday,
  computeGroupTable,
  englandGroupPosition,
  pickKnockoutOpponent,
  thirdPlaceQualifies,
  groupPoints,
  GROUP_GAMES,
  GROUP_QUALIFY_SPOTS,
  getStageLabel,
  getNextStage,
  matchWon,
  type GroupTableRow,
} from '@/lib/worldCupEngine';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { SeasonReward } from '@/components/modes/SeasonReward';
import { cn } from '@/lib/ui';

type Phase = 'ready' | 'simulating' | 'group-match-result' | 'knockout-result' | 'won' | 'eliminated';

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
  const groupOpponents = useGameStore((s) => s.groupOpponents);
  const setGroupOpponents = useGameStore((s) => s.setGroupOpponents);
  const groupMatches = useGameStore((s) => s.groupMatches);
  const recordGroupMatch = useGameStore((s) => s.recordGroupMatch);
  const otherGroupMatches = useGameStore((s) => s.otherGroupMatches);
  const recordOtherGroupMatch = useGameStore((s) => s.recordOtherGroupMatch);
  const nextOpponent = useGameStore((s) => s.nextOpponent);
  const setNextOpponent = useGameStore((s) => s.setNextOpponent);
  const tournamentWon = useGameStore((s) => s.tournamentWon);
  const tournamentEliminated = useGameStore((s) => s.tournamentEliminated);
  const startTournament = useGameStore((s) => s.startTournament);
  const advanceStage = useGameStore((s) => s.advanceStage);
  const eliminateFromTournament = useGameStore((s) => s.eliminateFromTournament);
  const winTournament = useGameStore((s) => s.winTournament);
  const restartRun = useGameStore((s) => s.restartRun);
  const completions = useGameStore((s) => s.completions);
  const manager = useGameStore((s) => s.manager);

  const [phase, setPhase] = useState<Phase>(() => {
    if (tournamentWon) return 'won';
    if (tournamentEliminated) return 'eliminated';
    return 'ready';
  });

  const [latestGroupMatch, setLatestGroupMatch] = useState<MatchResult | null>(null);
  const [knockoutResult, setKnockoutResult] = useState<MatchResult | null>(null);
  /** Stage the result on screen belongs to — currentStage may have already advanced. */
  const [playedStage, setPlayedStage] = useState<TournamentStage>('group');
  const [showReward, setShowReward] = useState(false);

  // Draw the group before kick-off so the player can see it; backfill a missing
  // knockout opponent (e.g. saves from before opponents were pre-drawn).
  useEffect(() => {
    if (!hydrated || tournamentWon || tournamentEliminated) return;
    const inGroupPhase = currentStage === null || currentStage === 'group';
    if (inGroupPhase && groupOpponents.length < GROUP_GAMES) {
      setGroupOpponents(drawGroupOpponents());
    }
    if (currentStage && currentStage !== 'group' && !nextOpponent) {
      setNextOpponent(pickKnockoutOpponent(currentStage));
    }
  }, [hydrated, currentStage, groupOpponents.length, nextOpponent, tournamentWon, tournamentEliminated]); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = summariseSquad(squad, ownedCards);
  const stageToSimulate = currentStage ?? 'group';
  const groupGameNumber = Math.min(groupMatches.length + 1, GROUP_GAMES);
  const stageLabel =
    stageToSimulate === 'group'
      ? `Group Game ${groupGameNumber} of ${GROUP_GAMES}`
      : getStageLabel(stageToSimulate);

  const groupTable = computeGroupTable(groupOpponents, groupMatches, otherGroupMatches);

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
        let opponents = groupOpponents;
        if (opponents.length < GROUP_GAMES) {
          opponents = drawGroupOpponents();
          setGroupOpponents(opponents);
        }

        const matchday = groupMatches.length;
        const result = simulateGroupMatch(sum.rating, opponents[matchday]);
        recordGroupMatch(result);
        const [home, away] = otherFixtureForMatchday(opponents, matchday);
        const otherResult = simulateOtherGroupMatch(home, away);
        recordOtherGroupMatch(otherResult);
        setLatestGroupMatch(result);
        setPhase('group-match-result');

        const allMatches = [...groupMatches, result];
        if (allMatches.length >= GROUP_GAMES) {
          const finalTable = computeGroupTable(opponents, allMatches, [...otherGroupMatches, otherResult]);
          const position = englandGroupPosition(finalTable);
          const engRow = finalTable.find((r) => r.isEngland)!;
          // Top 2 go straight through; a 3rd-place finish can survive as one
          // of the 8 best thirds (ranked against the other 11 groups).
          const qualified =
            position <= GROUP_QUALIFY_SPOTS ||
            (position === 3 &&
              thirdPlaceQualifies({ pts: engRow.pts, gd: engRow.gf - engRow.ga, gf: engRow.gf }));
          if (qualified) {
            advanceStage('r32');
            setNextOpponent(pickKnockoutOpponent('r32'));
          } else {
            eliminateFromTournament();
            recordRun({ modeId: mode.id, success: false, reachedStage: 'group', squadRating: sum.rating, playedAt: Date.now() });
          }
        }
      } else {
        const opponent = nextOpponent ?? pickKnockoutOpponent(stage);
        const result = simulateKnockoutMatch(sum.rating, opponent);
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
          if (next && next !== 'group') setNextOpponent(pickKnockoutOpponent(next));
        }
      }
    }, 1600);
  }

  function continueToNext() {
    setLatestGroupMatch(null);
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
    setLatestGroupMatch(null);
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
        <p className="text-lg font-bold text-white/70">Simulating {stageLabel}…</p>
      </div>
    );
  }

  // ---------------------------------------------------------------- Group match result
  if (phase === 'group-match-result' && latestGroupMatch) {
    const m = latestGroupMatch;
    const won = m.englandGoals > m.opponentGoals;
    const drew = m.englandGoals === m.opponentGoals;
    const gameNumber = groupMatches.length; // already recorded
    const points = groupPoints(groupMatches);
    const groupOver = gameNumber >= GROUP_GAMES;
    const position = englandGroupPosition(groupTable);
    // The thirds ranking is rolled once at sim time — read the verdict from the
    // store rather than recomputing it.
    const qualified = groupOver && !tournamentEliminated;
    const eliminated = groupOver && tournamentEliminated;
    const viaThirdPlace = qualified && position > GROUP_QUALIFY_SPOTS;
    const matchdayOther = otherGroupMatches[gameNumber - 1];

    return (
      <div className="space-y-4">
        {/* Headline — match result mid-group, qualification verdict after game 3 */}
        {groupOver ? (
          <div className={cn(
            'rounded-2xl border-2 p-5 text-center',
            qualified ? 'border-emerald-400 bg-emerald-400/10' : 'border-red-400/50 bg-red-400/10',
          )}>
            <div className="text-5xl">{qualified ? '✅' : '❌'}</div>
            <h1 className="mt-2 text-2xl font-black">
              {qualified ? 'Qualified!' : 'Eliminated'}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {viaThirdPlace
                ? `Finished ${ordinal(position)} — squeezed through as one of the 8 best third-placed teams`
                : qualified
                  ? `Finished ${ordinal(position)} — through to the Round of 32`
                  : position === 3
                    ? `Finished 3rd — not among the 8 best third-placed teams`
                    : `Finished ${ordinal(position)} — out of the World Cup`}
            </p>
          </div>
        ) : (
          <div className={cn(
            'rounded-2xl border-2 p-5 text-center',
            won ? 'border-emerald-400 bg-emerald-400/10'
              : drew ? 'border-yellow-400/50 bg-yellow-400/10'
              : 'border-red-400/50 bg-red-400/10',
          )}>
            <div className="text-5xl">{won ? '🎉' : drew ? '🤝' : '😖'}</div>
            <h1 className="mt-2 text-2xl font-black">
              {won ? 'Victory!' : drew ? 'A Draw' : 'Defeat'}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Group Game {gameNumber} of {GROUP_GAMES} · {points} pt{points !== 1 ? 's' : ''} · {ordinal(position)} in the group
            </p>
          </div>
        )}

        {/* This matchday's results */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-white/40">
            Matchday {gameNumber}
          </div>
          <MatchCard match={m} />
          {matchdayOther && (
            <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-black/10 px-4 py-2 text-xs text-white/50">
              <span>{matchdayOther.home.flag} {matchdayOther.home.name}</span>
              <span className="font-black tabular-nums text-white/70">
                {matchdayOther.homeGoals} – {matchdayOther.awayGoals}
              </span>
              <span>{matchdayOther.away.name} {matchdayOther.away.flag}</span>
            </div>
          )}
        </div>

        {/* Live group table */}
        <GroupTable table={groupTable} />

        {/* Reward spin — campaign continues unless the group is lost */}
        {!eliminated && !showReward && (
          <Button size="lg" className="w-full" onClick={() => setShowReward(true)}>
            🎰 Spin for Reward
          </Button>
        )}

        {eliminated ? (
          <Button size="lg" variant="danger" className="w-full" onClick={restart}>
            Start Again
          </Button>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="flex-1" onClick={onGoToSquad}>Adjust Squad</Button>
            <Button className="flex-1" onClick={continueToNext}>
              {qualified ? 'Round of 32 →' : `Group Game ${gameNumber + 1} →`}
            </Button>
          </div>
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
          <MatchCard match={knockoutResult} />
        </div>

        {/* Next opponent teaser */}
        {won && !wasFinale && nextOpponent && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              Up next in the {nextStageName}
            </div>
            <div className="mt-1 flex items-center gap-2 text-lg font-black text-white">
              <span className="text-2xl">{nextOpponent.flag}</span>
              {nextOpponent.name}
            </div>
          </div>
        )}

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
  const inGroupPhase = stageToSimulate === 'group';

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
          {STAGE_ORDER.map((s) => {
            const isDone = completedStages.includes(s);
            const isCurrent = s === stageToSimulate;
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

      {/* England's group — visible from the moment it's drawn */}
      {inGroupPhase && groupOpponents.length === GROUP_GAMES && (
        <GroupTable
          table={groupTable}
          subtitle={
            groupMatches.length === 0
              ? `The draw is made — top ${GROUP_QUALIFY_SPOTS} qualify, 3rd might sneak in`
              : `Top ${GROUP_QUALIFY_SPOTS} qualify · 3rd might sneak in`
          }
        />
      )}

      {/* Next knockout opponent */}
      {!inGroupPhase && nextOpponent && (
        <div className="rounded-2xl border-2 border-white/15 bg-white/5 p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            {getStageLabel(stageToSimulate)} — Next Opponent
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{nextOpponent.flag}</span>
              <div>
                <div className="text-xl font-black text-white">{nextOpponent.name}</div>
                <div className="text-xs text-white/40">Team rating {nextOpponent.rating}</div>
              </div>
            </div>
            <span className={cn(
              'rounded-full px-3 py-1 text-xs font-black',
              nextOpponent.rating >= 88 ? 'bg-red-500/20 text-red-300'
                : nextOpponent.rating >= 81 ? 'bg-amber-500/20 text-amber-300'
                : 'bg-emerald-500/20 text-emerald-300',
            )}>
              {nextOpponent.rating >= 88 ? 'ELITE' : nextOpponent.rating >= 81 ? 'TOUGH' : 'WINNABLE'}
            </span>
          </div>
        </div>
      )}

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
            {manager && (
              <div className="text-xs text-white/40">{manager.name}&apos;s XI</div>
            )}
          </div>
        </div>
        <Button variant="secondary" onClick={onGoToSquad}>
          Edit Squad
        </Button>
      </div>

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

function GroupTable({ table, subtitle }: { table: GroupTableRow[]; subtitle?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-baseline justify-between px-4 pt-4 pb-2">
        <span className="text-[10px] uppercase tracking-widest text-white/40">
          England&apos;s Group
        </span>
        {subtitle && <span className="text-[10px] text-white/30">{subtitle}</span>}
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-[10px] uppercase text-white/30">
            <th className="px-3 py-1.5 text-left">#</th>
            <th className="px-3 py-1.5 text-left">Team</th>
            <th className="px-2 py-1.5 text-right">P</th>
            <th className="px-2 py-1.5 text-right">W</th>
            <th className="px-2 py-1.5 text-right">D</th>
            <th className="px-2 py-1.5 text-right">L</th>
            <th className="px-2 py-1.5 text-right">GD</th>
            <th className="px-3 py-1.5 text-right font-black">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => {
            const pos = i + 1;
            const qualifies = pos <= GROUP_QUALIFY_SPOTS;
            const gd = row.gf - row.ga;
            return (
              <tr
                key={row.name}
                className={cn(
                  'border-b border-white/5 text-xs last:border-0',
                  row.isEngland && 'bg-emerald-500/10',
                )}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      'h-3.5 w-1 shrink-0 rounded-full',
                      qualifies ? 'bg-emerald-400' : pos === 3 ? 'bg-amber-400/80' : 'bg-red-500/60',
                    )} />
                    <span className="tabular-nums text-white/40">{pos}</span>
                  </div>
                </td>
                <td className={cn('px-3 py-2 font-bold', row.isEngland ? 'text-emerald-300' : 'text-white')}>
                  <span className="mr-1.5">{row.flag}</span>
                  {row.name}
                </td>
                <td className="px-2 py-2 text-right tabular-nums text-white/70">{row.played}</td>
                <td className="px-2 py-2 text-right tabular-nums text-white/70">{row.won}</td>
                <td className="px-2 py-2 text-right tabular-nums text-white/70">{row.drawn}</td>
                <td className="px-2 py-2 text-right tabular-nums text-white/70">{row.lost}</td>
                <td className={cn(
                  'px-2 py-2 text-right tabular-nums',
                  gd > 0 ? 'text-emerald-400' : gd < 0 ? 'text-red-400' : 'text-white/40',
                )}>
                  {gd > 0 ? '+' : ''}{gd}
                </td>
                <td className={cn('px-3 py-2 text-right tabular-nums font-black', row.isEngland ? 'text-emerald-300' : 'text-white')}>
                  {row.pts}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MatchCard({ match }: { match: MatchResult }) {
  const won = match.englandGoals > match.opponentGoals || match.penaltiesWin === true;
  const lost = match.englandGoals < match.opponentGoals || match.penaltiesLoss === true;

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

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
