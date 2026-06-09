import type { PackDef, PackCategory, PackRarity, Tier } from '@/store/types';

// Coin cost per rarity — Squad cheapest, Elite most expensive.
export const RARITY_COST: Record<PackRarity, number> = {
  squad: 500,
  firstteam: 1200,
  elite: 2500,
};

export const RARITY_LABEL: Record<PackRarity, string> = {
  squad: 'Squad',
  firstteam: 'First Team',
  elite: 'Elite',
};

// Draw odds across the three card grades (Rising = fringe, Star = solid,
// Legend = big name). Every pack can pull anything; price buys better odds.
const RARITY_WEIGHTS: Record<PackRarity, Record<Tier, number>> = {
  squad: { Rising: 86, Star: 12, Legend: 2 },
  firstteam: { Rising: 30, Star: 63, Legend: 7 },
  elite: { Rising: 20, Star: 60, Legend: 20 },
};

const RARITY_BLURB: Record<PackRarity, string> = {
  squad: 'Mostly fringe squad players — with a slim shot at a legend.',
  firstteam: 'Solid first-team regulars and a few squad players, plus a chance at a legend.',
  elite: 'Best odds at a legend, with first-team and squad players mixed in.',
};

const CATEGORIES: { pack: PackCategory; label: string }[] = [
  { pack: 'GK', label: 'Goalkeeper' },
  { pack: 'DEF', label: 'Defender' },
  { pack: 'MID', label: 'Midfielder' },
  { pack: 'ATT', label: 'Attacker' },
];

const RARITIES: PackRarity[] = ['squad', 'firstteam', 'elite'];

export const CARDS_PER_PACK = 4;

// 12 packs = 4 categories × 3 rarities.
export const ALL_PACKS: PackDef[] = CATEGORIES.flatMap(({ pack, label }) =>
  RARITIES.map((rarity) => ({
    id: `${pack.toLowerCase()}-${rarity}`,
    name: `${label} ${RARITY_LABEL[rarity]} Pack`,
    pack,
    rarity,
    cost: RARITY_COST[rarity],
    cardCount: CARDS_PER_PACK,
    description: `${RARITY_BLURB[rarity]} Contains ${CARDS_PER_PACK} ${label.toLowerCase()} cards.`,
    weights: RARITY_WEIGHTS[rarity],
  }))
);

export const PACK_BY_ID: Record<string, PackDef> = Object.fromEntries(
  ALL_PACKS.map((p) => [p.id, p])
);

export function getPack(packId: string): PackDef | undefined {
  return PACK_BY_ID[packId];
}
