import type { Nation, MatchResult, TournamentStage } from '@/store/types';

// ============================================================================
// World Cup match simulation — Poisson-based goal engine.
// Squad rating vs opponent rating drives expected goals per match.
// ============================================================================

const GOAL_BASE = 1.3;
const RATING_SCALE = 0.025; // goals per rating-point advantage

function poisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

function expectedGoals(englandRating: number, opponentRating: number) {
  const diff = englandRating - opponentRating;
  return {
    englandLambda: Math.max(0.3, GOAL_BASE + diff * RATING_SCALE),
    opponentLambda: Math.max(0.3, GOAL_BASE - diff * RATING_SCALE),
  };
}

// ---------------------------------------------------------------------------
// Nation pools by stage
// ---------------------------------------------------------------------------

const GROUP_NATIONS: Nation[] = [
  { name: 'Iran',        flag: '🇮🇷', rating: 70 },
  { name: 'Australia',   flag: '🇦🇺', rating: 71 },
  { name: 'Qatar',       flag: '🇶🇦', rating: 70 },
  { name: 'Canada',      flag: '🇨🇦', rating: 73 },
  { name: 'USA',         flag: '🇺🇸', rating: 73 },
  { name: 'Ecuador',     flag: '🇪🇨', rating: 74 },
  { name: 'Japan',       flag: '🇯🇵', rating: 76 },
  { name: 'Senegal',     flag: '🇸🇳', rating: 76 },
  { name: 'Wales',       flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', rating: 77 },
  { name: 'Morocco',     flag: '🇲🇦', rating: 77 },
  { name: 'Poland',      flag: '🇵🇱', rating: 77 },
  { name: 'Mexico',      flag: '🇲🇽', rating: 78 },
  { name: 'Serbia',      flag: '🇷🇸', rating: 79 },
  { name: 'Denmark',     flag: '🇩🇰', rating: 80 },
  { name: 'Switzerland', flag: '🇨🇭', rating: 80 },
];

const R32_NATIONS: Nation[] = [
  { name: 'Saudi Arabia', flag: '🇸🇦', rating: 69 },
  { name: 'South Korea',  flag: '🇰🇷', rating: 74 },
  { name: 'Costa Rica',   flag: '🇨🇷', rating: 72 },
  { name: 'Nigeria',      flag: '🇳🇬', rating: 75 },
  { name: 'Ghana',        flag: '🇬🇭', rating: 74 },
  { name: 'Australia',    flag: '🇦🇺', rating: 71 },
  { name: 'USA',          flag: '🇺🇸', rating: 73 },
  { name: 'Japan',        flag: '🇯🇵', rating: 76 },
  { name: 'Morocco',      flag: '🇲🇦', rating: 77 },
  { name: 'Poland',       flag: '🇵🇱', rating: 77 },
];

const R16_NATIONS: Nation[] = [
  { name: 'USA',         flag: '🇺🇸', rating: 73 },
  { name: 'Japan',       flag: '🇯🇵', rating: 76 },
  { name: 'Senegal',     flag: '🇸🇳', rating: 76 },
  { name: 'Mexico',      flag: '🇲🇽', rating: 78 },
  { name: 'Colombia',    flag: '🇨🇴', rating: 78 },
  { name: 'Sweden',      flag: '🇸🇪', rating: 79 },
  { name: 'Denmark',     flag: '🇩🇰', rating: 80 },
  { name: 'Switzerland', flag: '🇨🇭', rating: 80 },
  { name: 'Uruguay',     flag: '🇺🇾', rating: 81 },
];

const QF_NATIONS: Nation[] = [
  { name: 'Croatia',     flag: '🇭🇷', rating: 83 },
  { name: 'Uruguay',     flag: '🇺🇾', rating: 83 },
  { name: 'Italy',       flag: '🇮🇹', rating: 84 },
  { name: 'Belgium',     flag: '🇧🇪', rating: 85 },
  { name: 'Netherlands', flag: '🇳🇱', rating: 85 },
  { name: 'Portugal',    flag: '🇵🇹', rating: 86 },
];

const SF_NATIONS: Nation[] = [
  { name: 'Spain',     flag: '🇪🇸', rating: 88 },
  { name: 'Germany',   flag: '🇩🇪', rating: 88 },
  { name: 'Argentina', flag: '🇦🇷', rating: 89 },
  { name: 'France',    flag: '🇫🇷', rating: 90 },
  { name: 'Brazil',    flag: '🇧🇷', rating: 90 },
];

const FINAL_NATIONS: Nation[] = [
  { name: 'Germany',   flag: '🇩🇪', rating: 89 },
  { name: 'Spain',     flag: '🇪🇸', rating: 89 },
  { name: 'Argentina', flag: '🇦🇷', rating: 91 },
  { name: 'France',    flag: '🇫🇷', rating: 91 },
  { name: 'Brazil',    flag: '🇧🇷', rating: 92 },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Match simulation
// ---------------------------------------------------------------------------

export function simulateGroupMatch(englandRating: number, opponent: Nation): MatchResult {
  const { englandLambda, opponentLambda } = expectedGoals(englandRating, opponent.rating);
  return {
    opponent,
    englandGoals: poisson(englandLambda),
    opponentGoals: poisson(opponentLambda),
  };
}

export function simulateKnockoutMatch(englandRating: number, opponent: Nation): MatchResult {
  const { englandLambda, opponentLambda } = expectedGoals(englandRating, opponent.rating);
  const englandGoals = poisson(englandLambda);
  const opponentGoals = poisson(opponentLambda);

  if (englandGoals !== opponentGoals) {
    return { opponent, englandGoals, opponentGoals };
  }

  // Draw — penalty shootout with slight bias toward higher-rated side
  const diff = englandRating - opponent.rating;
  const penWinProb = Math.max(0.3, Math.min(0.7, 0.5 + diff * 0.005));
  const penWin = Math.random() < penWinProb;
  return {
    opponent,
    englandGoals,
    opponentGoals,
    penaltiesWin: penWin,
    penaltiesLoss: !penWin,
  };
}

// ---------------------------------------------------------------------------
// Stage simulation
// ---------------------------------------------------------------------------

export const GROUP_GAMES = 3;
export const GROUP_QUALIFY_POINTS = 4;

/** Pick the next group opponent, never repeating one already faced this group. */
export function pickGroupOpponent(playedNames: string[]): Nation {
  const pool = GROUP_NATIONS.filter((n) => !playedNames.includes(n.name));
  return pickRandom(pool.length > 0 ? pool : GROUP_NATIONS);
}

/** Points earned so far across played group matches. */
export function groupPoints(matches: MatchResult[]): number {
  let points = 0;
  for (const m of matches) {
    if (m.englandGoals > m.opponentGoals) points += 3;
    else if (m.englandGoals === m.opponentGoals) points += 1;
  }
  return points;
}

export function simulateKnockoutStage(
  englandRating: number,
  stage: Exclude<TournamentStage, 'group'>
): MatchResult {
  const pools: Record<string, Nation[]> = {
    r32: R32_NATIONS,
    r16: R16_NATIONS,
    qf: QF_NATIONS,
    sf: SF_NATIONS,
    final: FINAL_NATIONS,
  };
  const opponent = pickRandom(pools[stage]);
  return simulateKnockoutMatch(englandRating, opponent);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getStageLabel(stage: TournamentStage): string {
  const labels: Record<TournamentStage, string> = {
    group: 'Group Stage',
    r32: 'Round of 32',
    r16: 'Round of 16',
    qf: 'Quarter-Final',
    sf: 'Semi-Final',
    final: 'The Final',
  };
  return labels[stage];
}

export function getNextStage(stage: TournamentStage): TournamentStage | null {
  const order: TournamentStage[] = ['group', 'r32', 'r16', 'qf', 'sf', 'final'];
  const idx = order.indexOf(stage);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

export function matchWon(m: MatchResult): boolean {
  return m.englandGoals > m.opponentGoals || m.penaltiesWin === true;
}
