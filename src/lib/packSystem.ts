import type { PackDef } from '@/store/types';
import { getPool } from '@/data/players';

/**
 * Draw cards for a pack. All cards come from the pack's (category, tier) pool.
 * The first cards are drawn without replacement to guarantee variety; the last
 * two are pure random so duplicates can occur (which unlock foils).
 */
export function drawPack(pack: PackDef): string[] {
  const pool = getPool(pack.pack, pack.tier);
  if (pool.length === 0) return [];

  const drawn: string[] = [];

  // Shuffle a copy for the no-replacement portion.
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const guaranteedUnique = Math.min(pack.cardCount - 2, pool.length);
  for (let i = 0; i < guaranteedUnique; i++) {
    drawn.push(shuffled[i].id);
  }

  // Remaining slots: pure random from the full pool (duplicates allowed).
  while (drawn.length < pack.cardCount) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    drawn.push(pick.id);
  }

  return drawn;
}
