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

/**
 * Draw one card for a given slot.
 *
 * Priority order:
 *   1. Correct tier + correct position + not yet owned + not drawn this pack
 *   2. Any tier  + correct position + not yet owned + not drawn this pack
 *   3. Correct tier + correct position + not drawn this pack (allow owned)
 *   4. Any tier  + correct position + not drawn this pack
 *   5. Any tier  + correct position (allow intra-pack duplicate as last resort)
 *   6. Any tier  + any position    (fallback if position pool is completely empty)
 */
function drawOneCard(
  pack: PackDef,
  position: Position | null,
  ownedIds: Set<string>,
  drawnThisPack: Set<string>,
): string | null {
  const tier = pickTier(pack.weights);

  // Returns candidates from a tier matching position, with optional exclusion sets.
  const candidates = (t: Tier, excludeOwned: boolean, excludeDrawn: boolean) => {
    const base = getPool(pack.pack, t);
    let pool = position ? base.filter((c) => c.positions.includes(position)) : base;
    if (excludeOwned) pool = pool.filter((c) => !ownedIds.has(c.id));
    if (excludeDrawn) pool = pool.filter((c) => !drawnThisPack.has(c.id));
    return pool;
  };

  // Try each fallback level in priority order.
  const attempts: Array<[Tier | null, boolean, boolean]> = [
    [tier, true,  true ],  // rolled tier, unowned, not drawn this pack
    [null, true,  true ],  // any tier,    unowned, not drawn this pack
    [tier, false, true ],  // rolled tier, allow owned, not drawn this pack
    [null, false, true ],  // any tier,    allow owned, not drawn this pack
    [null, false, false],  // allow anything (intra-pack dupe — last resort)
  ];

  for (const [t, exOwned, exDrawn] of attempts) {
    const pool = t !== null
      ? candidates(t, exOwned, exDrawn)
      : TIERS.flatMap((x) => candidates(x, exOwned, exDrawn));

    if (pool.length === 0) continue;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    drawnThisPack.add(pick.id);
    return pick.id;
  }

  // Final safety: any card in this pack category.
  for (const t of TIERS) {
    const fallback = getPool(pack.pack, t);
    if (fallback.length > 0) {
      const pick = fallback[Math.floor(Math.random() * fallback.length)];
      drawnThisPack.add(pick.id);
      return pick.id;
    }
  }

  return null;
}

/**
 * Draw cards for a pack.
 *
 * Pass the player's current owned-card IDs so the draw prefers cards they
 * don't already have. Cards already owned can still appear (which unlocks
 * foils) but only once other options are exhausted.
 *
 * DEF packs guarantee RB · CB · CB · LB.
 * ATT packs guarantee LW · ST · ST · RW.
 * GK and MID packs draw freely within their category.
 */
export function drawPack(pack: PackDef, ownedCardIds: Set<string> = new Set()): string[] {
  const slots: (Position | null)[] =
    POSITION_SLOTS[pack.pack] ?? Array<Position | null>(pack.cardCount).fill(null);

  const drawnThisPack = new Set<string>();

  return slots
    .map((pos) => drawOneCard(pack, pos, ownedCardIds, drawnThisPack))
    .filter((id): id is string => id !== null);
}
