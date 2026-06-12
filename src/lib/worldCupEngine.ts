import type { Nation, MatchResult, OtherGroupMatch, TournamentStage } from '@/store/types';

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

export const ENGLAND: Nation = { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 0 };

/** Draw England's three group opponents at the start of a run. */
export function drawGroupOpponents(): Nation[] {
  const shuffled = [...GROUP_NATIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, GROUP_GAMES);
}

/**
 * The two other teams' fixture for a given matchday (0-based), so every team
 * plays every other team exactly once across the three matchdays:
 *   MD1: ENG v A · B v C — MD2: ENG v B · A v C — MD3: ENG v C · A v B
 */
export function otherFixtureForMatchday(opponents: Nation[], matchday: number): [Nation, Nation] {
  const [a, b, c] = opponents;
  if (matchday === 0) return [b, c];
  if (matchday === 1) return [a, c];
  return [a, b];
}

/** Simulate a fixture between two AI nations. */
export function simulateOtherGroupMatch(home: Nation, away: Nation): OtherGroupMatch {
  const diff = home.rating - away.rating;
  const homeLambda = Math.max(0.3, GOAL_BASE + diff * RATING_SCALE);
  const awayLambda = Math.max(0.3, GOAL_BASE - diff * RATING_SCALE);
  return { home, away, homeGoals: poisson(homeLambda), awayGoals: poisson(awayLambda) };
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

// ---------------------------------------------------------------------------
// Live group table
// ---------------------------------------------------------------------------

export interface GroupTableRow {
  name: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
  isEngland: boolean;
}

/** Top 2 of the group advance to the knockouts. */
export const GROUP_QUALIFY_SPOTS = 2;

export function computeGroupTable(
  opponents: Nation[],
  englandMatches: MatchResult[],
  otherMatches: OtherGroupMatch[]
): GroupTableRow[] {
  const rows = new Map<string, GroupTableRow>();
  const blank = (n: Nation, isEngland = false): GroupTableRow => ({
    name: n.name, flag: n.flag, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0, isEngland,
  });
  rows.set(ENGLAND.name, blank(ENGLAND, true));
  for (const opp of opponents) rows.set(opp.name, blank(opp));

  function apply(name: string, gf: number, ga: number) {
    const row = rows.get(name);
    if (!row) return;
    row.played += 1;
    row.gf += gf;
    row.ga += ga;
    if (gf > ga) { row.won += 1; row.pts += 3; }
    else if (gf === ga) { row.drawn += 1; row.pts += 1; }
    else row.lost += 1;
  }

  for (const m of englandMatches) {
    apply(ENGLAND.name, m.englandGoals, m.opponentGoals);
    apply(m.opponent.name, m.opponentGoals, m.englandGoals);
  }
  for (const m of otherMatches) {
    apply(m.home.name, m.homeGoals, m.awayGoals);
    apply(m.away.name, m.awayGoals, m.homeGoals);
  }

  return Array.from(rows.values()).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga;
    const gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });
}

/** England's current position in the group (1-based). */
export function englandGroupPosition(table: GroupTableRow[]): number {
  return table.findIndex((r) => r.isEngland) + 1;
}

// ---------------------------------------------------------------------------
// Best third-placed teams (48-team format: 8 of the 12 thirds advance)
// ---------------------------------------------------------------------------

interface ThirdPlaceRecord {
  pts: number;
  gd: number;
  gf: number;
}

/** Simulate one rival group (round robin of 4) and return its 3rd-place record. */
function simulateRivalThirdPlace(): ThirdPlaceRecord {
  const teams = [...GROUP_NATIONS].sort(() => Math.random() - 0.5).slice(0, 4);
  const stats = new Map<string, ThirdPlaceRecord>(
    teams.map((t) => [t.name, { pts: 0, gd: 0, gf: 0 }])
  );

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const m = simulateOtherGroupMatch(teams[i], teams[j]);
      const home = stats.get(m.home.name)!;
      const away = stats.get(m.away.name)!;
      home.gd += m.homeGoals - m.awayGoals;
      home.gf += m.homeGoals;
      away.gd += m.awayGoals - m.homeGoals;
      away.gf += m.awayGoals;
      if (m.homeGoals > m.awayGoals) home.pts += 3;
      else if (m.homeGoals < m.awayGoals) away.pts += 3;
      else { home.pts += 1; away.pts += 1; }
    }
  }

  const sorted = Array.from(stats.values()).sort(
    (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
  );
  return sorted[2];
}

/**
 * Did England's 3rd-place record make the cut as one of the 8 best thirds?
 * The other 11 groups are simulated to rank England's record among the 12.
 */
export function thirdPlaceQualifies(england: ThirdPlaceRecord): boolean {
  const rivals = Array.from({ length: 11 }, simulateRivalThirdPlace);
  const beatenBy = rivals.filter(
    (r) =>
      r.pts > england.pts ||
      (r.pts === england.pts && (r.gd > england.gd || (r.gd === england.gd && r.gf > england.gf)))
  ).length;
  return beatenBy < 8;
}

/** Draw the opponent for a knockout stage in advance, so the player knows who's next. */
export function pickKnockoutOpponent(stage: Exclude<TournamentStage, 'group'>): Nation {
  const pools: Record<string, Nation[]> = {
    r32: R32_NATIONS,
    r16: R16_NATIONS,
    qf: QF_NATIONS,
    sf: SF_NATIONS,
    final: FINAL_NATIONS,
  };
  return pickRandom(pools[stage]);
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
