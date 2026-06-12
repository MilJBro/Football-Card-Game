import type { PlayerCardDef, Position, Tier, PackCategory } from '@/store/types';

// ============================================================================
// England World Cup internationals — 3 players per position (8 positions = 24).
// Each player has three era entries across Rising / Star / Legend tiers,
// representing their England career at different World Cups.
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

  // ── GK ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'shilton',
    playerName: 'Peter Shilton',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'England · 1982', positions: ['GK'], rating: 80 },
      Star:   { era: 'England · 1986', positions: ['GK'], rating: 85 },
      Legend: { era: 'England · 1990', positions: ['GK'], rating: 89 },
    },
  },
  {
    playerId: 'seaman',
    playerName: 'David Seaman',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'England · 1996', positions: ['GK'], rating: 78 },
      Star:   { era: 'England · 1998', positions: ['GK'], rating: 83 },
      Legend: { era: 'England · 2002', positions: ['GK'], rating: 87 },
    },
  },
  {
    playerId: 'pickford',
    playerName: 'Jordan Pickford',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'England · 2018', positions: ['GK'], rating: 76 },
      Star:   { era: 'England · 2021', positions: ['GK'], rating: 82 },
      Legend: { era: 'England · 2022', positions: ['GK'], rating: 86 },
    },
  },

  // ── RB ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'gneville',
    playerName: 'Gary Neville',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 1998', positions: ['RB'], rating: 75 },
      Star:   { era: 'England · 2002', positions: ['RB'], rating: 81 },
      Legend: { era: 'England · 2006', positions: ['RB'], rating: 85 },
    },
  },
  {
    playerId: 'gjohnson',
    playerName: 'Glen Johnson',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 2006', positions: ['RB'], rating: 73 },
      Star:   { era: 'England · 2010', positions: ['RB'], rating: 79 },
      Legend: { era: 'England · 2014', positions: ['RB'], rating: 82 },
    },
  },
  {
    playerId: 'trippier',
    playerName: 'Kieran Trippier',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 2018', positions: ['RB'], rating: 76 },
      Star:   { era: 'England · 2021', positions: ['RB'], rating: 82 },
      Legend: { era: 'England · 2022', positions: ['RB'], rating: 86 },
    },
  },

  // ── CB ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'bobbymoore',
    playerName: 'Bobby Moore',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 1962', positions: ['CB'], rating: 80 },
      Star:   { era: 'England · 1966', positions: ['CB'], rating: 88 },
      Legend: { era: 'England · 1970', positions: ['CB'], rating: 92 },
    },
  },
  {
    playerId: 'solcampbell',
    playerName: 'Sol Campbell',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 1998', positions: ['CB'], rating: 78 },
      Star:   { era: 'England · 2002', positions: ['CB'], rating: 84 },
      Legend: { era: 'England · 2006', positions: ['CB'], rating: 88 },
    },
  },
  {
    playerId: 'rioferd',
    playerName: 'Rio Ferdinand',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 1998', positions: ['CB'], rating: 78 },
      Star:   { era: 'England · 2002', positions: ['CB'], rating: 85 },
      Legend: { era: 'England · 2006', positions: ['CB'], rating: 90 },
    },
  },

  // ── LB ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'stuartpearce',
    playerName: 'Stuart Pearce',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 1986', positions: ['LB'], rating: 75 },
      Star:   { era: 'England · 1990', positions: ['LB'], rating: 82 },
      Legend: { era: 'England · 1996', positions: ['LB'], rating: 86 },
    },
  },
  {
    playerId: 'ashleycole',
    playerName: 'Ashley Cole',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 2002', positions: ['LB'], rating: 77 },
      Star:   { era: 'England · 2006', positions: ['LB'], rating: 85 },
      Legend: { era: 'England · 2010', positions: ['LB'], rating: 90 },
    },
  },
  {
    playerId: 'lukeshaw',
    playerName: 'Luke Shaw',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'England · 2018', positions: ['LB'], rating: 75 },
      Star:   { era: 'England · 2021', positions: ['LB'], rating: 82 },
      Legend: { era: 'England · 2022', positions: ['LB'], rating: 86 },
    },
  },

  // ── CM ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'bobbycharlton',
    playerName: 'Bobby Charlton',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'England · 1962', positions: ['CM'], rating: 82 },
      Star:   { era: 'England · 1966', positions: ['CM'], rating: 89 },
      Legend: { era: 'England · 1970', positions: ['CM'], rating: 93 },
    },
  },
  {
    playerId: 'gerrard',
    playerName: 'Steven Gerrard',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'England · 2004', positions: ['CM'], rating: 80 },
      Star:   { era: 'England · 2006', positions: ['CM'], rating: 87 },
      Legend: { era: 'England · 2010', positions: ['CM'], rating: 91 },
    },
  },
  {
    playerId: 'decrice',
    playerName: 'Declan Rice',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'England · 2022', positions: ['CM'], rating: 78 },
      Star:   { era: 'England · 2024', positions: ['CM'], rating: 84 },
      Legend: { era: 'England · 2026', positions: ['CM'], rating: 88 },
    },
  },

  // ── RW ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'beckham',
    playerName: 'David Beckham',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 1998', positions: ['RW'], rating: 78 },
      Star:   { era: 'England · 2002', positions: ['RW'], rating: 85 },
      Legend: { era: 'England · 2006', positions: ['RW'], rating: 89 },
    },
  },
  {
    playerId: 'saka',
    playerName: 'Bukayo Saka',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 2021', positions: ['RW'], rating: 79 },
      Star:   { era: 'England · 2022', positions: ['RW'], rating: 85 },
      Legend: { era: 'England · 2024', positions: ['RW'], rating: 89 },
    },
  },
  {
    playerId: 'foden',
    playerName: 'Phil Foden',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 2022', positions: ['RW'], rating: 80 },
      Star:   { era: 'England · 2024', positions: ['RW'], rating: 86 },
      Legend: { era: 'England · 2026', positions: ['RW'], rating: 90 },
    },
  },

  // ── LW ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'johnbarnes',
    playerName: 'John Barnes',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 1986', positions: ['LW'], rating: 78 },
      Star:   { era: 'England · 1990', positions: ['LW'], rating: 84 },
      Legend: { era: 'England · 1992', positions: ['LW'], rating: 88 },
    },
  },
  {
    playerId: 'sterling',
    playerName: 'Raheem Sterling',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 2016', positions: ['LW'], rating: 78 },
      Star:   { era: 'England · 2018', positions: ['LW'], rating: 84 },
      Legend: { era: 'England · 2022', positions: ['LW'], rating: 88 },
    },
  },
  {
    playerId: 'rashford',
    playerName: 'Marcus Rashford',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 2018', positions: ['LW'], rating: 77 },
      Star:   { era: 'England · 2022', positions: ['LW'], rating: 83 },
      Legend: { era: 'England · 2024', positions: ['LW'], rating: 87 },
    },
  },

  // ── ST ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'hurst',
    playerName: 'Geoff Hurst',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 1966', positions: ['ST'], rating: 82 },
      Star:   { era: 'England · 1970', positions: ['ST'], rating: 87 },
      Legend: { era: 'England · 1970', positions: ['ST'], rating: 91 },
    },
  },
  {
    playerId: 'lineker',
    playerName: 'Gary Lineker',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 1986', positions: ['ST'], rating: 81 },
      Star:   { era: 'England · 1990', positions: ['ST'], rating: 87 },
      Legend: { era: 'England · 1992', positions: ['ST'], rating: 90 },
    },
  },
  {
    playerId: 'rooney',
    playerName: 'Wayne Rooney',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'England · 2006', positions: ['ST'], rating: 80 },
      Star:   { era: 'England · 2010', positions: ['ST'], rating: 86 },
      Legend: { era: 'England · 2014', positions: ['ST'], rating: 89 },
    },
  },

];


// ---------------------------------------------------------------------------
// Build PlayerCardDef from the compact source data.
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
 *   Rising ≤ 86 · Star 87–89 · Legend ≥ 90
 */
export function getPool(pack: PlayerCardDef['pack'], tier: Tier): PlayerCardDef[] {
  const maxRating = (c: PlayerCardDef) => c.upgrades[1].rating;
  return ALL_CARDS.filter((c) => {
    if (c.pack !== pack) return false;
    const max = maxRating(c);
    if (tier === 'Legend') return max >= 90;
    if (tier === 'Star')   return max >= 87 && max <= 89;
    return max <= 86; // Rising
  });
}
