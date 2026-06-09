import type { PlayerCardDef, Position, Tier, PackCategory } from '@/store/types';

// ============================================================================
// Compact source data. Each player has three career-era entries (tiers).
// Positions and ratings evolve to tell the player's story:
//   Rising  = debut / breakthrough era
//   Star    = establishing greatness
//   Legend  = peak years (highest rating; 2nd position unlocked if applicable)
// Expanded into 150 PlayerCardDef cards below (50 players × 3 tiers).
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

  // ---- GK (8) ---------------------------------------------------------------

  {
    playerId: 'schmeichel',
    playerName: 'Peter Schmeichel',
    nationality: 'Denmark',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Man Utd · 1991', positions: ['GK'], rating: 76 },
      Star:   { era: 'Man Utd · 1994', positions: ['GK'], rating: 86 },
      Legend: { era: 'Man Utd · 1999', positions: ['GK'], rating: 92 },
    },
  },
  {
    playerId: 'cech',
    playerName: 'Petr Čech',
    nationality: 'Czech Republic',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Chelsea · 2004', positions: ['GK'], rating: 78 },
      Star:   { era: 'Chelsea · 2008', positions: ['GK'], rating: 87 },
      Legend: { era: 'Chelsea · 2012', positions: ['GK'], rating: 90 },
    },
  },
  {
    playerId: 'vandersar',
    playerName: 'Edwin van der Sar',
    nationality: 'Netherlands',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Fulham · 2001',   positions: ['GK'], rating: 75 },
      Star:   { era: 'Man Utd · 2006',  positions: ['GK'], rating: 85 },
      Legend: { era: 'Man Utd · 2009',  positions: ['GK'], rating: 90 },
    },
  },
  {
    playerId: 'seaman',
    playerName: 'David Seaman',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Arsenal · 1991', positions: ['GK'], rating: 74 },
      Star:   { era: 'Arsenal · 1998', positions: ['GK'], rating: 84 },
      Legend: { era: 'Arsenal · 2002', positions: ['GK'], rating: 88 },
    },
  },
  {
    playerId: 'ederson',
    playerName: 'Ederson',
    nationality: 'Brazil',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Man City · 2017', positions: ['GK'], rating: 79 },
      Star:   { era: 'Man City · 2019', positions: ['GK'], rating: 86 },
      Legend: { era: 'Man City · 2023', positions: ['GK'], rating: 89 },
    },
  },
  {
    playerId: 'alisson',
    playerName: 'Alisson',
    nationality: 'Brazil',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Liverpool · 2018', positions: ['GK'], rating: 80 },
      Star:   { era: 'Liverpool · 2020', positions: ['GK'], rating: 87 },
      Legend: { era: 'Liverpool · 2022', positions: ['GK'], rating: 90 },
    },
  },
  {
    playerId: 'hart',
    playerName: 'Joe Hart',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Man City · 2010', positions: ['GK'], rating: 76 },
      Star:   { era: 'Man City · 2012', positions: ['GK'], rating: 84 },
      Legend: { era: 'Man City · 2014', positions: ['GK'], rating: 86 },
    },
  },
  {
    playerId: 'shaygiven',
    playerName: 'Shay Given',
    nationality: 'Ireland',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Newcastle · 1998', positions: ['GK'], rating: 74 },
      Star:   { era: 'Newcastle · 2002', positions: ['GK'], rating: 82 },
      Legend: { era: 'Newcastle · 2006', positions: ['GK'], rating: 84 },
    },
  },

  // ---- DEF (13) -------------------------------------------------------------

  {
    playerId: 'ferdinand',
    playerName: 'Rio Ferdinand',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'West Ham · 1998', positions: ['CB'], rating: 74 },
      Star:   { era: 'Man Utd · 2004',  positions: ['CB'], rating: 86 },
      Legend: { era: 'Man Utd · 2008',  positions: ['CB'], rating: 90 },
    },
  },
  {
    playerId: 'terry',
    playerName: 'John Terry',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Chelsea · 2001', positions: ['CB'], rating: 73 },
      Star:   { era: 'Chelsea · 2005', positions: ['CB'], rating: 86 },
      Legend: { era: 'Chelsea · 2009', positions: ['CB'], rating: 89 },
    },
  },
  {
    playerId: 'vandijk',
    playerName: 'Virgil van Dijk',
    nationality: 'Netherlands',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Southampton · 2015', positions: ['CB'], rating: 78 },
      Star:   { era: 'Liverpool · 2018',   positions: ['CB'], rating: 88 },
      Legend: { era: 'Liverpool · 2020',   positions: ['CB'], rating: 91 },
    },
  },
  {
    playerId: 'vidic',
    playerName: 'Nemanja Vidić',
    nationality: 'Serbia',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 2006', positions: ['CB'], rating: 75 },
      Star:   { era: 'Man Utd · 2009', positions: ['CB'], rating: 85 },
      Legend: { era: 'Man Utd · 2011', positions: ['CB'], rating: 88 },
    },
  },
  {
    playerId: 'ashleycole',
    playerName: 'Ashley Cole',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Arsenal · 2002', positions: ['LB'], rating: 74 },
      Star:   { era: 'Chelsea · 2007', positions: ['LB'], rating: 85 },
      Legend: { era: 'Chelsea · 2010', positions: ['LB'], rating: 88 },
    },
  },
  {
    playerId: 'gneville',
    playerName: 'Gary Neville',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 1995', positions: ['RB'], rating: 72 },
      Star:   { era: 'Man Utd · 2000', positions: ['RB'], rating: 82 },
      Legend: { era: 'Man Utd · 2007', positions: ['RB'], rating: 85 },
    },
  },
  {
    playerId: 'taa',
    playerName: 'Trent Alexander-Arnold',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Liverpool · 2017', positions: ['RB'],        rating: 76 },
      Star:   { era: 'Liverpool · 2019', positions: ['RB'],        rating: 85 },
      Legend: { era: 'Liverpool · 2023', positions: ['RB', 'CM'], rating: 88 },
    },
  },
  {
    playerId: 'walker',
    playerName: 'Kyle Walker',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Tottenham · 2012', positions: ['RB'], rating: 74 },
      Star:   { era: 'Tottenham · 2016', positions: ['RB'], rating: 83 },
      Legend: { era: 'Man City · 2019',  positions: ['RB'], rating: 86 },
    },
  },
  {
    playerId: 'solcampbell',
    playerName: 'Sol Campbell',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Tottenham · 1994', positions: ['CB'], rating: 73 },
      Star:   { era: 'Tottenham · 1999', positions: ['CB'], rating: 84 },
      Legend: { era: 'Arsenal · 2004',   positions: ['CB'], rating: 89 },
    },
  },
  {
    playerId: 'ledleyking',
    playerName: 'Ledley King',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Tottenham · 2002', positions: ['CB'], rating: 74 },
      Star:   { era: 'Tottenham · 2006', positions: ['CB'], rating: 84 },
      Legend: { era: 'Tottenham · 2010', positions: ['CB'], rating: 86 },
    },
  },
  {
    playerId: 'baines',
    playerName: 'Leighton Baines',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Everton · 2007', positions: ['LB'], rating: 73 },
      Star:   { era: 'Everton · 2010', positions: ['LB'], rating: 82 },
      Legend: { era: 'Everton · 2013', positions: ['LB'], rating: 85 },
    },
  },
  {
    playerId: 'evra',
    playerName: 'Patrice Evra',
    nationality: 'France',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 2006', positions: ['LB'], rating: 75 },
      Star:   { era: 'Man Utd · 2008', positions: ['LB'], rating: 85 },
      Legend: { era: 'Man Utd · 2011', positions: ['LB'], rating: 87 },
    },
  },
  {
    playerId: 'zabaleta',
    playerName: 'Pablo Zabaleta',
    nationality: 'Argentina',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man City · 2008', positions: ['RB'], rating: 72 },
      Star:   { era: 'Man City · 2012', positions: ['RB'], rating: 82 },
      Legend: { era: 'Man City · 2014', positions: ['RB'], rating: 85 },
    },
  },

  // ---- MID (12) -------------------------------------------------------------

  {
    playerId: 'gerrard',
    playerName: 'Steven Gerrard',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Liverpool · 2000', positions: ['CM'], rating: 76 },
      Star:   { era: 'Liverpool · 2005', positions: ['CM'], rating: 88 },
      Legend: { era: 'Liverpool · 2009', positions: ['CM'], rating: 91 },
    },
  },
  {
    playerId: 'lampard',
    playerName: 'Frank Lampard',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'West Ham · 2000', positions: ['CM'], rating: 74 },
      Star:   { era: 'Chelsea · 2005',  positions: ['CM'], rating: 87 },
      Legend: { era: 'Chelsea · 2010',  positions: ['CM'], rating: 90 },
    },
  },
  {
    playerId: 'scholes',
    playerName: 'Paul Scholes',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man Utd · 1996', positions: ['CM'], rating: 75 },
      Star:   { era: 'Man Utd · 2001', positions: ['CM'], rating: 86 },
      Legend: { era: 'Man Utd · 2007', positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'keane',
    playerName: 'Roy Keane',
    nationality: 'Ireland',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Nottm Forest · 1992', positions: ['CM'], rating: 74 },
      Star:   { era: 'Man Utd · 1997',      positions: ['CM'], rating: 86 },
      Legend: { era: 'Man Utd · 2000',      positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'vieira',
    playerName: 'Patrick Vieira',
    nationality: 'France',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Arsenal · 1997', positions: ['CM'], rating: 75 },
      Star:   { era: 'Arsenal · 2001', positions: ['CM'], rating: 86 },
      Legend: { era: 'Arsenal · 2004', positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'yayatoure',
    playerName: 'Yaya Touré',
    nationality: 'Ivory Coast',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man City · 2010', positions: ['CM'], rating: 78 },
      Star:   { era: 'Man City · 2012', positions: ['CM'], rating: 86 },
      Legend: { era: 'Man City · 2014', positions: ['CM'], rating: 88 },
    },
  },
  {
    playerId: 'debruyne',
    playerName: 'Kevin De Bruyne',
    nationality: 'Belgium',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Chelsea · 2013',  positions: ['CM'], rating: 75 },
      Star:   { era: 'Man City · 2017', positions: ['CM'], rating: 88 },
      Legend: { era: 'Man City · 2020', positions: ['CM'], rating: 91 },
    },
  },
  {
    playerId: 'kante',
    playerName: "N'Golo Kanté",
    nationality: 'France',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Leicester · 2016', positions: ['CM'], rating: 79 },
      Star:   { era: 'Chelsea · 2017',   positions: ['CM'], rating: 87 },
      Legend: { era: 'Chelsea · 2021',   positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'alonso',
    playerName: 'Xabi Alonso',
    nationality: 'Spain',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Liverpool · 2004', positions: ['CM'], rating: 77 },
      Star:   { era: 'Liverpool · 2006', positions: ['CM'], rating: 86 },
      Legend: { era: 'Liverpool · 2009', positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'fabregas',
    playerName: 'Cesc Fàbregas',
    nationality: 'Spain',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Arsenal · 2005', positions: ['CM'], rating: 76 },
      Star:   { era: 'Arsenal · 2008', positions: ['CM'], rating: 86 },
      Legend: { era: 'Chelsea · 2015', positions: ['CM'], rating: 88 },
    },
  },
  {
    playerId: 'carrick',
    playerName: 'Michael Carrick',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'West Ham · 2003', positions: ['CM'], rating: 74 },
      Star:   { era: 'Man Utd · 2008',  positions: ['CM'], rating: 81 },
      Legend: { era: 'Man Utd · 2013',  positions: ['CM'], rating: 84 },
    },
  },
  {
    playerId: 'milner',
    playerName: 'James Milner',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Aston Villa · 2008', positions: ['CM'],        rating: 73 },
      Star:   { era: 'Man City · 2012',    positions: ['CM'],        rating: 79 },
      // Reinvented as a left-back at Liverpool, unlocking a second position.
      Legend: { era: 'Liverpool · 2019',   positions: ['CM', 'LB'], rating: 81 },
    },
  },

  // ---- ATT (17) -------------------------------------------------------------

  {
    playerId: 'rooney',
    playerName: 'Wayne Rooney',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Everton · 2002',   positions: ['ST'],        rating: 75 },
      Star:   { era: 'Man Utd · 2005',   positions: ['ST'],        rating: 85 },
      // Dropped into midfield roles late career.
      Legend: { era: 'Man Utd · 2011',   positions: ['ST', 'CM'], rating: 90 },
    },
  },
  {
    playerId: 'henry',
    playerName: 'Thierry Henry',
    nationality: 'France',
    pack: 'ATT',
    tiers: {
      // Started wide before converting to a centre-forward.
      Rising: { era: 'Arsenal · 1999',   positions: ['LW'],        rating: 78 },
      Star:   { era: 'Arsenal · 2002',   positions: ['ST', 'LW'], rating: 89 },
      Legend: { era: 'Arsenal · 2004',   positions: ['ST', 'LW'], rating: 93 },
    },
  },
  {
    playerId: 'salah',
    playerName: 'Mohamed Salah',
    nationality: 'Egypt',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Chelsea · 2014',   positions: ['RW'],        rating: 74 },
      Star:   { era: 'Liverpool · 2018', positions: ['RW'],        rating: 88 },
      // Has increasingly played through the centre.
      Legend: { era: 'Liverpool · 2023', positions: ['RW', 'ST'], rating: 91 },
    },
  },
  {
    playerId: 'ronaldo',
    playerName: 'Cristiano Ronaldo',
    nationality: 'Portugal',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 2004',   positions: ['RW'],        rating: 79 },
      Star:   { era: 'Man Utd · 2007',   positions: ['RW', 'LW'], rating: 90 },
      // Converted to a complete centre-forward.
      Legend: { era: 'Man Utd · 2008',   positions: ['RW', 'ST'], rating: 93 },
    },
  },
  {
    playerId: 'aguero',
    playerName: 'Sergio Agüero',
    nationality: 'Argentina',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man City · 2011', positions: ['ST'], rating: 80 },
      Star:   { era: 'Man City · 2015', positions: ['ST'], rating: 88 },
      Legend: { era: 'Man City · 2018', positions: ['ST'], rating: 90 },
    },
  },
  {
    playerId: 'shearer',
    playerName: 'Alan Shearer',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Southampton · 1992', positions: ['ST'], rating: 77 },
      Star:   { era: 'Blackburn · 1995',   positions: ['ST'], rating: 89 },
      Legend: { era: 'Newcastle · 1997',   positions: ['ST'], rating: 91 },
    },
  },
  {
    playerId: 'kane',
    playerName: 'Harry Kane',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Tottenham · 2014', positions: ['ST'],        rating: 78 },
      Star:   { era: 'Tottenham · 2017', positions: ['ST'],        rating: 88 },
      // Deep-lying creative forward role unlocks CM.
      Legend: { era: 'Tottenham · 2021', positions: ['ST', 'CM'], rating: 90 },
    },
  },
  {
    playerId: 'son',
    playerName: 'Son Heung-min',
    nationality: 'South Korea',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Tottenham · 2015', positions: ['LW'],        rating: 77 },
      Star:   { era: 'Tottenham · 2019', positions: ['LW', 'ST'], rating: 86 },
      Legend: { era: 'Tottenham · 2022', positions: ['LW', 'ST'], rating: 89 },
    },
  },
  {
    playerId: 'drogba',
    playerName: 'Didier Drogba',
    nationality: 'Ivory Coast',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Chelsea · 2004', positions: ['ST'], rating: 78 },
      Star:   { era: 'Chelsea · 2007', positions: ['ST'], rating: 86 },
      Legend: { era: 'Chelsea · 2010', positions: ['ST'], rating: 89 },
    },
  },
  {
    playerId: 'bergkamp',
    playerName: 'Dennis Bergkamp',
    nationality: 'Netherlands',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Arsenal · 1996', positions: ['ST'], rating: 77 },
      Star:   { era: 'Arsenal · 1999', positions: ['ST'], rating: 87 },
      Legend: { era: 'Arsenal · 2003', positions: ['ST'], rating: 90 },
    },
  },
  {
    playerId: 'giggs',
    playerName: 'Ryan Giggs',
    nationality: 'Wales',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 1993', positions: ['LW'],        rating: 79 },
      Star:   { era: 'Man Utd · 1999', positions: ['LW'],        rating: 88 },
      // Reinvented as a central creative midfielder in his 30s.
      Legend: { era: 'Man Utd · 2009', positions: ['LW', 'CM'], rating: 90 },
    },
  },
  {
    playerId: 'owen',
    playerName: 'Michael Owen',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Liverpool · 1998', positions: ['ST'], rating: 76 },
      Star:   { era: 'Liverpool · 2001', positions: ['ST'], rating: 86 },
      Legend: { era: 'Liverpool · 2003', positions: ['ST'], rating: 88 },
    },
  },
  {
    playerId: 'mane',
    playerName: 'Sadio Mané',
    nationality: 'Senegal',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Southampton · 2015', positions: ['LW'],        rating: 77 },
      Star:   { era: 'Liverpool · 2018',   positions: ['LW'],        rating: 86 },
      // Played as a centre-forward in Liverpool's 2020-22 peak.
      Legend: { era: 'Liverpool · 2021',   positions: ['LW', 'ST'], rating: 89 },
    },
  },
  {
    playerId: 'andycole',
    playerName: 'Andrew Cole',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Newcastle · 1994', positions: ['ST'], rating: 79 },
      Star:   { era: 'Man Utd · 1997',   positions: ['ST'], rating: 85 },
      Legend: { era: 'Man Utd · 1999',   positions: ['ST'], rating: 87 },
    },
  },
  {
    playerId: 'fowler',
    playerName: 'Robbie Fowler',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Liverpool · 1994', positions: ['ST'], rating: 75 },
      Star:   { era: 'Liverpool · 1996', positions: ['ST'], rating: 85 },
      Legend: { era: 'Liverpool · 1997', positions: ['ST'], rating: 88 },
    },
  },
  {
    playerId: 'sterling',
    playerName: 'Raheem Sterling',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Liverpool · 2014',  positions: ['LW'],        rating: 75 },
      Star:   { era: 'Man City · 2018',   positions: ['LW'],        rating: 85 },
      // Used across both wings at Man City.
      Legend: { era: 'Man City · 2021',   positions: ['LW', 'RW'], rating: 88 },
    },
  },
  {
    playerId: 'beckham',
    playerName: 'David Beckham',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 1996', positions: ['RW'], rating: 76 },
      Star:   { era: 'Man Utd · 1999', positions: ['RW'], rating: 85 },
      Legend: { era: 'Man Utd · 2003', positions: ['RW'], rating: 88 },
    },
  },

];

// ---------------------------------------------------------------------------
// Expand the source into the flat card list (150 cards).
// ---------------------------------------------------------------------------

const TIER_ORDER: Tier[] = ['Rising', 'Star', 'Legend'];

export const ALL_CARDS: PlayerCardDef[] = PLAYERS.flatMap((p) =>
  TIER_ORDER.map((tier) => {
    const t = p.tiers[tier];
    return {
      id: `${p.playerId}-${tier.toLowerCase()}`,
      playerId: p.playerId,
      playerName: p.playerName,
      nationality: p.nationality,
      club: t.era.split(' · ')[0],
      season: t.era.split(' · ')[1] ?? '',
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

const NEXT_TIER: Partial<Record<Tier, Tier>> = {
  Rising: 'Star',
  Star: 'Legend',
};

/** The same player's card one tier up, or undefined if already Legend. */
export function getNextTierCard(cardId: string): PlayerCardDef | undefined {
  const card = CARD_BY_ID[cardId];
  if (!card) return undefined;
  const next = NEXT_TIER[card.tier];
  if (!next) return undefined;
  return CARD_BY_ID[`${card.playerId}-${next.toLowerCase()}`];
}
