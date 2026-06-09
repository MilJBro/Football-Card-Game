import type { PackDef, Tier } from '@/store/types';
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
 * Draw cards for a pack. Each card independently rolls a grade from the pack's
 * weighted odds, then a random player of that grade in the pack's position.
 * Duplicates can occur (which unlock foils).
 */
export function drawPack(pack: PackDef): string[] {
  const drawn: string[] = [];

  for (let i = 0; i < pack.cardCount; i++) {
    let tier = pickTier(pack.weights);
    let pool = getPool(pack.pack, tier);

    // Fallback if a grade somehow has no cards for this position.
    if (pool.length === 0) {
      for (const t of TIERS) {
        const alt = getPool(pack.pack, t);
        if (alt.length > 0) {
          tier = t;
          pool = alt;
          break;
        }
      }
    }
    if (pool.length === 0) continue;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    drawn.push(pick.id);
  }

  return drawn;
}
