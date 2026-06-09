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

/** Draw one card, excluding cards already drawn in this same pack. */
function drawOneCard(
  pack: PackDef,
  position: Position | null,
  drawnThisPack: Set<string>,
): string | null {
  const tier = pickTier(pack.weights);

  const pool = (t: Tier) => {
    const base = getPool(pack.pack, t);
    const pos = position ? base.filter((c) => c.positions.includes(position)) : base;
    return pos.filter((c) => !drawnThisPack.has(c.id));
  };

  // Try rolled tier first, then fall back through others.
  let candidates = pool(tier);
  if (candidates.length === 0) {
    for (const t of TIERS) {
      candidates = pool(t);
      if (candidates.length > 0) break;
    }
  }

  // Last resort: allow intra-pack duplicate if position pool is tiny.
  if (candidates.length === 0) {
    const base = getPool(pack.pack, tier);
    candidates = position ? base.filter((c) => c.positions.includes(position)) : base;
    for (const t of TIERS) {
      if (candidates.length > 0) break;
      const alt = getPool(pack.pack, t);
      candidates = position ? alt.filter((c) => c.positions.includes(position)) : alt;
    }
  }

  if (candidates.length === 0) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  drawnThisPack.add(pick.id);
  return pick.id;
}

/**
 * Draw cards for a pack.
 * No player appears twice in the same pack, but the same player can
 * show up in different packs — duplicates unlock foils.
 *
 * DEF packs guarantee RB · CB · CB · LB.
 * ATT packs guarantee LW · ST · ST · RW.
 * GK and MID packs draw freely within their category.
 */
export function drawPack(pack: PackDef): string[] {
  const slots: (Position | null)[] =
    POSITION_SLOTS[pack.pack] ?? Array<Position | null>(pack.cardCount).fill(null);

  const drawnThisPack = new Set<string>();

  return slots
    .map((pos) => drawOneCard(pack, pos, drawnThisPack))
    .filter((id): id is string => id !== null);
}
