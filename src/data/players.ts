import type { PlayerCardDef, Position, Tier, PackCategory } from '@/store/types';

// ============================================================================
// Compact source data. Each player has three career-era entries (tiers).
// Positions and ratings evolve to tell the player's story:
//   Rising  = debut / breakthrough era (lower rating)
//   Star    = establishing greatness (mid rating)
//   Legend  = peak years (high rating, sometimes a 2nd position unlocked)
// Expanded into 90 PlayerCardDef cards below.
// ============================================================================

interface TierSource {
  era: string;
  positions: Position[];
  rating: number;
}

interface PlayerSource {
  playerId: string;
  playerName: string;
  pack: PackCategory;
  tiers: Record<Tier, TierSource>;
}

const PLAYERS: PlayerSource[] = [
  // ---------------------------------------------------------------- GK (6)
  {
    playerId: 'schmeichel',
    playerName: 'Peter Schmeichel',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Man Utd · 1991', positions: ['GK'], rating: 76 },
      Star: { era: 'Man Utd · 1994', positions: ['GK'], rating: 86 },
      Legend: { era: 'Man Utd · 1999', positions: ['GK'], rating: 92 },
    },
  },
  {
    playerId: 'cech',
    playerName: 'Petr Čech',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Chelsea · 2004', positions: ['GK'], rating: 78 },
      Star: { era: 'Chelsea · 2008', positions: ['GK'], rating: 87 },
      Legend: { era: 'Chelsea · 2012', positions: ['GK'], rating: 90 },
    },
  },
  {
    playerId: 'vandersar',
    playerName: 'Edwin van der Sar',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Fulham · 2001', positions: ['GK'], rating: 75 },
      Star: { era: 'Man Utd · 2006', positions: ['GK'], rating: 85 },
      Legend: { era: 'Man Utd · 2009', positions: ['GK'], rating: 90 },
    },
  },
  {
    playerId: 'seaman',
    playerName: 'David Seaman',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Arsenal · 1991', positions: ['GK'], rating: 74 },
      Star: { era: 'Arsenal · 1998', positions: ['GK'], rating: 84 },
      Legend: { era: 'Arsenal · 2002', positions: ['GK'], rating: 88 },
    },
  },
  {
    playerId: 'ederson',
    playerName: 'Ederson',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Man City · 2017', positions: ['GK'], rating: 79 },
      Star: { era: 'Man City · 2019', positions: ['GK'], rating: 86 },
      Legend: { era: 'Man City · 2023', positions: ['GK'], rating: 89 },
    },
  },
  {
    playerId: 'alisson',
    playerName: 'Alisson',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Liverpool · 2018', positions: ['GK'], rating: 80 },
      Star: { era: 'Liverpool · 2020', positions: ['GK'], rating: 87 },
      Legend: { era: 'Liverpool · 2022', positions: ['GK'], rating: 90 },
    },
  },

  // ---------------------------------------------------------------- DEF (8)
  {
    playerId: 'ferdinand',
    playerName: 'Rio Ferdinand',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'West Ham · 1998', positions: ['CB'], rating: 74 },
      Star: { era: 'Man Utd · 2004', positions: ['CB'], rating: 86 },
      Legend: { era: 'Man Utd · 2008', positions: ['CB'], rating: 90 },
    },
  },
  {
    playerId: 'terry',
    playerName: 'John Terry',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Chelsea · 2001', positions: ['CB'], rating: 73 },
      Star: { era: 'Chelsea · 2005', positions: ['CB'], rating: 86 },
      Legend: { era: 'Chelsea · 2009', positions: ['CB'], rating: 89 },
    },
  },
  {
    playerId: 'vandijk',
    playerName: 'Virgil van Dijk',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Southampton · 2015', positions: ['CB'], rating: 78 },
      Star: { era: 'Liverpool · 2018', positions: ['CB'], rating: 88 },
      Legend: { era: 'Liverpool · 2020', positions: ['CB'], rating: 91 },
    },
  },
  {
    playerId: 'vidic',
    playerName: 'Nemanja Vidić',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 2006', positions: ['CB'], rating: 75 },
      Star: { era: 'Man Utd · 2009', positions: ['CB'], rating: 85 },
      Legend: { era: 'Man Utd · 2011', positions: ['CB'], rating: 88 },
    },
  },
  {
    playerId: 'ashleycole',
    playerName: 'Ashley Cole',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Arsenal · 2002', positions: ['LB'], rating: 74 },
      Star: { era: 'Chelsea · 2007', positions: ['LB'], rating: 85 },
      Legend: { era: 'Chelsea · 2010', positions: ['LB'], rating: 88 },
    },
  },
  {
    playerId: 'gneville',
    playerName: 'Gary Neville',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 1995', positions: ['RB'], rating: 72 },
      Star: { era: 'Man Utd · 2000', positions: ['RB'], rating: 82 },
      Legend: { era: 'Man Utd · 2007', positions: ['RB'], rating: 85 },
    },
  },
  {
    playerId: 'taa',
    playerName: 'Trent Alexander-Arnold',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Liverpool · 2017', positions: ['RB'], rating: 76 },
      Star: { era: 'Liverpool · 2019', positions: ['RB'], rating: 85 },
      // Late-career midfield reinvention unlocks CM.
      Legend: { era: 'Liverpool · 2023', positions: ['RB', 'CM'], rating: 88 },
    },
  },
  {
    playerId: 'walker',
    playerName: 'Kyle Walker',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Tottenham · 2012', positions: ['RB'], rating: 74 },
      Star: { era: 'Tottenham · 2016', positions: ['RB'], rating: 83 },
      Legend: { era: 'Man City · 2019', positions: ['RB'], rating: 86 },
    },
  },

  // ---------------------------------------------------------------- MID (8) — CM only
  {
    playerId: 'gerrard',
    playerName: 'Steven Gerrard',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Liverpool · 2000', positions: ['CM'], rating: 76 },
      Star: { era: 'Liverpool · 2005', positions: ['CM'], rating: 88 },
      Legend: { era: 'Liverpool · 2009', positions: ['CM'], rating: 91 },
    },
  },
  {
    playerId: 'lampard',
    playerName: 'Frank Lampard',
    pack: 'MID',
    tiers: {
      Rising: { era: 'West Ham · 2000', positions: ['CM'], rating: 74 },
      Star: { era: 'Chelsea · 2005', positions: ['CM'], rating: 87 },
      Legend: { era: 'Chelsea · 2010', positions: ['CM'], rating: 90 },
    },
  },
  {
    playerId: 'scholes',
    playerName: 'Paul Scholes',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man Utd · 1996', positions: ['CM'], rating: 75 },
      Star: { era: 'Man Utd · 2001', positions: ['CM'], rating: 86 },
      Legend: { era: 'Man Utd · 2007', positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'keane',
    playerName: 'Roy Keane',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Nottm Forest · 1992', positions: ['CM'], rating: 74 },
      Star: { era: 'Man Utd · 1997', positions: ['CM'], rating: 86 },
      Legend: { era: 'Man Utd · 2000', positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'vieira',
    playerName: 'Patrick Vieira',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Arsenal · 1997', positions: ['CM'], rating: 75 },
      Star: { era: 'Arsenal · 2001', positions: ['CM'], rating: 86 },
      Legend: { era: 'Arsenal · 2004', positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'yayatoure',
    playerName: 'Yaya Touré',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man City · 2010', positions: ['CM'], rating: 78 },
      Star: { era: 'Man City · 2012', positions: ['CM'], rating: 86 },
      Legend: { era: 'Man City · 2014', positions: ['CM'], rating: 88 },
    },
  },
  {
    playerId: 'debruyne',
    playerName: 'Kevin De Bruyne',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Chelsea · 2013', positions: ['CM'], rating: 75 },
      Star: { era: 'Man City · 2017', positions: ['CM'], rating: 88 },
      Legend: { era: 'Man City · 2020', positions: ['CM'], rating: 91 },
    },
  },
  {
    playerId: 'kante',
    playerName: "N'Golo Kanté",
    pack: 'MID',
    tiers: {
      Rising: { era: 'Leicester · 2016', positions: ['CM'], rating: 79 },
      Star: { era: 'Chelsea · 2017', positions: ['CM'], rating: 87 },
      Legend: { era: 'Chelsea · 2021', positions: ['CM'], rating: 89 },
    },
  },

  // ---------------------------------------------------------------- ATT (8) — RW/LW/ST
  {
    playerId: 'rooney',
    playerName: 'Wayne Rooney',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Everton · 2002', positions: ['ST'], rating: 75 },
      Star: { era: 'Man Utd · 2005', positions: ['ST'], rating: 85 },
      // Dropped into midfield late career → CM unlocked alongside ST.
      Legend: { era: 'Man Utd · 2011', positions: ['ST', 'CM'], rating: 90 },
    },
  },
  {
    playerId: 'henry',
    playerName: 'Thierry Henry',
    pack: 'ATT',
    tiers: {
      // Started wide before being converted to a centre-forward.
      Rising: { era: 'Arsenal · 1999', positions: ['LW'], rating: 78 },
      Star: { era: 'Arsenal · 2002', positions: ['ST', 'LW'], rating: 89 },
      Legend: { era: 'Arsenal · 2004', positions: ['ST', 'LW'], rating: 93 },
    },
  },
  {
    playerId: 'salah',
    playerName: 'Mohamed Salah',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Chelsea · 2014', positions: ['RW'], rating: 74 },
      Star: { era: 'Liverpool · 2018', positions: ['RW'], rating: 88 },
      // False-9 / central role unlocks ST.
      Legend: { era: 'Liverpool · 2023', positions: ['RW', 'ST'], rating: 91 },
    },
  },
  {
    playerId: 'ronaldo',
    playerName: 'Cristiano Ronaldo',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 2004', positions: ['RW'], rating: 79 },
      Star: { era: 'Man Utd · 2007', positions: ['RW', 'LW'], rating: 90 },
      Legend: { era: 'Man Utd · 2008', positions: ['RW', 'ST'], rating: 93 },
    },
  },
  {
    playerId: 'aguero',
    playerName: 'Sergio Agüero',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man City · 2011', positions: ['ST'], rating: 80 },
      Star: { era: 'Man City · 2015', positions: ['ST'], rating: 88 },
      Legend: { era: 'Man City · 2018', positions: ['ST'], rating: 90 },
    },
  },
  {
    playerId: 'shearer',
    playerName: 'Alan Shearer',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Southampton · 1992', positions: ['ST'], rating: 77 },
      Star: { era: 'Blackburn · 1995', positions: ['ST'], rating: 89 },
      Legend: { era: 'Newcastle · 1997', positions: ['ST'], rating: 91 },
    },
  },
  {
    playerId: 'kane',
    playerName: 'Harry Kane',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Tottenham · 2014', positions: ['ST'], rating: 78 },
      Star: { era: 'Tottenham · 2017', positions: ['ST'], rating: 88 },
      // Deep-lying playmaking forward unlocks CM.
      Legend: { era: 'Tottenham · 2021', positions: ['ST', 'CM'], rating: 90 },
    },
  },
  {
    playerId: 'son',
    playerName: 'Son Heung-min',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Tottenham · 2015', positions: ['LW'], rating: 77 },
      Star: { era: 'Tottenham · 2019', positions: ['LW', 'ST'], rating: 86 },
      Legend: { era: 'Tottenham · 2022', positions: ['LW', 'ST'], rating: 89 },
    },
  },
];

// ---------------------------------------------------------------------------
// Expand the source into the flat card list (90 cards).
// ---------------------------------------------------------------------------

const TIER_ORDER: Tier[] = ['Rising', 'Star', 'Legend'];

export const ALL_CARDS: PlayerCardDef[] = PLAYERS.flatMap((p) =>
  TIER_ORDER.map((tier) => {
    const t = p.tiers[tier];
    return {
      id: `${p.playerId}-${tier.toLowerCase()}`,
      playerId: p.playerId,
      playerName: p.playerName,
      era: t.era,
      pack: p.pack,
      tier,
      positions: t.positions,
      rating: t.rating,
    } satisfies PlayerCardDef;
  })
);

// Fast lookup by card id.
export const CARD_BY_ID: Record<string, PlayerCardDef> = Object.fromEntries(
  ALL_CARDS.map((c) => [c.id, c])
);

export function getCard(cardId: string): PlayerCardDef | undefined {
  return CARD_BY_ID[cardId];
}

/** All cards in a given pack category + tier (the pool a pack draws from). */
export function getPool(pack: PlayerCardDef['pack'], tier: Tier): PlayerCardDef[] {
  return ALL_CARDS.filter((c) => c.pack === pack && c.tier === tier);
}
