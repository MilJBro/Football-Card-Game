'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getMode } from '@/data/gameModes';
import type { Squad, SeasonResult, ModeRunResult } from '@/store/types';
import { emptySquad, summariseSquad } from '@/lib/squadUtils';
import { simulateSeason, evaluateWinCondition } from '@/lib/matchEngine';
import { seasonFinishReward } from '@/lib/coinRewards';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { SquadBuilder } from '@/components/squad/SquadBuilder';
import { Button } from '@/components/ui/Button';
import { cn, formatCoins } from '@/lib/ui';

type Phase = 'build' | 'sim' | 'result';

interface RunOutcome {
  season: SeasonResult;
  success: boolean;
  seasonReward: number;
  modeReward: number;
  total: number;
}

export function ModeRunner({ modeId }: { modeId: string }) {
  const hydrated = useHydrated();
  const mode = getMode(modeId);

  const addCoins = useGameStore((s) => s.addCoins);
  const recordRun = useGameStore((s) => s.recordRun);
  const completions = useGameStore((s) => s.completions);

  const [squad, setSquad] = useState<Squad>(() => emptySquad('4-3-3'));
  const [phase, setPhase] = useState<Phase>('build');
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);

  if (!mode) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/60">Unknown challenge.</p>
        <Link href="/modes" className="mt-4 inline-block text-emerald-400 underline">
          Back to challenges
        </Link>
      </div>
    );
  }

  const summary = summariseSquad(squad);

  function runSeason() {
    setPhase('sim');
    // Brief dramatic pause before revealing the result.
    setTimeout(() => {
      const sum = summariseSquad(squad);
      const season = simulateSeason(sum);
      const success = evaluateWinCondition(mode!, season);

      const isFirstClear = success && !completions[mode!.id];
      const modeReward = success
        ? isFirstClear
          ? mode!.firstReward
          : mode!.repeatReward
        : 0;
      const seasonReward = seasonFinishReward(season);
      const total = seasonReward + modeReward;

      addCoins(total, `Season: ${mode!.name}`);
      const runResult: ModeRunResult = {
        modeId: mode!.id,
        season,
        success,
        reward: total,
        squadRating: sum.rating,
        playedAt: Date.now(),
      };
      recordRun(runResult);

      setOutcome({ season, success, seasonReward, modeReward, total });
      setPhase('result');
    }, 1400);
  }

  // ---------------------------------------------------------------- Build
  if (phase === 'build') {
    return (
      <div className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <Link href="/modes" className="text-sm text-emerald-400 hover:underline">
              ← Challenges
            </Link>
            <h1 className="mt-1 text-3xl font-black">{mode.name}</h1>
            <p className="mt-1 max-w-xl text-white/60">{mode.description}</p>
          </div>
        </header>

        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 text-sm">
          <span className="font-bold text-yellow-300">Win condition: </span>
          {mode.winConditionText}.{' '}
          <span className="text-white/50">
            Recommended squad rating {mode.recommendedRating}.
          </span>
        </div>

        <SquadBuilder squad={squad} onChange={setSquad} />

        <div className="flex items-center justify-end gap-3">
          {!summary.isComplete && (
            <span className="text-sm text-white/50">Fill all 11 slots to play.</span>
          )}
          <Button
            size="lg"
            onClick={runSeason}
            disabled={!hydrated || !summary.isComplete}
          >
            Simulate Season
          </Button>
        </div>
      </div>
    );
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
  const o = outcome!;
  const s = o.season;
  return (
    <div className="space-y-6">
      <div
        className={cn(
          'rounded-2xl border-2 p-6 text-center',
          o.success
            ? 'border-emerald-400 bg-emerald-400/10'
            : 'border-orange-400/60 bg-orange-400/5'
        )}
      >
        <div className="text-5xl">{o.success ? '🏆' : '😔'}</div>
        <h1 className="mt-2 text-2xl font-black">
          {o.success ? 'Challenge Complete!' : 'Challenge Failed'}
        </h1>
        <p className="text-white/60">{mode.winConditionText}</p>
        <div className="mt-4 inline-block animate-coin-pop rounded-xl bg-yellow-400/15 px-5 py-3">
          <div className="text-2xl font-black text-yellow-300">+{formatCoins(o.total)} 🪙</div>
          <div className="text-xs text-white/50">
            Season finish {formatCoins(o.seasonReward)}
            {o.modeReward > 0 && ` · Challenge bonus ${formatCoins(o.modeReward)}`}
          </div>
        </div>
      </div>

      {/* Season summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-3 text-lg font-bold">Premier League</h2>
          <dl className="space-y-1.5 text-sm">
            <Row k="Final position" v={ordinal(s.leaguePosition)} highlight={s.wonLeague} />
            <Row k="Points" v={`${s.points}`} highlight={s.points >= 100} />
            <Row k="Record (W-D-L)" v={`${s.wins}-${s.draws}-${s.losses}`} />
            <Row k="Goals for / against" v={`${s.goalsFor} / ${s.goalsAgainst}`} highlight={s.goalsAgainst < 15} />
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
        <Button
          variant="secondary"
          onClick={() => {
            setOutcome(null);
            setPhase('build');
          }}
        >
          Try Again
        </Button>
        <Link href="/modes">
          <Button>Back to Challenges</Button>
        </Link>
      </div>
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
