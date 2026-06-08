import type { PackDef, PackCategory, Tier } from '@/store/types';

// Coin cost per tier — Rising cheapest, Legend most expensive.
export const TIER_COST: Record<Tier, number> = {
  Rising: 500,
  Star: 1200,
  Legend: 2500,
};

const CATEGORIES: { pack: PackCategory; label: string }[] = [
  { pack: 'GK', label: 'Goalkeeper' },
  { pack: 'DEF', label: 'Defender' },
  { pack: 'MID', label: 'Midfielder' },
  { pack: 'ATT', label: 'Attacker' },
];

const TIERS: Tier[] = ['Rising', 'Star', 'Legend'];

const TIER_BLURB: Record<Tier, string> = {
  Rising: 'Breakthrough-era cards. Affordable raw talent.',
  Star: 'Established stars hitting their stride.',
  Legend: 'All-time greats at their peak.',
};

export const CARDS_PER_PACK = 5;

// 12 packs = 4 categories × 3 tiers.
export const ALL_PACKS: PackDef[] = CATEGORIES.flatMap(({ pack, label }) =>
  TIERS.map((tier) => ({
    id: `${pack.toLowerCase()}-${tier.toLowerCase()}`,
    name: `${label} ${tier} Pack`,
    pack,
    tier,
    cost: TIER_COST[tier],
    cardCount: CARDS_PER_PACK,
    description: `${TIER_BLURB[tier]} Contains ${CARDS_PER_PACK} ${label.toLowerCase()} cards.`,
  }))
);

export const PACK_BY_ID: Record<string, PackDef> = Object.fromEntries(
  ALL_PACKS.map((p) => [p.id, p])
);

export function getPack(packId: string): PackDef | undefined {
  return PACK_BY_ID[packId];
}
