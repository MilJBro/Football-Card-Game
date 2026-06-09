import type { PackDef, PackCategory } from '@/store/types';

export const CARDS_PER_PACK = 4;

// One pack per position category. 600 coins each.
// Odds: 62% Rising · 35% Star · 3% Legend per card slot.
const WEIGHTS = { Rising: 62, Star: 35, Legend: 3 };

const CATEGORIES: { pack: PackCategory; name: string; description: string }[] = [
  {
    pack: 'GK',
    name: 'Goalkeeper Pack',
    description: 'Four goalkeepers — with a chance of landing a legend between the sticks.',
  },
  {
    pack: 'DEF',
    name: 'Defender Pack',
    description: 'A full back four: one RB, two CBs, and one LB guaranteed every time.',
  },
  {
    pack: 'MID',
    name: 'Midfielder Pack',
    description: 'Four midfielders to control the game — any tier, any style.',
  },
  {
    pack: 'ATT',
    name: 'Attacker Pack',
    description: 'A front three: one LW, two STs, and one RW guaranteed every time.',
  },
];

export const ALL_PACKS: PackDef[] = CATEGORIES.map(({ pack, name, description }) => ({
  id: pack.toLowerCase(),
  name,
  pack,
  cost: 600,
  cardCount: CARDS_PER_PACK,
  description,
  weights: WEIGHTS,
}));

export const PACK_BY_ID: Record<string, PackDef> = Object.fromEntries(
  ALL_PACKS.map((p) => [p.id, p])
);

export function getPack(packId: string): PackDef | undefined {
  return PACK_BY_ID[packId];
}
