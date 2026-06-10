'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameModeDef, Squad, SeasonResult, ModeRunResult } from '@/store/types';
import { summariseSquad } from '@/lib/squadUtils';
import { simulateSeason, evaluateWinCondition, generateLeagueTable } from '@/lib/matchEngine';
import type { LeagueTableRow } from '@/lib/matchEngine';
import { seasonFinishReward } from '@/lib/coinRewards';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { cn, formatCoins } from '@/lib/ui';

type Phase = 'ready' | 'sim' | 'result';

interface RunOutcome {
  season: SeasonResult;
  success: boolean;
  reward: number;
}

interface SimulationTabProps {
  mode: GameModeDef;
  squad: Squad;
  onGoToSquad: () => void;
  onGoToPacks: () => void;
  onGoToUpgrades: () => void;
}

function shortfallText(mode: GameModeDef, s: SeasonResult): string {
  switch (mode.id) {
    case 'domestic-double': {
      const missing = [!s.wonFaCup && 'FA Cup', !s.wonLeagueCup && 'League Cup'].filter(Boolean);
      return `Didn't win: ${missing.join(' or ')}`;
    }
    case 'european-glory':
      return 'Knocked out of the Champions League';
    case 'iron-defence': {
      const parts: string[] = [];
      if (s.goalsAgainst >= 15) parts.push(`Conceded ${s.goalsAgainst} goals — need fewer than 15`);
      if (!s.wonLeague) parts.push(`${s.points} pts — title not won`);
      return parts.join(' · ');
    }
    case 'centurions': {
      const parts: string[] = [];
      if (s.points < 100) parts.push(`${s.points} pts — need 100+`);
      if (!s.wonLeague) parts.push('Title not won');
      return parts.join(' · ');
    }
    case 'invincibles': {
      const parts: string[] = [];
      if (!s.unbeaten) parts.push(`${s.losses} defeat${s.losses !== 1 ? 's' : ''} — need to go unbeaten`);
      if (!s.wonLeague) parts.push('Title not won');
      return parts.join(' · ');
    }
    case 'quadruple': {
      const missing = [
        !s.wonLeague && 'Premier League',
        !s.wonFaCup && 'FA Cup',
        !s.wonLeagueCup && 'League Cup',
        !s.wonChampionsLeague && 'Champions League',
      ].filter(Boolean);
      return `Missed: ${missing.join(', ')}`;
    }
    default:
      return 'Challenge not completed this time';
  }
}

