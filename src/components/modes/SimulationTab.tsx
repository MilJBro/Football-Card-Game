'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { GameModeDef, Squad, TournamentStage, MatchResult } from '@/store/types';
import { summariseSquad, computeBonuses } from '@/lib/squadUtils';
import {
  simulateGroupMatch,
  simulateKnockoutMatch,
  simulateOtherGroupMatch,
  drawGroupOpponents,
  drawRealisticGroup,
  getGroupByYear,
  otherFixtureForMatchday,
  computeGroupTable,
  englandGroupPosition,
  pickKnockoutOpponent,
  thirdPlaceQualifies,
  groupPoints,
  simulateRunConclusion,
  GROUP_GAMES,
  GROUP_QUALIFY_SPOTS,
  getStageLabel,
  getNextStage,
  matchWon,
  type GroupTableRow,
  type RunConclusion,
  type NeutralResult,
} from '@/lib/worldCupEngine';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/ui';

type Phase = 'ready' | 'simulating' | 'group-match-result' | 'knockout-result' | 'won' | 'eliminated' | 'how-it-ended';

const STAGE_ORDER: TournamentStage[] = ['group', 'r32', 'r16', 'qf', 'sf', 'final'];

interface SimulationTabProps {
  mode: GameModeDef;
  squad: Squad;
  onGoToSquad?: () => void;
}

