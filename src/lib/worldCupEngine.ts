import type { Nation, MatchResult, OtherGroupMatch, TournamentStage } from '@/store/types';

// ============================================================================
// World Cup match simulation — Poisson-based goal engine.
// ============================================================================

const GOAL_BASE = 1.3;
const RATING_SCALE = 0.025;

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

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Returns [winner_pens, loser_pens] — realistic shootout at ~75% conversion.
function simulatePenShootout(): [number, number] {
  const HIT = 0.75;
  for (;;) {
    let a = 0, b = 0;
    for (let i = 0; i < 5; i++) {
      if (Math.random() < HIT) a++;
      if (Math.random() < HIT) b++;
    }
    while (a === b) {
      if (Math.random() < HIT) a++;
      if (Math.random() < HIT) b++;
    }
    if (a > b) return [a, b];
  }
}

// ---------------------------------------------------------------------------
// All 47 non-England 2026 World Cup nations
// ---------------------------------------------------------------------------

export const ALL_NATIONS: Nation[] = [
  // UEFA
  { name: 'Germany',      flag: '🇩🇪', rating: 87 },
  { name: 'France',       flag: '🇫🇷', rating: 92 },
  { name: 'Spain',        flag: '🇪🇸', rating: 90 },
  { name: 'Portugal',     flag: '🇵🇹', rating: 88 },
  { name: 'Netherlands',  flag: '🇳🇱', rating: 86 },
  { name: 'Italy',        flag: '🇮🇹', rating: 81 },
  { name: 'Belgium',      flag: '🇧🇪', rating: 82 },
  { name: 'Croatia',      flag: '🇭🇷', rating: 80 },
  { name: 'Switzerland',  flag: '🇨🇭', rating: 80 },
  { name: 'Denmark',      flag: '🇩🇰', rating: 80 },
  { name: 'Serbia',       flag: '🇷🇸', rating: 77 },
  { name: 'Austria',      flag: '🇦🇹', rating: 76 },
  { name: 'Turkey',       flag: '🇹🇷', rating: 75 },
  { name: 'Poland',       flag: '🇵🇱', rating: 75 },
  { name: 'Ukraine',      flag: '🇺🇦', rating: 74 },
  { name: 'Scotland',     flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rating: 69 },
  // CONMEBOL
  { name: 'Argentina',    flag: '🇦🇷', rating: 94 },
  { name: 'Brazil',       flag: '🇧🇷', rating: 91 },
  { name: 'Colombia',     flag: '🇨🇴', rating: 82 },
  { name: 'Uruguay',      flag: '🇺🇾', rating: 80 },
  { name: 'Ecuador',      flag: '🇪🇨', rating: 74 },
  { name: 'Venezuela',    flag: '🇻🇪', rating: 70 },
  // CONCACAF
  { name: 'USA',          flag: '🇺🇸', rating: 80 },
  { name: 'Mexico',       flag: '🇲🇽', rating: 77 },
  { name: 'Canada',       flag: '🇨🇦', rating: 76 },
  { name: 'Panama',       flag: '🇵🇦', rating: 67 },
  { name: 'Costa Rica',   flag: '🇨🇷', rating: 67 },
  { name: 'Honduras',     flag: '🇭🇳', rating: 65 },
  // CAF
  { name: 'Morocco',      flag: '🇲🇦', rating: 81 },
  { name: 'Senegal',      flag: '🇸🇳', rating: 79 },
  { name: 'Nigeria',      flag: '🇳🇬', rating: 74 },
  { name: 'Egypt',        flag: '🇪🇬', rating: 73 },
  { name: 'Ivory Coast',  flag: '🇨🇮', rating: 73 },
  { name: 'Cameroon',     flag: '🇨🇲', rating: 72 },
  { name: 'Algeria',      flag: '🇩🇿', rating: 72 },
  { name: 'Ghana',        flag: '🇬🇭', rating: 71 },
  { name: 'South Africa', flag: '🇿🇦', rating: 66 },
  // AFC
  { name: 'Japan',        flag: '🇯🇵', rating: 78 },
  { name: 'South Korea',  flag: '🇰🇷', rating: 75 },
  { name: 'Iran',         flag: '🇮🇷', rating: 73 },
  { name: 'Saudi Arabia', flag: '🇸🇦', rating: 71 },
  { name: 'Australia',    flag: '🇦🇺', rating: 72 },
  { name: 'Uzbekistan',   flag: '🇺🇿', rating: 67 },
  { name: 'Iraq',         flag: '🇮🇶', rating: 66 },
  { name: 'Qatar',        flag: '🇶🇦', rating: 68 },
  // OFC
  { name: 'New Zealand',  flag: '🇳🇿', rating: 62 },
  // Intercontinental playoffs
  { name: 'Jamaica',      flag: '🇯🇲', rating: 65 },
];

