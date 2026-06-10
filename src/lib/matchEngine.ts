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
const SCALE_ATT = 22; // slower growth for goals scored — prevents elite squads scoring 200+
const SCALE_DEF = 13; // tighter curve for goals conceded — keeps Iron Defence achievable
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
  const expFor = GOAL_BASE * Math.exp((attack + homeAdv - oppStrength) / SCALE_ATT);
  const expAgainst = GOAL_BASE * Math.exp((oppStrength - defence - homeAdv * 0.5) / SCALE_DEF);

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

/**
 * Apply a challenge's thematic emphasis to a squad's attack/defence.
 *
 * The bonuses are measured *relative to the squad's own overall rating*, so a
 * perfectly balanced XI (every line equal) gets no change and behaves exactly
 * as the base tuning intends. Specialising your upgrades toward what a
 * challenge demands is what shifts the odds in your favour:
 *   • Iron Defence  → reward a strong goalkeeper + back line.
 *   • Invincibles   → reward defence (don't lose).
 *   • Centurions    → reward attack + midfield (rack up points).
 *   • European Tour → reward attackers who win tight knockout ties.
 *   • Cup Run       → balanced; carrying weak links hurts in cup ties.
 *   • The Quadruple → demands a complete XI; weak links are punished hard.
 */
function challengeRatings(
  mode: GameModeDef,
  s: SquadSummary
): { attack: number; defence: number } {
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // How much the defensive unit (GK + back line) outshines the squad overall.
  const defFocus = clamp((s.gkRating + s.defLineRating) / 2 - s.rating, -5, 5);
  // How much the attacking unit (front line + midfield) outshines the squad.
  const attFocus = clamp((s.attackLineRating + s.midRating) / 2 - s.rating, -5, 5);
  // Weak-link gap: 0 when the XI is even, grows as you carry a passenger.
  const weakGap = clamp(s.rating - s.weakestRating, 0, 10);

  let attack = s.attackRating;
  let defence = s.defenceRating;

  switch (mode.id) {
    case 'iron-defence':
      defence += defFocus * 1.0;
      break;
    case 'invincibles':
      // Unbeaten demands a wall: heavily reward defence, and a lopsided,
      // leaky attack-first squad will drop a game somewhere.
      defence += defFocus * 2.5;
      attack -= attFocus * 0.5;
      attack -= weakGap * 0.2;
      defence -= weakGap * 0.2;
      break;
    case 'centurions':
      attack += attFocus * 1.4;
      break;
    case 'european-glory':
      attack += attFocus * 1.0;
      defence += defFocus * 0.5;
      break;
    case 'domestic-double':
      attack -= weakGap * 0.25;
      defence -= weakGap * 0.25;
      break;
    case 'quadruple':
      attack += attFocus * 0.4 - weakGap * 0.5;
      defence += defFocus * 0.4 - weakGap * 0.5;
      break;
  }

  return { attack, defence };
}

export function simulateSeason(squad: SquadSummary, mode: GameModeDef): SeasonResult {
  const { attack, defence } = challengeRatings(mode, squad);

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
      return s.wonLeague && s.goalsAgainst < 12;
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
