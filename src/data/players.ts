import type { PlayerCardDef, Position, Tier, PackCategory } from '@/store/types';

// ============================================================================
// Compact source data. Each player has three career-era entries (tiers).
// Positions and ratings evolve to tell the player's story:
//   Rising  = debut / breakthrough era
//   Star    = establishing greatness
//   Legend  = peak years (highest rating; 2nd position unlocked if applicable)
// Expanded into 960 PlayerCardDef cards below (320 players × 3 tiers).
// ============================================================================

interface TierSource {
  era: string;
  positions: Position[];
  rating: number;
}

interface PlayerSource {
  playerId: string;
  playerName: string;
  nationality: string;
  pack: PackCategory;
  tiers: Record<Tier, TierSource>;
}

const PLAYERS: PlayerSource[] = [
];


// ---------------------------------------------------------------------------
// One card per player — upgrade data embedded. (320 cards total)
// ---------------------------------------------------------------------------

function splitEra(era: string): { club: string; season: string } {
  const [club, season] = era.split(' · ');
  return { club: club ?? era, season: season ?? '' };
}

export const ALL_CARDS: PlayerCardDef[] = PLAYERS.map((p) => {
  const r = p.tiers.Rising;
  const s = p.tiers.Star;
  const l = p.tiers.Legend;
  const rBase = splitEra(r.era);
  const sSplit = splitEra(s.era);
  const lSplit = splitEra(l.era);
  const posChanged = (a: Position[], b: Position[]) => a.join(',') !== b.join(',');
  return {
    id: p.playerId,
    playerId: p.playerId,
    playerName: p.playerName,
    nationality: p.nationality,
    club: rBase.club,
    season: rBase.season,
    era: r.era,
    pack: p.pack,
    positions: r.positions,
    rating: r.rating,
    upgrades: [
      {
        rating: s.rating,
        club: sSplit.club,
        season: sSplit.season,
        era: s.era,
        ...(posChanged(r.positions, s.positions) && { positions: s.positions }),
      },
      {
        rating: l.rating,
        club: lSplit.club,
        season: lSplit.season,
        era: l.era,
        ...(posChanged(r.positions, l.positions) && { positions: l.positions }),
      },
    ],
  } satisfies PlayerCardDef;
});

// Fast lookup by card id (= playerId).
export const CARD_BY_ID: Record<string, PlayerCardDef> = Object.fromEntries(
  ALL_CARDS.map((c) => [c.id, c])
);

export function getCard(cardId: string): PlayerCardDef | undefined {
  return CARD_BY_ID[cardId];
}

/** Effective rating, positions, and era data for a card at a given upgrade level. */
export function getEffectiveCardData(card: PlayerCardDef, upgradeLevel: 0 | 1 | 2) {
  if (upgradeLevel === 0) {
    return { rating: card.rating, positions: card.positions, club: card.club, season: card.season, era: card.era };
  }
  const upg = card.upgrades[upgradeLevel - 1];
  return {
    rating: upg.rating,
    positions: upg.positions ?? card.positions,
    club: upg.club,
    season: upg.season,
    era: upg.era,
  };
}

/**
 * Pack draw pool — quality band is determined by the card's max (level-2) rating:
 *   Rising  ≤ 84 · Star 85–88 · Legend ≥ 89
 */
export function getPool(pack: PlayerCardDef['pack'], tier: Tier): PlayerCardDef[] {
  const maxRating = (c: PlayerCardDef) => c.upgrades[1].rating;
  return ALL_CARDS.filter((c) => {
    if (c.pack !== pack) return false;
    const max = maxRating(c);
    if (tier === 'Legend') return max >= 89;
    if (tier === 'Star')   return max >= 85 && max <= 88;
    return max <= 84; // Rising
  });
}