// ---------------------------------------------------------------------------
// Seeded group draw
// England is a Pot 1 team — opponents come from Pots 2, 3 and 4 only,
// so elite nations never share England's group.
// ---------------------------------------------------------------------------

// Pot 1 (85+): Argentina, Brazil, Spain, Portugal, Germany, Netherlands,
// France — plus England itself. These are never drawn as England's opponents.
const GROUP_POT2 = ALL_NATIONS.filter((n) => n.rating >= 75 && n.rating <= 84);
const GROUP_POT3 = ALL_NATIONS.filter((n) => n.rating >= 68 && n.rating < 75);
const GROUP_POT4 = ALL_NATIONS.filter((n) => n.rating < 68);

// ---------------------------------------------------------------------------
// Match simulation
// ---------------------------------------------------------------------------

export function simulateGroupMatch(englandAttack: number, englandDefense: number, opponent: Nation): MatchResult {
  const englandLambda = Math.max(0.3, GOAL_BASE + (englandAttack - opponent.rating) * RATING_SCALE);
  const opponentLambda = Math.max(0.3, GOAL_BASE + (opponent.rating - englandDefense) * RATING_SCALE);
  return { opponent, englandGoals: poisson(englandLambda), opponentGoals: poisson(opponentLambda) };
}

export function simulateKnockoutMatch(englandAttack: number, englandDefense: number, opponent: Nation): MatchResult {
  const englandLambda = Math.max(0.3, GOAL_BASE + (englandAttack - opponent.rating) * RATING_SCALE);
  const opponentLambda = Math.max(0.3, GOAL_BASE + (opponent.rating - englandDefense) * RATING_SCALE);
  const englandGoals = poisson(englandLambda);
  const opponentGoals = poisson(opponentLambda);
  if (englandGoals !== opponentGoals) return { opponent, englandGoals, opponentGoals };
  const avg = Math.round((englandAttack + englandDefense) / 2);
  const penWinProb = Math.max(0.3, Math.min(0.7, 0.5 + (avg - opponent.rating) * 0.005));
  const penWin = Math.random() < penWinProb;
  const [winPens, losePens] = simulatePenShootout();
  return {
    opponent, englandGoals, opponentGoals,
    penaltiesWin: penWin, penaltiesLoss: !penWin,
    englandPens: penWin ? winPens : losePens,
    opponentPens: penWin ? losePens : winPens,
  };
}

// ---------------------------------------------------------------------------
// Stage simulation
// ---------------------------------------------------------------------------

export const GROUP_GAMES = 3;

export const ENGLAND: Nation = { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 0 };

/** Draw England's three group opponents — one from each seeding pot. */
export function drawGroupOpponents(): Nation[] {
  return [
    pickRandom(GROUP_POT2),
    pickRandom(GROUP_POT3),
    pickRandom(GROUP_POT4),
  ];
}

export function otherFixtureForMatchday(opponents: Nation[], matchday: number): [Nation, Nation] {
  const [a, b, c] = opponents;
  if (matchday === 0) return [b, c];
  if (matchday === 1) return [a, c];
  return [a, b];
}

