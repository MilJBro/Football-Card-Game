import type { PlayerCardDef, SeasonResult } from '@/store/types';
import { getEffectiveCardData } from '@/data/players';

export const STARTING_COINS = 4000;
export const MAX_DAILY_TOKENS = 3;

// ---- Discard / sell value (scaled by upgrade level & rating) ----
const DISCARD_MULTIPLIER: Record<0 | 1 | 2, number> = {
  0: 2,
  1: 4,
  2: 8,
};

export function discardValue(card: PlayerCardDef, upgradeLevel: 0 | 1 | 2 = 0): number {
  const { rating } = getEffectiveCardData(card, upgradeLevel);
  return Math.round(rating * DISCARD_MULTIPLIER[upgradeLevel]);
}

// ---- Season finish reward ----
export function seasonFinishReward(season: SeasonResult): number {
  let reward = 400;
  reward += Math.max(0, (21 - season.leaguePosition) * 50);
  if (season.wonLeague) reward += 1000;
  if (season.wonFaCup) reward += 500;
  if (season.wonLeagueCup) reward += 400;
  if (season.wonChampionsLeague) reward += 1200;
  return reward;
}

// ---- Upgrade cost: level 0→1 costs 1 000, level 1→2 costs 2 500 ----
const UPGRADE_COST: Record<0 | 1 | 2, number> = {
  0: 1000,
  1: 2500,
  2: 0,
};

export function upgradeCost(fromLevel: 0 | 1 | 2): number {
  return UPGRADE_COST[fromLevel];
}
