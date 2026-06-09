import type { PackDef, Position, Tier } from '@/store/types';
import { getPool } from '@/data/players';

const TIERS: Tier[] = ['Rising', 'Star', 'Legend'];

/** Pick a card grade according to the pack's weighted odds. */
function pickTier(weights: Record<Tier, number>): Tier {
  const total = TIERS.reduce((sum, t) => sum + (weights[t] ?? 0), 0);
  let r = Math.random() * total;
  for (const t of TIERS) {
    r -= weights[t] ?? 0;
    if (r <= 0) return t;
  }
  return TIERS[TIERS.length - 1];
}

/**
 * Guaranteed position slots for DEF and ATT packs.
 * Every DEF pack always contains one RB, two CBs, and one LB.
 * Every ATT pack always contains one LW, two STs, and one RW.
 * GK and MID packs have no sub-positions so all four slots are free.
 */
const POSITION_SLOTS: Partial<Record<PackDef['pack'], (Position | null)[]>> = {
  DEF: ['RB', 'CB', 'CB', 'LB'],
  ATT: ['LW', 'ST', 'ST', 'RW'],
};

/** Draw one card for a given pack and optional position requirement. */
function drawOneCard(pack: PackDef, position: Position | null): string | null {
  const tier = pickTier(pack.weights);

  const positionPool = (t: Tier) => {
    const base = getPool(pack.pack, t);
    return position ? base.filter((c) => c.positions.includes(position)) : base;
  };

  let pool = positionPool(tier);

  // If the rolled tier has no cards for this position, try other tiers.
  if (pool.length === 0) {
    for (const t of TIERS) {
      const alt = positionPool(t);
      if (alt.length > 0) { pool = alt; break; }
    }
  }

  // Final fallback: ignore position constraint (shouldn't happen with real data).
  if (pool.length === 0) {
    for (const t of TIERS) {
      const alt = getPool(pack.pack, t);
      if (alt.length > 0) { pool = alt; break; }
    }
  }

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

/**
 * Draw cards for a pack.
 * DEF packs guarantee RB · CB · CB · LB.
 * ATT packs guarantee LW · ST · ST · RW.
 * GK and MID packs draw freely within their category.
 * Duplicates can still occur (which unlock foils).
 */
export function drawPack(pack: PackDef): string[] {
  const slots: (Position | null)[] =
    POSITION_SLOTS[pack.pack] ?? Array<Position | null>(pack.cardCount).fill(null);

  return slots
    .map((pos) => drawOneCard(pack, pos))
    .filter((id): id is string => id !== null);
}
