import type { PlayerCardDef, SeasonResult, Tier } from '@/store/types';

// Starting balance — enough for several Squad packs across each position,
// giving players a real squad to start with before their first simulation.
export const STARTING_COINS = 4000;

// ---- Discard / sell value (scaled by tier & rating) ----
const DISCARD_MULTIPLIER: Record<Tier, number> = {
  Rising: 2,
  Star: 4,
  Legend: 8,
};

export function discardValue(card: PlayerCardDef): number {
  return Math.round(card.rating * DISCARD_MULTIPLIER[card.tier]);
}

// ---- Season finish reward (always paid for a completed run) ----
// A flat participation base ensures even a weak squad earns enough each
// season to meaningfully progress toward the next pack or upgrade.
export function seasonFinishReward(season: SeasonResult): number {
  let reward = 400; // base: you played a full season
  reward += Math.max(0, (21 - season.leaguePosition) * 50);
  if (season.wonLeague) reward += 1000;
  if (season.wonFaCup) reward += 500;
  if (season.wonLeagueCup) reward += 400;
  if (season.wonChampionsLeague) reward += 1200;
  return reward;
}

// ---- Tier upgrade cost (to upgrade FROM the given tier to the next one) ----
// Costs are intentionally set so upgrading feels like a meaningful mid-challenge
// decision: ~2 mediocre seasons for a Rising→Star, ~4-5 for a Star→Legend.
const UPGRADE_COST: Record<Tier, number> = {
  Rising: 1000, // Rising -> Star
  Star: 2500,   // Star -> Legend
  Legend: 0,    // already max tier
};

export function upgradeCost(fromTier: Tier): number {
  return UPGRADE_COST[fromTier];
}
