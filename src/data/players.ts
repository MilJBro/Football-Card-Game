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

  // ── GK ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'schmeichel',
    playerName: 'Peter Schmeichel',
    nationality: 'Denmark',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Man Utd · 1993', positions: ['GK'], rating: 82 },
      Star:   { era: 'Man Utd · 1996', positions: ['GK'], rating: 88 },
      Legend: { era: 'Man Utd · 1999', positions: ['GK'], rating: 92 },
    },
  },
  {
    playerId: 'davidseaman',
    playerName: 'David Seaman',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Arsenal · 1993', positions: ['GK'], rating: 80 },
      Star:   { era: 'Arsenal · 1998', positions: ['GK'], rating: 84 },
      Legend: { era: 'Arsenal · 2002', positions: ['GK'], rating: 88 },
    },
  },
  {
    playerId: 'petrcech',
    playerName: 'Petr Čech',
    nationality: 'Czech Republic',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Chelsea · 2005', positions: ['GK'], rating: 82 },
      Star:   { era: 'Chelsea · 2008', positions: ['GK'], rating: 87 },
      Legend: { era: 'Chelsea · 2012', positions: ['GK'], rating: 91 },
    },
  },

  // ── RB ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'garyneville',
    playerName: 'Gary Neville',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 1996', positions: ['RB'], rating: 76 },
      Star:   { era: 'Man Utd · 2000', positions: ['RB'], rating: 82 },
      Legend: { era: 'Man Utd · 2006', positions: ['RB'], rating: 86 },
    },
  },
  {
    playerId: 'zabaleta',
    playerName: 'Pablo Zabaleta',
    nationality: 'Argentina',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man City · 2009', positions: ['RB'], rating: 74 },
      Star:   { era: 'Man City · 2012', positions: ['RB'], rating: 82 },
      Legend: { era: 'Man City · 2014', positions: ['RB'], rating: 85 },
    },
  },
  {
    playerId: 'trentaa',
    playerName: 'Trent Alexander-Arnold',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Liverpool · 2018', positions: ['RB'], rating: 79 },
      Star:   { era: 'Liverpool · 2020', positions: ['RB'], rating: 86 },
      Legend: { era: 'Liverpool · 2022', positions: ['RB'], rating: 89 },
    },
  },

  // ── CB ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'rioferd',
    playerName: 'Rio Ferdinand',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Leeds · 2001',    positions: ['CB'], rating: 80 },
      Star:   { era: 'Man Utd · 2004',  positions: ['CB'], rating: 88 },
      Legend: { era: 'Man Utd · 2009',  positions: ['CB'], rating: 91 },
    },
  },
  {
    playerId: 'johnterry',
    playerName: 'John Terry',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Chelsea · 2002', positions: ['CB'], rating: 78 },
      Star:   { era: 'Chelsea · 2006', positions: ['CB'], rating: 87 },
      Legend: { era: 'Chelsea · 2010', positions: ['CB'], rating: 91 },
    },
  },
  {
    playerId: 'vandijk',
    playerName: 'Virgil van Dijk',
    nationality: 'Netherlands',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Southampton · 2016', positions: ['CB'], rating: 78 },
      Star:   { era: 'Liverpool · 2019',   positions: ['CB'], rating: 88 },
      Legend: { era: 'Liverpool · 2020',   positions: ['CB'], rating: 92 },
    },
  },

  // ── LB ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'ashleycole',
    playerName: 'Ashley Cole',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Arsenal · 2002', positions: ['LB'], rating: 78 },
      Star:   { era: 'Arsenal · 2004', positions: ['LB'], rating: 86 },
      Legend: { era: 'Chelsea · 2010', positions: ['LB'], rating: 91 },
    },
  },
  {
    playerId: 'patricevra',
    playerName: 'Patrice Evra',
    nationality: 'France',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 2007', positions: ['LB'], rating: 76 },
      Star:   { era: 'Man Utd · 2009', positions: ['LB'], rating: 83 },
      Legend: { era: 'Man Utd · 2013', positions: ['LB'], rating: 87 },
    },
  },
  {
    playerId: 'andrewrobertson',
    playerName: 'Andrew Robertson',
    nationality: 'Scotland',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Liverpool · 2018', positions: ['LB'], rating: 78 },
      Star:   { era: 'Liverpool · 2019', positions: ['LB'], rating: 86 },
      Legend: { era: 'Liverpool · 2020', positions: ['LB'], rating: 89 },
    },
  },

  // ── CM ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'paulscholes',
    playerName: 'Paul Scholes',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man Utd · 1996', positions: ['CM'], rating: 79 },
      Star:   { era: 'Man Utd · 2001', positions: ['CM'], rating: 87 },
      Legend: { era: 'Man Utd · 2009', positions: ['CM'], rating: 91 },
    },
  },
  {
    playerId: 'stevengerrard',
    playerName: 'Steven Gerrard',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Liverpool · 2001', positions: ['CM'], rating: 81 },
      Star:   { era: 'Liverpool · 2006', positions: ['CM'], rating: 89 },
      Legend: { era: 'Liverpool · 2009', positions: ['CM'], rating: 92 },
    },
  },
  {
    playerId: 'franklampard',
    playerName: 'Frank Lampard',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Chelsea · 2002', positions: ['CM'], rating: 80 },
      Star:   { era: 'Chelsea · 2006', positions: ['CM'], rating: 88 },
      Legend: { era: 'Chelsea · 2010', positions: ['CM'], rating: 91 },
    },
  },

  // ── RW ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'davidbeckham',
    playerName: 'David Beckham',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 1996', positions: ['RW'], rating: 78 },
      Star:   { era: 'Man Utd · 1999', positions: ['RW'], rating: 87 },
      Legend: { era: 'Man Utd · 2001', positions: ['RW'], rating: 89 },
    },
  },
  {
    playerId: 'salah',
    playerName: 'Mohamed Salah',
    nationality: 'Egypt',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Liverpool · 2018', positions: ['RW'], rating: 83 },
      Star:   { era: 'Liverpool · 2020', positions: ['RW'], rating: 89 },
      Legend: { era: 'Liverpool · 2022', positions: ['RW'], rating: 93 },
    },
  },
  {
    playerId: 'ronaldo',
    playerName: 'Cristiano Ronaldo',
    nationality: 'Portugal',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 2004', positions: ['RW'], rating: 79 },
      Star:   { era: 'Man Utd · 2007', positions: ['RW'], rating: 89 },
      Legend: { era: 'Man Utd · 2008', positions: ['RW'], rating: 93 },
    },
  },

  // ── LW ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'ryangiggs',
    playerName: 'Ryan Giggs',
    nationality: 'Wales',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 1994', positions: ['LW'], rating: 82 },
      Star:   { era: 'Man Utd · 1999', positions: ['LW'], rating: 89 },
      Legend: { era: 'Man Utd · 2008', positions: ['LW'], rating: 90 },
    },
  },
  {
    playerId: 'edenhazard',
    playerName: 'Eden Hazard',
    nationality: 'Belgium',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Chelsea · 2013', positions: ['LW'], rating: 82 },
      Star:   { era: 'Chelsea · 2015', positions: ['LW'], rating: 89 },
      Legend: { era: 'Chelsea · 2019', positions: ['LW'], rating: 92 },
    },
  },
  {
    playerId: 'sadiomane',
    playerName: 'Sadio Mané',
    nationality: 'Senegal',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Liverpool · 2017', positions: ['LW'], rating: 81 },
      Star:   { era: 'Liverpool · 2019', positions: ['LW'], rating: 89 },
      Legend: { era: 'Liverpool · 2020', positions: ['LW'], rating: 91 },
    },
  },

  // ── ST ──────────────────────────────────────────────────────────────────────
  {
    playerId: 'alanshearer',
    playerName: 'Alan Shearer',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Blackburn · 1995', positions: ['ST'], rating: 82 },
      Star:   { era: 'Newcastle · 1997', positions: ['ST'], rating: 88 },
      Legend: { era: 'Newcastle · 2002', positions: ['ST'], rating: 91 },
    },
  },
  {
    playerId: 'thierryhenry',
    playerName: 'Thierry Henry',
    nationality: 'France',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Arsenal · 2000', positions: ['ST'], rating: 83 },
      Star:   { era: 'Arsenal · 2002', positions: ['ST'], rating: 90 },
      Legend: { era: 'Arsenal · 2004', positions: ['ST'], rating: 94 },
    },
  },
  {
    playerId: 'waynerooney',
    playerName: 'Wayne Rooney',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Everton · 2004',   positions: ['ST'], rating: 80 },
      Star:   { era: 'Man Utd · 2008',   positions: ['ST'], rating: 88 },
      Legend: { era: 'Man Utd · 2012',   positions: ['ST'], rating: 91 },
    },
  },

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
