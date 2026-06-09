'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameModeDef, Squad, SeasonResult, ModeRunResult } from '@/store/types';
import { summariseSquad } from '@/lib/squadUtils';
import { simulateSeason, evaluateWinCondition } from '@/lib/matchEngine';
import { seasonFinishReward } from '@/lib/coinRewards';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/ui';

type Phase = 'ready' | 'sim' | 'result';

interface RunOutcome {
  season: SeasonResult;
  success: boolean;
}

interface SimulationTabProps {
  mode: GameModeDef;
  squad: Squad;
  onGoToSquad: () => void;
}

export function SimulationTab({ mode, squad, onGoToSquad }: SimulationTabProps) {
  const hydrated = useHydrated();
  const addCoins = useGameStore((s) => s.addCoins);
  const recordRun = useGameStore((s) => s.recordRun);

  const [phase, setPhase] = useState<Phase>('ready');
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);

  const summary = summariseSquad(squad);

  function runSeason() {
    setPhase('sim');
    setTimeout(() => {
      const sum = summariseSquad(squad);
      const season = simulateSeason(sum, mode);
      const success = evaluateWinCondition(mode, season);

      const reward = seasonFinishReward(season);
      addCoins(reward, `Season: ${mode.name}`);

      const runResult: ModeRunResult = {
        modeId: mode.id,
        season,
        success,
        reward,
        squadRating: sum.rating,
        playedAt: Date.now(),
      };
      recordRun(runResult);

      setOutcome({ season, success });
      setPhase('result');
    }, 1400);
  }

  // ---------------------------------------------------------------- Simulating
  if (phase === 'sim') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-32 text-center">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          ⚽
        </motion.div>
        <p className="text-lg font-bold text-white/70">Simulating the season…</p>
      </div>
    );
  }

  // ---------------------------------------------------------------- Result
  if (phase === 'result' && outcome) {
    const o = outcome;
    const s = o.season;
    return (
      <div className="space-y-6">
        <div
          className={cn(
            'rounded-2xl border-2 p-6 text-center',
            o.success ? 'border-emerald-400 bg-emerald-400/10' : 'border-orange-400/60 bg-orange-400/5'
          )}
        >
          <div className="text-5xl">{o.success ? '🏆' : '😔'}</div>
          <h1 className="mt-2 text-2xl font-black">
            {o.success ? 'Challenge Complete!' : 'Challenge Failed'}
          </h1>
          <p className="mt-1 text-white/60">{mode.winConditionText}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-3 text-lg font-bold">Premier League</h2>
            <dl className="space-y-1.5 text-sm">
              <Row k="Final position" v={ordinal(s.leaguePosition)} highlight={s.wonLeague} />
              <Row k="Points" v={`${s.points}`} highlight={s.points >= 100} />
              <Row k="Record (W-D-L)" v={`${s.wins}-${s.draws}-${s.losses}`} />
              <Row
                k="Goals for / against"
                v={`${s.goalsFor} / ${s.goalsAgainst}`}
                highlight={s.goalsAgainst < 15}
              />
              <Row k="Unbeaten" v={s.unbeaten ? 'Yes' : 'No'} highlight={s.unbeaten} />
            </dl>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-3 text-lg font-bold">Trophies</h2>
            <ul className="space-y-1.5 text-sm">
              <Trophy won={s.wonLeague} name="Premier League" />
              <Trophy won={s.wonFaCup} name="FA Cup" />
              <Trophy won={s.wonLeagueCup} name="League Cup" />
              <Trophy won={s.wonChampionsLeague} name="Champions League" />
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={onGoToSquad}>
            Adjust Squad
          </Button>
          <Button
            onClick={() => {
              setOutcome(null);
              setPhase('ready');
            }}
          >
            Simulate Again
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- Ready
  const ratingColor =
    summary.rating >= 85
      ? 'text-emerald-300'
      : summary.rating >= 75
        ? 'text-yellow-300'
        : 'text-orange-300';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black">{mode.name}</h1>
        <p className="mt-1 text-white/60">{mode.description}</p>
      </header>

      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm">
        <span className="font-bold text-emerald-300">Win condition: </span>
        {mode.winConditionText}.
        <div className="mt-2 text-white/50">
          <span className="font-bold text-white/70">Tip: </span>
          {mode.focus}
        </div>
      </div>

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

      {summary.isComplete ? (
        <div className="flex justify-center">
          <Button size="lg" onClick={runSeason} disabled={!hydrated}>
            Simulate Season
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

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-white/50">{k}</dt>
      <dd className={cn('font-bold tabular-nums', highlight ? 'text-emerald-300' : 'text-white')}>
        {v}
      </dd>
    </div>
  );
}

function Trophy({ won, name }: { won: boolean; name: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className={won ? 'text-white' : 'text-white/40'}>{name}</span>
      <span>{won ? '🏆' : '—'}</span>
    </li>
  );
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