export function SimulationTab({ mode, squad, onGoToSquad, onGoToPacks, onGoToUpgrades }: SimulationTabProps) {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const addCoins = useGameStore((s) => s.addCoins);
  const spendCoins = useGameStore((s) => s.spendCoins);
  const recordRun = useGameStore((s) => s.recordRun);
  const ownedCards = useGameStore((s) => s.ownedCards);

  const [phase, setPhase] = useState<Phase>('ready');
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);

  const summary = summariseSquad(squad, ownedCards);
  const canAfford = coins >= mode.entryCost;

  function runSeason() {
    if (!spendCoins(mode.entryCost, `Entry fee: ${mode.name}`)) return;
    setPhase('sim');
    setTimeout(() => {
      const sum = summariseSquad(squad, ownedCards);
      const season = simulateSeason(sum, mode);
      const success = evaluateWinCondition(mode, season);

      const reward = seasonFinishReward(season);
      addCoins(reward, `Season payout: ${mode.name}`);

      const runResult: ModeRunResult = {
        modeId: mode.id,
        season,
        success,
        reward,
        entryCost: mode.entryCost,
        squadRating: sum.rating,
        playedAt: Date.now(),
      };
      recordRun(runResult);

      setOutcome({ season, success, reward });
      setPhase('result');
    }, 1400);
  }

  function tryAgain() {
    setOutcome(null);
    setPhase('ready');
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
    const net = o.reward - mode.entryCost;
    const gd = s.goalsFor - s.goalsAgainst;
    const table = generateLeagueTable(s);

    return (
      <div className="space-y-4">
        {/* Win / keep going header */}
        {o.success ? (
          <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-400/10 p-5 text-center">
            <div className="text-5xl">🏆</div>
            <h1 className="mt-2 text-2xl font-black">Challenge Complete!</h1>
            <p className="mt-1 text-sm text-white/60">{mode.winConditionText}</p>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-white/15 bg-white/5 p-5 text-center">
            <div className="text-5xl">💪</div>
            <h1 className="mt-2 text-2xl font-black">Keep Going</h1>
            <p className="mt-1 text-sm text-white/50">{shortfallText(mode, s)}</p>
            <p className="mt-3 text-xs text-white/30">
              Open more packs or upgrade your squad — then simulate again
            </p>
          </div>
        )}

        {/* Coin summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-white/40">Entry fee</div>
            <div className="mt-1 text-sm font-black text-red-400">−🪙 {formatCoins(mode.entryCost)}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wide text-white/40">Payout</div>
            <div className="mt-1 text-sm font-black text-emerald-300">+🪙 {formatCoins(o.reward)}</div>
          </div>
          <div className={cn(
            'rounded-xl border p-3 text-center',
            net >= 0 ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-red-400/30 bg-red-400/5',
          )}>
            <div className="text-[10px] uppercase tracking-wide text-white/40">Net</div>
            <div className={cn('mt-1 text-sm font-black', net >= 0 ? 'text-emerald-300' : 'text-red-400')}>
              {net >= 0 ? '+' : ''}🪙 {formatCoins(net)}
            </div>
          </div>
        </div>

        {/* League position hero */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-white/40">Season Stats</div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={cn('text-5xl font-black tabular-nums', s.wonLeague ? 'text-emerald-400' : 'text-white')}>
                {ordinal(s.leaguePosition)}
              </div>
              <div className="mt-0.5 text-[10px] text-white/40">Position</div>
            </div>
            <div className="flex flex-1 flex-wrap gap-x-5 gap-y-2">
              <Stat label="Pts" value={String(s.points)} highlight={s.wonLeague} />
              <Stat label="GD" value={(gd >= 0 ? '+' : '') + gd} highlight={gd > 0} />
              {s.unbeaten && (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-black text-emerald-300">
                  UNBEATEN
                </span>
              )}
            </div>
          </div>

          {/* W / D / L / GF / GA row */}
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            <StatBox label="W" value={s.wins} color="emerald" />
            <StatBox label="D" value={s.draws} color="yellow" />
            <StatBox label="L" value={s.losses} color="red" />
            <StatBox label="GF" value={s.goalsFor} color="white" />
            <StatBox label="GA" value={s.goalsAgainst} color="white" />
          </div>
        </div>

        {/* Trophy cabinet */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-white/40">Trophies</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { won: s.wonLeague, label: 'PL', emoji: '🏆' },
              { won: s.wonFaCup, label: 'FA Cup', emoji: '🏅' },
              { won: s.wonLeagueCup, label: 'EFL Cup', emoji: '🥈' },
              { won: s.wonChampionsLeague, label: 'UCL', emoji: '⭐' },
            ].map((t) => (
              <div
                key={t.label}
                className={cn(
                  'rounded-xl border p-3 text-center',
                  t.won
                    ? 'border-amber-400/40 bg-amber-400/10'
                    : 'border-white/5 bg-white/5 opacity-40',
                )}
              >
                <div className="text-2xl">{t.won ? t.emoji : '—'}</div>
                <div className="mt-1 text-[10px] font-bold text-white/60">{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* League table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="px-4 pt-4 pb-2 text-[10px] uppercase tracking-widest text-white/40">
            League Table
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase text-white/30">
                <th className="px-3 py-1.5 text-left">#</th>
                <th className="px-3 py-1.5 text-left">Team</th>
                <th className="px-3 py-1.5 text-right">W</th>
                <th className="px-3 py-1.5 text-right">D</th>
                <th className="px-3 py-1.5 text-right">L</th>
                <th className="px-3 py-1.5 text-right">GD</th>
                <th className="px-3 py-1.5 text-right font-black">Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <TableRow key={row.name} row={row} pos={i + 1} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        {o.success ? (
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" onClick={onGoToSquad}>Adjust Squad</Button>
            <Button onClick={tryAgain}>Simulate Again</Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={onGoToPacks}>Open Packs</Button>
            <Button onClick={onGoToUpgrades}>Upgrade Squad</Button>
            <Button variant="ghost" onClick={tryAgain}>Try Again</Button>
          </div>
        )}
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

      {/* Entry cost panel */}
      <div className={cn(
        'rounded-2xl border p-5',
        canAfford
          ? 'border-amber-400/20 bg-amber-400/5'
          : 'border-red-400/20 bg-red-400/5',
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-white/40">Entry Fee</div>
            <div className={cn('text-2xl font-black tabular-nums', canAfford ? 'text-amber-300' : 'text-red-400')}>
              🪙 {formatCoins(mode.entryCost)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-white/40">Your Coins</div>
            <div className={cn('text-2xl font-black tabular-nums', canAfford ? 'text-white' : 'text-red-400')}>
              🪙 {formatCoins(coins)}
            </div>
          </div>
        </div>
        {!canAfford && (
          <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-center text-sm">
            <p className="font-bold text-red-300">Not enough coins to enter</p>
            <p className="mt-1 text-xs text-white/50">
              Need 🪙 {formatCoins(mode.entryCost - coins)} more — sell cards to raise funds
            </p>
            <button
              onClick={onGoToUpgrades}
              className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
            >
              Sell Cards →
            </button>
          </div>
        )}
      </div>

      {summary.isComplete ? (
        <div className="flex justify-center">
          <Button size="lg" onClick={runSeason} disabled={!hydrated || !canAfford}>
            Simulate Season · 🪙 {formatCoins(mode.entryCost)}
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

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className={cn('text-xl font-black tabular-nums', highlight ? 'text-emerald-300' : 'text-white')}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: 'emerald' | 'yellow' | 'red' | 'white' }) {
  const textColor = {
    emerald: 'text-emerald-300',
    yellow: 'text-yellow-300',
    red: 'text-red-400',
    white: 'text-white',
  }[color];
  return (
    <div className="rounded-xl bg-black/20 py-2 text-center">
      <div className={cn('text-lg font-black tabular-nums', textColor)}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
    </div>
  );
}

function TableRow({ row, pos }: { row: LeagueTableRow; pos: number }) {
  const gd = row.gf - row.ga;
  const isTop4 = pos <= 4;
  const isEuropa = pos === 5;
  const isRelegation = pos >= 18;

  return (
    <tr className={cn('border-b border-white/5 text-xs last:border-0', row.isUser && 'bg-emerald-500/10')}>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'h-3.5 w-1 shrink-0 rounded-full',
              isTop4 ? 'bg-blue-400' : isEuropa ? 'bg-amber-400' : isRelegation ? 'bg-red-500' : 'bg-transparent',
            )}
          />
          <span className="tabular-nums text-white/40">{pos}</span>
        </div>
      </td>
      <td className={cn('px-3 py-2 font-bold', row.isUser ? 'text-emerald-300' : 'text-white')}>
        {row.name}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-white/70">{row.won}</td>
      <td className="px-3 py-2 text-right tabular-nums text-white/70">{row.drawn}</td>
      <td className="px-3 py-2 text-right tabular-nums text-white/70">{row.lost}</td>
      <td className={cn(
        'px-3 py-2 text-right tabular-nums',
        gd > 0 ? 'text-emerald-400' : gd < 0 ? 'text-red-400' : 'text-white/40',
      )}>
        {gd > 0 ? '+' : ''}{gd}
      </td>
      <td className={cn('px-3 py-2 text-right tabular-nums font-black', row.isUser ? 'text-emerald-300' : 'text-white')}>
        {row.points}
      </td>
    </tr>
  );
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
