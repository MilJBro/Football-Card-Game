import type { Position, PositionCategory, Squad } from '@/store/types';
import { getCard } from '@/data/players';
import { getFormation } from '@/data/formations';

// ---------------------------------------------------------------------------
// Position categories & out-of-position penalty.
// ---------------------------------------------------------------------------

export function categoryOf(pos: Position): PositionCategory {
  if (pos === 'GK') return 'GK';
  if (pos === 'RB' || pos === 'CB' || pos === 'LB') return 'DEF';
  if (pos === 'CM') return 'MID';
  return 'ATT'; // RW, LW, ST
}

// Outfield category ordering for adjacency distance.
const CATEGORY_INDEX: Record<PositionCategory, number> = {
  GK: 0,
  DEF: 1,
  MID: 2,
  ATT: 3,
};

export const PENALTY = {
  natural: 0,
  sameCategory: 4,
  adjacentCategory: 8,
  farCategory: 15,
  goalkeeperMismatch: 25,
} as const;

/** Penalty for playing a single natural position in a given slot position. */
function penaltyForPosition(cardPos: Position, slotPos: Position): number {
  if (cardPos === slotPos) return PENALTY.natural;

  const cardCat = categoryOf(cardPos);
  const slotCat = categoryOf(slotPos);

  // Any mismatch involving goalkeeping is severe.
  if (cardCat === 'GK' || slotCat === 'GK') return PENALTY.goalkeeperMismatch;

  if (cardCat === slotCat) return PENALTY.sameCategory;

  const distance = Math.abs(CATEGORY_INDEX[cardCat] - CATEGORY_INDEX[slotCat]);
  return distance === 1 ? PENALTY.adjacentCategory : PENALTY.farCategory;
}

/** Best (smallest) penalty for a dual-position card placed in a slot. */
export function penaltyForCardInSlot(cardPositions: Position[], slotPos: Position): number {
  return Math.min(...cardPositions.map((p) => penaltyForPosition(p, slotPos)));
}

export interface SlotEvaluation {
  slotId: string;
  cardId: string | null;
  baseRating: number;
  penalty: number;
  effectiveRating: number;
  outOfPosition: boolean;
}

/** Evaluate every slot of a squad, applying out-of-position penalties. */
export function evaluateSquad(squad: Squad): SlotEvaluation[] {
  const formation = getFormation(squad.formation);
  return formation.slots.map((slot) => {
    const cardId = squad.assignments[slot.slotId] ?? null;
    if (!cardId) {
      return {
        slotId: slot.slotId,
        cardId: null,
        baseRating: 0,
        penalty: 0,
        effectiveRating: 0,
        outOfPosition: false,
      };
    }
    const card = getCard(cardId);
    if (!card) {
      return {
        slotId: slot.slotId,
        cardId,
        baseRating: 0,
        penalty: 0,
        effectiveRating: 0,
        outOfPosition: false,
      };
    }
    const penalty = penaltyForCardInSlot(card.positions, slot.naturalPosition);
    const effectiveRating = Math.max(1, card.rating - penalty);
    return {
      slotId: slot.slotId,
      cardId,
      baseRating: card.rating,
      penalty,
      effectiveRating,
      outOfPosition: penalty > 0,
    };
  });
}

export interface SquadSummary {
  rating: number; // average effective rating (0 if no players)
  filledSlots: number;
  totalSlots: number;
  isComplete: boolean;
  evaluations: SlotEvaluation[];
  attackRating: number;
  defenceRating: number;
}

/** Average effective rating across the 11 slots, plus attack/defence splits. */
export function summariseSquad(squad: Squad): SquadSummary {
  const evaluations = evaluateSquad(squad);
  const formation = getFormation(squad.formation);
  const totalSlots = formation.slots.length;

  const filled = evaluations.filter((e) => e.cardId);
  const filledSlots = filled.length;

  const sum = filled.reduce((acc, e) => acc + e.effectiveRating, 0);
  const rating = filledSlots > 0 ? Math.round(sum / totalSlots) : 0;

  // Attack = ATT + MID slots; Defence = GK + DEF + MID slots. Midfield counts
  // toward both. Used by the season simulation to weight goals for/against.
  const attackVals: number[] = [];
  const defenceVals: number[] = [];
  evaluations.forEach((e, i) => {
    if (!e.cardId) return;
    const cat = categoryOf(formation.slots[i].naturalPosition);
    if (cat === 'ATT' || cat === 'MID') attackVals.push(e.effectiveRating);
    if (cat === 'GK' || cat === 'DEF' || cat === 'MID') defenceVals.push(e.effectiveRating);
  });
  const avg = (arr: number[]) =>
    arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : rating;

  return {
    rating,
    filledSlots,
    totalSlots,
    isComplete: filledSlots === totalSlots,
    evaluations,
    attackRating: avg(attackVals),
    defenceRating: avg(defenceVals),
  };
}

/** Create an empty squad for a formation. */
export function emptySquad(formation: Squad['formation']): Squad {
  const f = getFormation(formation);
  const assignments: Record<string, string | null> = {};
  f.slots.forEach((s) => {
    assignments[s.slotId] = null;
  });
  return { formation, assignments };
}