export function simulateOtherGroupMatch(home: Nation, away: Nation): OtherGroupMatch {
  const diff = home.rating - away.rating;
  const homeLambda = Math.max(0.3, GOAL_BASE + diff * RATING_SCALE);
  const awayLambda = Math.max(0.3, GOAL_BASE - diff * RATING_SCALE);
  return { home, away, homeGoals: poisson(homeLambda), awayGoals: poisson(awayLambda) };
}

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

export function englandGroupPosition(table: GroupTableRow[]): number {
  return table.findIndex((r) => r.isEngland) + 1;
}

// ---------------------------------------------------------------------------
// Best third-placed teams (8 of 12 thirds advance)
// ---------------------------------------------------------------------------

interface ThirdPlaceRecord { pts: number; gd: number; gf: number; }

function simulateRivalThirdPlace(): ThirdPlaceRecord {
  const pool = ALL_NATIONS.filter((n) => n.rating < 85);
  const teams = [...pool].sort(() => Math.random() - 0.5).slice(0, 4);
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

export function thirdPlaceQualifies(england: ThirdPlaceRecord): boolean {
  const rivals = Array.from({ length: 11 }, simulateRivalThirdPlace);
  const beatenBy = rivals.filter(
    (r) =>
      r.pts > england.pts ||
      (r.pts === england.pts && (r.gd > england.gd || (r.gd === england.gd && r.gf > england.gf)))
  ).length;
  return beatenBy < 8;
}

/** Pre-draw the opponent for a knockout stage — escalating difficulty. */
export function pickKnockoutOpponent(stage: Exclude<TournamentStage, 'group'>): Nation {
  const ranges: Record<Exclude<TournamentStage, 'group'>, [number, number]> = {
    r32:   [65, 82],
    r16:   [72, 86],
    qf:    [78, 91],
    sf:    [84, 93],
    final: [88, 95],
  };
  const [min, max] = ranges[stage];
  const pool = ALL_NATIONS.filter((n) => n.rating >= min && n.rating <= max);
  return pickRandom(pool.length > 0 ? pool : ALL_NATIONS);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getStageLabel(stage: TournamentStage): string {
  const labels: Record<TournamentStage, string> = {
    group: 'Group Stage',
    r32:   'Round of 32',
    r16:   'Round of 16',
    qf:    'Quarter-Final',
    sf:    'Semi-Final',
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

// ---------------------------------------------------------------------------
// Simulate the rest of the tournament after England's elimination
// ---------------------------------------------------------------------------

export interface NeutralResult {
  home: Nation;
  away: Nation;
  homeGoals: number;
  awayGoals: number;
  pens?: 'home' | 'away';
  homePens?: number;
  awayPens?: number;
}

export interface TournamentEndSummary {
  qf: NeutralResult[];
  sf: NeutralResult[];
  final: NeutralResult;
  champion: Nation;
}

function simulateNeutral(home: Nation, away: Nation): NeutralResult {
  const diff = home.rating - away.rating;
  const homeGoals = poisson(Math.max(0.3, GOAL_BASE + diff * RATING_SCALE));
  const awayGoals = poisson(Math.max(0.3, GOAL_BASE - diff * RATING_SCALE));
  if (homeGoals !== awayGoals) return { home, away, homeGoals, awayGoals };
  const penWinProb = Math.max(0.3, Math.min(0.7, 0.5 + diff * 0.005));
  const pens: 'home' | 'away' = Math.random() < penWinProb ? 'home' : 'away';
  const [winPens, losePens] = simulatePenShootout();
  return {
    home, away, homeGoals, awayGoals, pens,
    homePens: pens === 'home' ? winPens : losePens,
    awayPens: pens === 'away' ? winPens : losePens,
  };
}

function neutralWinner(r: NeutralResult): Nation {
  return r.homeGoals > r.awayGoals || r.pens === 'home' ? r.home : r.away;
}

/** Simulate QF → SF → Final.
 *  If `eliminator` is provided it is seeded into the bracket at the
 *  appropriate entry point:
 *  - eliminated at group/r32/r16/qf → seeded into QF1
 *  - eliminated at sf               → seeded directly into SF1 (bypasses QF) */
export function simulateTournamentEnd(eliminator?: Nation, eliminatedAt?: TournamentStage): TournamentEndSummary {
  const qfCandidates = [...ALL_NATIONS.filter((n) => n.rating >= 78)].sort(() => Math.random() - 0.5);
  const sfCandidates = [...ALL_NATIONS.filter((n) => n.rating >= 85)].sort(() => Math.random() - 0.5);

  // ---- Quarter-finals (8 teams) ----
  let qfTeams: Nation[];
  if (eliminator && eliminatedAt !== 'sf') {
    const rest = qfCandidates.filter((n) => n.name !== eliminator.name).slice(0, 7);
    qfTeams = [eliminator, ...rest];
  } else {
    qfTeams = qfCandidates.slice(0, 8);
  }

  const qf = [
    simulateNeutral(qfTeams[0], qfTeams[1]),
    simulateNeutral(qfTeams[2], qfTeams[3]),
    simulateNeutral(qfTeams[4], qfTeams[5]),
    simulateNeutral(qfTeams[6], qfTeams[7]),
  ];

  // ---- Semi-finals (4 teams) ----
  let sfTeams: Nation[];
  if (eliminator && eliminatedAt === 'sf') {
    // Eliminator goes straight into SF1 alongside elite opponents
    const rest = sfCandidates.filter((n) => n.name !== eliminator.name);
    sfTeams = [eliminator, rest[0], rest[1], rest[2]];
  } else {
    sfTeams = qf.map(neutralWinner);
  }

  const sf = [
    simulateNeutral(sfTeams[0], sfTeams[1]),
    simulateNeutral(sfTeams[2], sfTeams[3]),
  ];

  const final = simulateNeutral(neutralWinner(sf[0]), neutralWinner(sf[1]));
  return { qf, sf, final, champion: neutralWinner(final) };
}

// ---------------------------------------------------------------------------
// Run conclusion — what happened after England were knocked out.
// Follows the team that eliminated England (or a neutral elite bracket when
// England went out in the group) through to the eventual champion.
// ---------------------------------------------------------------------------

export interface ConclusionMatch {
  stage: TournamentStage;
  result: NeutralResult;
}

export interface RunConclusion {
  /** Stages played after England's exit, in order. */
  conclusion: ConclusionMatch[];
  champion: Nation;
}

const KNOCKOUT_ORDER: Exclude<TournamentStage, 'group'>[] = ['r32', 'r16', 'qf', 'sf', 'final'];

/** Build the post-England story.
 *  - eliminator known (knockout exit): follow them forward to the title, or to
 *    whoever knocks them out, ending on the real champion.
 *  - eliminator null (group exit): show a neutral elite bracket from the QFs. */
export function simulateRunConclusion(
  eliminator: Nation | null,
  eliminatedAt: TournamentStage,
): RunConclusion {
  // Group exit — no single eliminator to follow. Show the latter rounds neutrally.
  if (!eliminator || eliminatedAt === 'group') {
    const end = simulateTournamentEnd();
    return {
      conclusion: [
        ...end.qf.map((result): ConclusionMatch => ({ stage: 'qf', result })),
        ...end.sf.map((result): ConclusionMatch => ({ stage: 'sf', result })),
        { stage: 'final', result: end.final },
      ],
      champion: end.champion,
    };
  }

  const startIdx = KNOCKOUT_ORDER.indexOf(eliminatedAt as Exclude<TournamentStage, 'group'>) + 1;
  const remaining = KNOCKOUT_ORDER.slice(startIdx);

  let current = eliminator;
  const conclusion: ConclusionMatch[] = [];
  for (const stage of remaining) {
    let opponent = pickKnockoutOpponent(stage);
    // Avoid the eliminator drawing itself.
    let guard = 0;
    while (opponent.name === current.name && guard++ < 8) opponent = pickKnockoutOpponent(stage);
    const result = simulateNeutral(current, opponent);
    conclusion.push({ stage, result });
    current = neutralWinner(result);
  }

  // If England lost the final, `remaining` is empty and the eliminator is champion.
  return { conclusion, champion: current };
}