export function SimulationTab({ mode, squad, onGoToSquad }: SimulationTabProps) {
  const hydrated = useHydrated();
  const ownedCards = useGameStore((s) => s.ownedCards);
  const recordRun = useGameStore((s) => s.recordRun);
  const currentStage = useGameStore((s) => s.currentStage);
  const groupOpponents = useGameStore((s) => s.groupOpponents);
  const groupLabel = useGameStore((s) => s.groupLabel);
  const setGroupOpponents = useGameStore((s) => s.setGroupOpponents);
  const realisticGroupsYear = useGameStore((s) => s.realisticGroupsYear);
  const tournamentFormat = useGameStore((s) => s.tournamentFormat);
  const groupMatches = useGameStore((s) => s.groupMatches);
  const recordGroupMatch = useGameStore((s) => s.recordGroupMatch);
  const otherGroupMatches = useGameStore((s) => s.otherGroupMatches);
  const recordOtherGroupMatch = useGameStore((s) => s.recordOtherGroupMatch);
  const knockoutMatches = useGameStore((s) => s.knockoutMatches);
  const recordKnockoutMatch = useGameStore((s) => s.recordKnockoutMatch);
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
  const [recap, setRecap] = useState<RunConclusion | null>(null);
  const [goalTimeline, setGoalTimeline] = useState<Array<'england' | 'opponent'>>([]);
  const [shownGoals, setShownGoals] = useState(0);
  const [feedDone, setFeedDone] = useState(true);

  // Draw the group before kick-off so the player can see it; backfill a missing
  // knockout opponent (e.g. saves from before opponents were pre-drawn).
  useEffect(() => {
    if (!hydrated || tournamentWon || tournamentEliminated) return;
    const inGroupPhase = currentStage === null || currentStage === 'group';
    if (inGroupPhase && groupOpponents.length < GROUP_GAMES) {
      if (realisticGroupsYear !== null) {
        const g = getGroupByYear(realisticGroupsYear) ?? drawRealisticGroup();
        setGroupOpponents(g.opponents, g.label);
      } else {
        setGroupOpponents(drawGroupOpponents(), null);
      }
    }
    if (currentStage && currentStage !== 'group' && !nextOpponent) {
      setNextOpponent(pickKnockoutOpponent(currentStage));
    }
  }, [hydrated, currentStage, groupOpponents.length, nextOpponent, tournamentWon, tournamentEliminated, realisticGroupsYear]); // eslint-disable-line react-hooks/exhaustive-deps

  // Kick off goal feed when knockoutResult changes
  useEffect(() => {
    if (!knockoutResult) return;
    const events: Array<'england' | 'opponent'> = [
      ...Array(knockoutResult.englandGoals).fill('england' as const),
      ...Array(knockoutResult.opponentGoals).fill('opponent' as const),
    ];
    for (let i = events.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [events[i], events[j]] = [events[j], events[i]];
    }
    setGoalTimeline(events);
    setShownGoals(0);
    setFeedDone(events.length === 0);
  }, [knockoutResult]);

  // Tick through goals
  useEffect(() => {
    if (feedDone) return;
    if (shownGoals >= goalTimeline.length) {
      const t = setTimeout(() => setFeedDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShownGoals((n) => n + 1), 900);
    return () => clearTimeout(t);
  }, [shownGoals, goalTimeline.length, feedDone]);

  const summary = summariseSquad(squad, ownedCards);
  const bonuses = computeBonuses(squad, ownedCards, manager ?? null);
  const totalBonus = bonuses.chemistryBonus + bonuses.managerFitBonus;
  const effectiveAttack = summary.attackRating + totalBonus;
  const effectiveDefense = summary.defenceRating + totalBonus;
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

    setTimeout(() => {
      const sum = summariseSquad(squad, ownedCards);
      const b = computeBonuses(squad, ownedCards, manager ?? null);
      const totalB = b.chemistryBonus + b.managerFitBonus;
      const effAtk = sum.attackRating + totalB;
      const effDef = sum.defenceRating + totalB;
      const stage = isFirst ? 'group' : (currentStage ?? 'group');
      setPlayedStage(stage);

      if (stage === 'group') {
        let opponents = groupOpponents;
        if (opponents.length < GROUP_GAMES) {
          if (realisticGroupsYear !== null) {
            const g = getGroupByYear(realisticGroupsYear) ?? drawRealisticGroup();
            opponents = g.opponents;
            setGroupOpponents(opponents, g.label);
          } else {
            opponents = drawGroupOpponents();
            setGroupOpponents(opponents, null);
          }
        }

        const matchday = groupMatches.length;
        const result = simulateGroupMatch(effAtk, effDef, opponents[matchday]);
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
          // 32-team format: only top 2 qualify, go straight to R16.
          // 48-team format: top 2 go through + 3rd-place can survive as one
          // of the 8 best thirds (ranked against the other 11 groups).
          const qualified = tournamentFormat === '32'
            ? position <= GROUP_QUALIFY_SPOTS
            : position <= GROUP_QUALIFY_SPOTS ||
              (position === 3 &&
                thirdPlaceQualifies({ pts: engRow.pts, gd: engRow.gf - engRow.ga, gf: engRow.gf }));
          const firstKnockout = tournamentFormat === '32' ? 'r16' : 'r32';
          if (qualified) {
            advanceStage(firstKnockout);
            setNextOpponent(pickKnockoutOpponent(firstKnockout));
          } else {
            eliminateFromTournament();
            recordRun({ modeId: mode.id, success: false, reachedStage: 'group', squadRating: sum.rating, playedAt: Date.now(), managerName: manager?.name });
          }
        }
      } else {
        const opponent = nextOpponent ?? pickKnockoutOpponent(stage);
        const result = simulateKnockoutMatch(effAtk, effDef, opponent);
        recordKnockoutMatch(stage, result);
        setKnockoutResult(result);
        setPhase('knockout-result');

        if (!matchWon(result)) {
          eliminateFromTournament();
          recordRun({ modeId: mode.id, success: false, reachedStage: stage, squadRating: sum.rating, playedAt: Date.now(), managerName: manager?.name });
        } else if (stage === 'final') {
          winTournament();
          recordRun({ modeId: mode.id, success: true, reachedStage: 'won', squadRating: sum.rating, playedAt: Date.now(), managerName: manager?.name });
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
      <div className="space-y-3">
        {/* Headline + score in one card */}
        <div className={cn(
          'rounded-2xl border-2 p-4 text-center',
          groupOver
            ? (qualified ? 'border-emerald-400 bg-emerald-400/10' : 'border-red-400/50 bg-red-400/10')
            : won ? 'border-emerald-400 bg-emerald-400/10'
              : drew ? 'border-yellow-400/50 bg-yellow-400/10'
              : 'border-red-400/50 bg-red-400/10',
        )}>
          <h1 className="text-xl font-black">
            {groupOver
              ? (qualified ? 'Qualified!' : 'Eliminated')
              : won ? 'Victory!' : drew ? 'A Draw' : 'Defeat'}
          </h1>
          <p className="mt-0.5 text-xs text-white/60">
            {groupOver
              ? (viaThirdPlace
                  ? `Finished ${ordinal(position)} — through as one of the 8 best 3rd-placed teams`
                  : qualified
                    ? `Finished ${ordinal(position)} — through to the ${tournamentFormat === '32' ? 'Round of 16' : 'Round of 32'}`
                    : position === 3
                      ? `Finished 3rd — not among the 8 best 3rd-placed teams`
                      : `Finished ${ordinal(position)} — out of the World Cup`)
              : `Game ${gameNumber} of ${GROUP_GAMES} · ${points} pt${points !== 1 ? 's' : ''} · ${ordinal(position)} in the group`}
          </p>
          <div className="mt-2.5">
            <MatchCard match={m} />
          </div>
          {matchdayOther && (
            <div className="mt-1.5 flex items-center justify-center gap-2 text-[11px] text-white/40">
              <span>{matchdayOther.home.flag} {matchdayOther.home.name}</span>
              <span className="font-black tabular-nums text-white/60">
                {matchdayOther.homeGoals} – {matchdayOther.awayGoals}
              </span>
              <span>{matchdayOther.away.name} {matchdayOther.away.flag}</span>
            </div>
          )}
        </div>

        {/* Live group table */}
        <GroupTable table={groupTable} label={groupLabel} />

        {/* Next fixture teaser */}
        {!groupOver && groupOpponents[gameNumber] && (
          <NextOpponentCard
            title={`Next Fixture — Group Game ${gameNumber + 1}`}
            opponent={groupOpponents[gameNumber]}
          />
        )}
        {qualified && nextOpponent && (
          <NextOpponentCard title={`Up Next — ${tournamentFormat === '32' ? 'Round of 16' : 'Round of 32'}`} opponent={nextOpponent} />
        )}

        {eliminated ? (
          <div className="space-y-2">
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => {
                setRecap(simulateRunConclusion(null, 'group'));
                setPhase('how-it-ended');
              }}
            >
              See How It Ended →
            </Button>
            <Button size="lg" variant="danger" className="w-full" onClick={restart}>
              Start Again
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={continueToNext}>
            {qualified ? `${tournamentFormat === '32' ? 'Round of 16' : 'Round of 32'} →` : `Group Game ${gameNumber + 1} →`}
          </Button>
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

    // Compute visible score from feed position
    const displayEngGoals = goalTimeline.slice(0, shownGoals).filter((e) => e === 'england').length;
    const displayOppGoals = goalTimeline.slice(0, shownGoals).filter((e) => e === 'opponent').length;
    const lastGoalTeam = shownGoals > 0 ? goalTimeline[shownGoals - 1] : null;

    if (!feedDone) {
      return (
        <div className="space-y-3">
          <div className="rounded-2xl border-2 border-white/15 bg-white/5 px-6 py-8 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <span>Live · {getStageLabel(playedStage)}</span>
            </div>
            <div className="mt-6 flex items-center justify-around gap-2">
              <div className="text-center">
                <div className="text-3xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                <div className="mt-1 text-[11px] font-bold text-white">England</div>
              </div>
              <motion.div
                key={`${displayEngGoals}-${displayOppGoals}`}
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-6xl font-black tabular-nums text-white"
              >
                {displayEngGoals} – {displayOppGoals}
              </motion.div>
              <div className="text-center">
                <div className="text-3xl">{knockoutResult.opponent.flag}</div>
                <div className="mt-1 text-[11px] font-bold text-white">{knockoutResult.opponent.name}</div>
              </div>
            </div>
            <div className="mt-5 h-5">
              {lastGoalTeam && (
                <motion.p
                  key={shownGoals}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -6 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={cn(
                    'text-sm font-black',
                    lastGoalTeam === 'england' ? 'text-emerald-300' : 'text-red-400',
                  )}
                >
                  GOAL! {lastGoalTeam === 'england' ? 'England' : knockoutResult.opponent.name}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className={cn(
          'rounded-2xl border-2 p-4 text-center',
          won && wasFinale ? 'border-amber-400 bg-amber-400/10'
            : won ? 'border-emerald-400 bg-emerald-400/10'
            : 'border-red-400/50 bg-red-400/10',
        )}>
          <h1 className="text-xl font-black">
            {won && wasFinale ? 'World Champions!' : won ? `${getStageLabel(playedStage)} — Won!` : 'Eliminated'}
          </h1>
          <p className="mt-0.5 text-xs text-white/60">
            {won && wasFinale
              ? 'England are World Cup winners — incredible!'
              : won
                ? getStageLabel(playedStage)
                : 'England are out of the World Cup'}
          </p>
          <div className="mt-2.5">
            <MatchCard match={knockoutResult} />
          </div>
        </div>

        {/* Next opponent teaser */}
        {won && !wasFinale && nextOpponent && (
          <NextOpponentCard title={`Up Next — ${nextStageName}`} opponent={nextOpponent} />
        )}

        {won ? (
          wasFinale ? (
            <Button size="lg" className="w-full" onClick={restart}>
              Play Again
            </Button>
          ) : (
            <Button className="w-full" onClick={continueToNext}>{nextStageName} →</Button>
          )
        ) : (
          <div className="space-y-2">
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => {
                setRecap(simulateRunConclusion(knockoutResult.opponent, playedStage));
                setPhase('how-it-ended');
              }}
            >
              See How It Ended →
            </Button>
            <Button size="lg" variant="danger" className="w-full" onClick={restart}>
              Start Again
            </Button>
          </div>
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
      <div className="space-y-3">
        <div className="rounded-2xl border-2 border-red-400/50 bg-red-400/10 p-6 text-center">
          <h1 className="text-2xl font-black">England are Out</h1>
          <p className="mt-2 text-sm text-white/50">
            This squad&apos;s World Cup journey is over.
          </p>
        </div>
        <Button
          size="lg"
          className="w-full"
          variant="secondary"
          onClick={() => {
            const lastKo = knockoutMatches[knockoutMatches.length - 1];
            setRecap(
              lastKo
                ? simulateRunConclusion(lastKo.match.opponent, lastKo.stage)
                : simulateRunConclusion(null, 'group'),
            );
            setPhase('how-it-ended');
          }}
        >
          See How It Ended →
        </Button>
        <Button size="lg" variant="danger" className="w-full" onClick={restart}>
          Start Again
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------- How it ended
  if (phase === 'how-it-ended' && recap) {
    const { conclusion, champion } = recap;
    const eliminator = knockoutMatches[knockoutMatches.length - 1]?.match.opponent ?? null;
    const englandWonFinal = champion.name === 'England';

    return (
      <div className="space-y-3">
        {/* England's actual run */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-white/40">England&apos;s Run</p>

          {groupMatches.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/30">Group Stage</p>
              {groupMatches.map((m, i) => <MatchCard key={`g${i}`} match={m} />)}
            </div>
          )}

          {knockoutMatches.map(({ stage, match }, i) => (
            <div key={`k${i}`} className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/30">
                {getStageLabel(stage)}
              </p>
              <MatchCard match={match} />
            </div>
          ))}
        </div>

        {/* What happened after England went out */}
        {conclusion.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-3 text-[10px] uppercase tracking-widest text-white/40">
              {eliminator ? `After England went out` : `How the rest unfolded`}
            </p>
            {conclusion.map(({ stage, result }, i) => {
              const showHeader = i === 0 || conclusion[i - 1].stage !== stage;
              return (
                <div key={i} className="space-y-2">
                  {showHeader && (
                    <p className={cn(
                      'text-[10px] font-bold uppercase tracking-wide text-white/30',
                      i > 0 && 'mt-3',
                    )}>
                      {getStageLabel(stage)}
                    </p>
                  )}
                  <NeutralMatchRow result={result} />
                </div>
              );
            })}
          </div>
        )}

        {/* Champion */}
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-400/10 p-5 text-center">
          <div className="text-5xl">{champion.flag}</div>
          <p className="mt-2 text-xl font-black text-amber-300">{champion.name}</p>
          <p className="mt-1 text-sm text-white/50">
            {englandWonFinal
              ? 'are the 2026 World Champions'
              : eliminator && champion.name === eliminator.name
                ? 'beat England, then went all the way'
                : 'are the 2026 World Champions'}
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
    <div className="space-y-3">
      {/* Tournament progress */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
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
          label={groupLabel}
          subtitle={
            groupMatches.length === 0
              ? `The draw is made — top ${GROUP_QUALIFY_SPOTS} qualify, 3rd might sneak in`
              : `Top ${GROUP_QUALIFY_SPOTS} qualify · 3rd might sneak in`
          }
        />
      )}

      {/* Next fixture — group opponent in order, or the pre-drawn knockout opponent */}
      {inGroupPhase && groupMatches.length < GROUP_GAMES && groupOpponents[groupMatches.length] && (
        <NextOpponentCard
          title={`Next Fixture — Group Game ${groupGameNumber}`}
          opponent={groupOpponents[groupMatches.length]}
        />
      )}
      {!inGroupPhase && nextOpponent && (
        <NextOpponentCard
          title={`${getStageLabel(stageToSimulate)} — Next Opponent`}
          opponent={nextOpponent}
        />
      )}

      {/* Squad stats & bonuses */}
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 space-y-2.5">
        <div className="flex items-center gap-4">
          <div className="shrink-0 text-center">
            <div className="text-[9px] uppercase tracking-widest text-white/40">Rating</div>
            <div className={cn('text-3xl font-black tabular-nums leading-none mt-0.5', ratingColor)}>
              {summary.rating || '—'}
            </div>
          </div>
          <div className="h-10 w-px bg-white/10 shrink-0" />
          <div className="flex flex-1 justify-around text-center">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-white/40">Attack</div>
              <div className="text-lg font-black tabular-nums text-pl-pink mt-0.5">
                {effectiveAttack || '—'}
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-white/40">Defence</div>
              <div className="text-lg font-black tabular-nums text-pl-cyan mt-0.5">
                {effectiveDefense || '—'}
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-white/40">
          {summary.filledSlots}/{summary.totalSlots} players · {squad.formation}
          {manager && <span> · {manager.name}&apos;s XI</span>}
        </div>
        {summary.filledSlots > 0 && (
          <div className="space-y-1 border-t border-white/10 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40">
                Era chemistry{bonuses.dominantEra ? ` · ${bonuses.dominantEra}: ${bonuses.dominantEraCount}/11` : ''}
              </span>
              <span className={cn('text-[10px] font-black', bonuses.chemistryBonus > 0 ? 'text-emerald-300' : 'text-white/25')}>
                {bonuses.chemistryBonus > 0 ? `+${bonuses.chemistryBonus}` : '+0'}
              </span>
            </div>
            {manager && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40">
                  Manager fit · {bonuses.managerFitCount}/11 match {manager.name}&apos;s era
                </span>
                <span className={cn('text-[10px] font-black', bonuses.managerFitBonus > 0 ? 'text-amber-300' : 'text-white/25')}>
                  {bonuses.managerFitBonus > 0 ? `+${bonuses.managerFitBonus}` : '+0'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {summary.isComplete ? (
        <Button size="lg" className="w-full" onClick={simulate} disabled={!hydrated}>
          {isFirstSim ? '🌍 Start the World Cup' : `⚽ Simulate ${stageLabel}`}
        </Button>
      ) : (
        <div className="space-y-2">
          <Button
            size="lg"
            className="w-full"
            onClick={onGoToSquad}
            disabled={!onGoToSquad}
          >
            Select Your 11
          </Button>
          <p className="text-center text-xs text-white/40">
            {summary.filledSlots}/{summary.totalSlots} players selected — fill all slots to start
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NextOpponentCard({ title, opponent }: { title: string; opponent: { name: string; flag: string; rating: number } }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
      <div>
        <div className="text-[9px] uppercase tracking-widest text-white/40">{title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-base font-black text-white">
          <span className="text-2xl">{opponent.flag}</span>
          {opponent.name}
        </div>
      </div>
      <span className={cn(
        'rounded-full px-3 py-1 text-[10px] font-black',
        opponent.rating >= 88 ? 'bg-red-500/20 text-red-300'
          : opponent.rating >= 81 ? 'bg-amber-500/20 text-amber-300'
          : 'bg-emerald-500/20 text-emerald-300',
      )}>
        {opponent.rating >= 88 ? 'ELITE' : opponent.rating >= 81 ? 'TOUGH' : 'WINNABLE'}
      </span>
    </div>
  );
}

function GroupTable({ table, subtitle, label }: { table: GroupTableRow[]; subtitle?: string; label?: string | null }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-baseline justify-between px-3 pt-2.5 pb-1.5">
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40">
          England&apos;s Group
          {label && (
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black tracking-normal text-emerald-300">
              {label}
            </span>
          )}
        </span>
        {subtitle && <span className="text-[10px] text-white/30">{subtitle}</span>}
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-[10px] uppercase text-white/30">
            <th className="px-2.5 py-1 text-left">#</th>
            <th className="px-2.5 py-1 text-left">Team</th>
            <th className="px-1.5 py-1 text-right">P</th>
            <th className="px-1.5 py-1 text-right">W</th>
            <th className="px-1.5 py-1 text-right">D</th>
            <th className="px-1.5 py-1 text-right">L</th>
            <th className="px-1.5 py-1 text-right">GF</th>
            <th className="px-1.5 py-1 text-right">GA</th>
            <th className="px-1.5 py-1 text-right">GD</th>
            <th className="px-2.5 py-1 text-right font-black">Pts</th>
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
                <td className="px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      'h-3.5 w-1 shrink-0 rounded-full',
                      qualifies ? 'bg-emerald-400' : pos === 3 ? 'bg-amber-400/80' : 'bg-red-500/60',
                    )} />
                    <span className="tabular-nums text-white/40">{pos}</span>
                  </div>
                </td>
                <td className={cn('px-2.5 py-1.5 font-bold', row.isEngland ? 'text-emerald-300' : 'text-white')}>
                  <span className="mr-1.5">{row.flag}</span>
                  {row.name}
                </td>
                <td className="px-1.5 py-1.5 text-right tabular-nums text-white/70">{row.played}</td>
                <td className="px-1.5 py-1.5 text-right tabular-nums text-white/70">{row.won}</td>
                <td className="px-1.5 py-1.5 text-right tabular-nums text-white/70">{row.drawn}</td>
                <td className="px-1.5 py-1.5 text-right tabular-nums text-white/70">{row.lost}</td>
                <td className="px-1.5 py-1.5 text-right tabular-nums text-white/70">{row.gf}</td>
                <td className="px-1.5 py-1.5 text-right tabular-nums text-white/70">{row.ga}</td>
                <td className={cn(
                  'px-1.5 py-1.5 text-right tabular-nums',
                  gd > 0 ? 'text-emerald-400' : gd < 0 ? 'text-red-400' : 'text-white/40',
                )}>
                  {gd > 0 ? '+' : ''}{gd}
                </td>
                <td className={cn('px-2.5 py-1.5 text-right tabular-nums font-black', row.isEngland ? 'text-emerald-300' : 'text-white')}>
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
              {match.englandPens}–{match.opponentPens} pens
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

function NeutralMatchRow({ result }: { result: NeutralResult }) {
  const homeWon = result.homeGoals > result.awayGoals || result.pens === 'home';
  return (
    <div className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2 text-sm">
      <span className={cn('flex-1 text-right font-bold', homeWon ? 'text-white' : 'text-white/40')}>
        {result.home.flag} {result.home.name}
      </span>
      <div className="shrink-0 text-center">
        <div className="font-black tabular-nums text-white">
          {result.homeGoals} – {result.awayGoals}
        </div>
        {result.pens && (
          <div className="text-[9px] font-normal text-white/40">
            {result.homePens}–{result.awayPens} pens
          </div>
        )}
      </div>
      <span className={cn('flex-1 font-bold', !homeWon ? 'text-white' : 'text-white/40')}>
        {result.away.flag} {result.away.name}
      </span>
    </div>
  );
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
