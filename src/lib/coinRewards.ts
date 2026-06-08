import type { PlayerCardDef, SeasonResult, Tier } from '@/store/types';

// Starting balance for a new player — enough for a couple of Rising packs.
export const STARTING_COINS = 2000;

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
// Rewards finishing high and winning trophies, independent of the mode's
// specific win condition.
export function seasonFinishReward(season: SeasonResult): number {
  let reward = 0;
  // League position: 1st = 1000 down to ~50 near the bottom.
  reward += Math.max(0, (21 - season.leaguePosition) * 50);
  if (season.wonLeague) reward += 1000;
  if (season.wonFaCup) reward += 500;
  if (season.wonLeagueCup) reward += 400;
  if (season.wonChampionsLeague) reward += 1200;
  return reward;
}

// ---- Tier upgrade cost (to upgrade FROM the given tier to the next one) ----
const UPGRADE_COST: Record<Tier, number> = {
  Rising: 1200, // Rising -> Star
  Star: 3000, // Star -> Legend
  Legend: 0, // already max tier
};

export function upgradeCost(fromTier: Tier): number {
  return UPGRADE_COST[fromTier];
}
