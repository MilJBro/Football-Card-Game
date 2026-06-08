import type { GameModeDef, SeasonResult } from '@/store/types';
import type { SquadSummary } from '@/lib/squadUtils';

// ============================================================================
// Season simulation. There is no modelled opposing squad — your squad's
// ratings drive expected goals against a fixed league-average baseline. A full
// season (league + FA Cup + League Cup + Champions League) is always
// simulated; each mode's win condition then inspects the result. Difficulty
// comes entirely from the win conditions, not from a per-mode opponent.
//
// Constants below were tuned (see balance harness) so that:
//   • a ~76 starter squad can begin winning the Domestic Double,
//   • a maxed ~90 squad clears every challenge at fair-but-not-certain rates,
//   • difficulty scales dd → cent → eg → inv → quad/iron.
// ============================================================================

const LEAGUE_GAMES = 38;
const OPP_BASE = 74; // fixed league-average opponent strength
const SCALE = 13; // larger = less swingy results
const GOAL_BASE = 1.3; // baseline expected goals per side
const TITLE_THRESHOLD = 88; // points needed to be champions

/** Sample from a Poisson distribution (Knuth's algorithm). */
function poisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

interface MatchScore {
  gf: number;
  ga: number;
}

/**
 * Simulate a single match as goals-for / goals-against.
 * attack/defence are the squad's split ratings; oppStrength is the difficulty
 * baseline. homeAdv shifts expected goals in the squad's favour.
 */
function simulateMatch(
  attack: number,
  defence: number,
  oppStrength: number,
  homeAdv: number
): MatchScore {
  const expFor = GOAL_BASE * Math.exp((attack + homeAdv - oppStrength) / SCALE);
  const expAgainst = GOAL_BASE * Math.exp((oppStrength - defence - homeAdv * 0.5) / SCALE);

  return {
    gf: Math.min(poisson(expFor), 9),
    ga: Math.min(poisson(expAgainst), 9),
  };
}

/** Win a knockout tie: win in normal time, or settle a draw on penalties
 *  weighted by squad strength vs the opponent. Returns true if the tie is won. */
function winKnockoutTie(
  attack: number,
  defence: number,
  oppStrength: number
): boolean {
  const { gf, ga } = simulateMatch(attack, defence, oppStrength, 2);
  if (gf > ga) return true;
  if (gf < ga) return false;
  // Penalties — coin flip nudged by quality.
  const edge = (attack + defence) / 2 - oppStrength;
  const winProb = 1 / (1 + Math.exp(-edge / 5));
  return Math.random() < winProb;
}

/** Run a cup as a sequence of knockout rounds; win them all to lift the trophy. */
function simulateCup(
  attack: number,
  defence: number,
  oppStrength: number,
  rounds: number
): boolean {
  for (let r = 0; r < rounds; r++) {
    // Opposition gets tougher in later rounds.
    const roundStrength = oppStrength + r * 1.0;
    if (!winKnockoutTie(attack, defence, roundStrength)) return false;
  }
  return true;
}

export function simulateSeason(squad: SquadSummary): SeasonResult {
  const attack = squad.attackRating;
  const defence = squad.defenceRating;

  // ---- League ----
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (let g = 0; g < LEAGUE_GAMES; g++) {
    const homeAdv = g % 2 === 0 ? 4 : 0; // alternate home/away
    const { gf, ga } = simulateMatch(attack, defence, OPP_BASE, homeAdv);
    goalsFor += gf;
    goalsAgainst += ga;
    if (gf > ga) wins++;
    else if (gf === ga) draws++;
    else losses++;
  }

  const points = wins * 3 + draws;
  const unbeaten = losses === 0;

  // Title race: champions if points clear a typical title-winning tally.
  const wonLeague = points >= TITLE_THRESHOLD;
  const leaguePosition = wonLeague
    ? 1
    : Math.min(20, 1 + Math.ceil((TITLE_THRESHOLD - points) / 3));

  // ---- Cups (knockout rounds; win them all to lift the trophy) ----
  const wonFaCup = simulateCup(attack, defence, OPP_BASE, 4);
  const wonLeagueCup = simulateCup(attack, defence, OPP_BASE - 2, 3);
  const wonChampionsLeague = simulateCup(attack, defence, OPP_BASE + 3, 5);

  return {
    leaguePosition,
    points,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    wonLeague,
    wonFaCup,
    wonLeagueCup,
    wonChampionsLeague,
    unbeaten,
  };
}

/** Check whether a simulated season satisfies a mode's win condition. */
export function evaluateWinCondition(mode: GameModeDef, s: SeasonResult): boolean {
  switch (mode.id) {
    case 'domestic-double':
      return s.wonFaCup && s.wonLeagueCup;
    case 'european-glory':
      return s.wonChampionsLeague;
    case 'iron-defence':
      return s.wonLeague && s.goalsAgainst < 15;
    case 'centurions':
      return s.wonLeague && s.points >= 100;
    case 'invincibles':
      return s.wonLeague && s.unbeaten;
    case 'quadruple':
      return s.wonLeague && s.wonFaCup && s.wonLeagueCup && s.wonChampionsLeague;
    default:
      return false;
  }
}
