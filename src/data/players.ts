import type { PlayerCardDef, Position, Tier, PackCategory } from '@/store/types';

// ============================================================================
// Compact source data. Each player has three career-era entries (tiers).
// Positions and ratings evolve to tell the player's story:
//   Rising  = debut / breakthrough era
//   Star    = establishing greatness
//   Legend  = peak years (highest rating; 2nd position unlocked if applicable)
// Expanded into 360 PlayerCardDef cards below (120 players × 3 tiers).
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

  // ---- GK (15) ---------------------------------------------------------------

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
  {
    playerId: 'lloris',
    playerName: 'Hugo Lloris',
    nationality: 'France',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Tottenham · 2012', positions: ['GK'], rating: 76 },
      Star:   { era: 'Tottenham · 2015', positions: ['GK'], rating: 85 },
      Legend: { era: 'Tottenham · 2019', positions: ['GK'], rating: 88 },
    },
  },
  {
    playerId: 'davidjames',
    playerName: 'David James',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Liverpool · 1997',    positions: ['GK'], rating: 73 },
      Star:   { era: 'Aston Villa · 2004',  positions: ['GK'], rating: 81 },
      Legend: { era: 'Portsmouth · 2008',   positions: ['GK'], rating: 83 },
    },
  },
  {
    playerId: 'friedel',
    playerName: 'Brad Friedel',
    nationality: 'United States',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Blackburn · 2001',    positions: ['GK'], rating: 74 },
      Star:   { era: 'Aston Villa · 2008',  positions: ['GK'], rating: 83 },
      Legend: { era: 'Tottenham · 2012',    positions: ['GK'], rating: 85 },
    },
  },
  {
    playerId: 'timhoward',
    playerName: 'Tim Howard',
    nationality: 'United States',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Everton · 2007', positions: ['GK'], rating: 75 },
      Star:   { era: 'Everton · 2011', positions: ['GK'], rating: 83 },
      Legend: { era: 'Everton · 2014', positions: ['GK'], rating: 86 },
    },
  },
  {
    playerId: 'pickford',
    playerName: 'Jordan Pickford',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Everton · 2017', positions: ['GK'], rating: 76 },
      Star:   { era: 'Everton · 2020', positions: ['GK'], rating: 83 },
      Legend: { era: 'Everton · 2023', positions: ['GK'], rating: 86 },
    },
  },
  {
    playerId: 'nickpope',
    playerName: 'Nick Pope',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Burnley · 2017',   positions: ['GK'], rating: 73 },
      Star:   { era: 'Burnley · 2020',   positions: ['GK'], rating: 81 },
      Legend: { era: 'Newcastle · 2023', positions: ['GK'], rating: 84 },
    },
  },
  {
    playerId: 'nigelmartyn',
    playerName: 'Nigel Martyn',
    nationality: 'England',
    pack: 'GK',
    tiers: {
      Rising: { era: 'Leeds · 1997',   positions: ['GK'], rating: 74 },
      Star:   { era: 'Leeds · 2001',   positions: ['GK'], rating: 83 },
      Legend: { era: 'Everton · 2004', positions: ['GK'], rating: 85 },
    },
  },

  // ---- DEF (31) -------------------------------------------------------------

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
  {
    playerId: 'tonyadams',
    playerName: 'Tony Adams',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Arsenal · 1993', positions: ['CB'], rating: 76 },
      Star:   { era: 'Arsenal · 1998', positions: ['CB'], rating: 85 },
      Legend: { era: 'Arsenal · 2002', positions: ['CB'], rating: 89 },
    },
  },
  {
    playerId: 'keown',
    playerName: 'Martin Keown',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Arsenal · 1993', positions: ['CB'], rating: 73 },
      Star:   { era: 'Arsenal · 1998', positions: ['CB'], rating: 82 },
      Legend: { era: 'Arsenal · 2004', positions: ['CB'], rating: 86 },
    },
  },
  {
    playerId: 'carragher',
    playerName: 'Jamie Carragher',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Liverpool · 2000', positions: ['CB'], rating: 73 },
      Star:   { era: 'Liverpool · 2005', positions: ['CB'], rating: 83 },
      Legend: { era: 'Liverpool · 2009', positions: ['CB'], rating: 86 },
    },
  },
  {
    playerId: 'stevebruce',
    playerName: 'Steve Bruce',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 1993', positions: ['CB'], rating: 75 },
      Star:   { era: 'Man Utd · 1994', positions: ['CB'], rating: 84 },
      Legend: { era: 'Man Utd · 1996', positions: ['CB'], rating: 87 },
    },
  },
  {
    playerId: 'desailly',
    playerName: 'Marcel Desailly',
    nationality: 'France',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Chelsea · 1998', positions: ['CB'], rating: 75 },
      Star:   { era: 'Chelsea · 2001', positions: ['CB'], rating: 82 },
      Legend: { era: 'Chelsea · 2004', positions: ['CB'], rating: 85 },
    },
  },
  {
    playerId: 'ivanovic',
    playerName: 'Branislav Ivanović',
    nationality: 'Serbia',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Chelsea · 2009',  positions: ['RB'],        rating: 74 },
      Star:   { era: 'Chelsea · 2012',  positions: ['RB'],        rating: 83 },
      Legend: { era: 'Chelsea · 2015',  positions: ['RB', 'CB'], rating: 86 },
    },
  },
  {
    playerId: 'richarddunne',
    playerName: 'Richard Dunne',
    nationality: 'Ireland',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man City · 2002', positions: ['CB'], rating: 72 },
      Star:   { era: 'Man City · 2006', positions: ['CB'], rating: 81 },
      Legend: { era: 'Man City · 2009', positions: ['CB'], rating: 84 },
    },
  },
  {
    playerId: 'lescott',
    playerName: 'Joleon Lescott',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Everton · 2007',  positions: ['CB'], rating: 73 },
      Star:   { era: 'Man City · 2011', positions: ['CB'], rating: 81 },
      Legend: { era: 'Man City · 2012', positions: ['CB'], rating: 84 },
    },
  },
  {
    playerId: 'jagielka',
    playerName: 'Phil Jagielka',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Everton · 2007', positions: ['CB'], rating: 72 },
      Star:   { era: 'Everton · 2011', positions: ['CB'], rating: 82 },
      Legend: { era: 'Everton · 2014', positions: ['CB'], rating: 85 },
    },
  },
  {
    playerId: 'pneville',
    playerName: 'Phil Neville',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 1997',  positions: ['RB'], rating: 72 },
      Star:   { era: 'Man Utd · 2000',  positions: ['RB'], rating: 80 },
      Legend: { era: 'Everton · 2008',  positions: ['RB'], rating: 82 },
    },
  },
  {
    playerId: 'micahrichards',
    playerName: 'Micah Richards',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man City · 2007', positions: ['RB'], rating: 73 },
      Star:   { era: 'Man City · 2010', positions: ['RB'], rating: 82 },
      Legend: { era: 'Man City · 2012', positions: ['RB'], rating: 84 },
    },
  },
  {
    playerId: 'lukeshaw',
    playerName: 'Luke Shaw',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Southampton · 2013', positions: ['LB'], rating: 75 },
      Star:   { era: 'Man Utd · 2021',    positions: ['LB'], rating: 83 },
      Legend: { era: 'Man Utd · 2023',    positions: ['LB'], rating: 86 },
    },
  },
  {
    playerId: 'dannyrose',
    playerName: 'Danny Rose',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Tottenham · 2013', positions: ['LB'], rating: 73 },
      Star:   { era: 'Tottenham · 2016', positions: ['LB'], rating: 82 },
      Legend: { era: 'Tottenham · 2018', positions: ['LB'], rating: 85 },
    },
  },
  {
    playerId: 'digne',
    playerName: 'Lucas Digne',
    nationality: 'France',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Everton · 2018', positions: ['LB'], rating: 74 },
      Star:   { era: 'Everton · 2020', positions: ['LB'], rating: 83 },
      Legend: { era: 'Everton · 2021', positions: ['LB'], rating: 86 },
    },
  },
  {
    playerId: 'gallas',
    playerName: 'William Gallas',
    nationality: 'France',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Chelsea · 2002',  positions: ['CB'],        rating: 74 },
      Star:   { era: 'Chelsea · 2005',  positions: ['CB'],        rating: 83 },
      Legend: { era: 'Arsenal · 2008',  positions: ['CB', 'LB'], rating: 86 },
    },
  },
  {
    playerId: 'oshea',
    playerName: 'John O\'Shea',
    nationality: 'Ireland',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 2004',  positions: ['CB'],        rating: 72 },
      Star:   { era: 'Man Utd · 2007',  positions: ['CB'],        rating: 80 },
      Legend: { era: 'Man Utd · 2009',  positions: ['CB', 'RB'], rating: 83 },
    },
  },
  {
    playerId: 'wesbrown',
    playerName: 'Wes Brown',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Man Utd · 2000',  positions: ['RB'],        rating: 72 },
      Star:   { era: 'Man Utd · 2003',  positions: ['RB'],        rating: 80 },
      Legend: { era: 'Man Utd · 2008',  positions: ['RB', 'CB'], rating: 83 },
    },
  },
  {
    playerId: 'wanb',
    playerName: 'Aaron Wan-Bissaka',
    nationality: 'England',
    pack: 'DEF',
    tiers: {
      Rising: { era: 'Crystal Palace · 2019', positions: ['RB'], rating: 73 },
      Star:   { era: 'Man Utd · 2021',        positions: ['RB'], rating: 82 },
      Legend: { era: 'Man Utd · 2023',        positions: ['RB'], rating: 85 },
    },
  },

  // ---- MID (34) -------------------------------------------------------------

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
      Legend: { era: 'Liverpool · 2019',   positions: ['CM', 'LB'], rating: 81 },
    },
  },
  {
    playerId: 'davidsilva',
    playerName: 'David Silva',
    nationality: 'Spain',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man City · 2011', positions: ['CM'], rating: 79 },
      Star:   { era: 'Man City · 2014', positions: ['CM'], rating: 88 },
      Legend: { era: 'Man City · 2019', positions: ['CM'], rating: 92 },
    },
  },
  {
    playerId: 'ozil',
    playerName: 'Mesut Özil',
    nationality: 'Germany',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Arsenal · 2013', positions: ['CM'], rating: 77 },
      Star:   { era: 'Arsenal · 2016', positions: ['CM'], rating: 86 },
      Legend: { era: 'Arsenal · 2018', positions: ['CM'], rating: 89 },
    },
  },
  {
    playerId: 'mata',
    playerName: 'Juan Mata',
    nationality: 'Spain',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Chelsea · 2011',  positions: ['CM'],        rating: 76 },
      Star:   { era: 'Chelsea · 2013',  positions: ['CM'],        rating: 84 },
      Legend: { era: 'Man Utd · 2016',  positions: ['CM', 'RW'], rating: 87 },
    },
  },
  {
    playerId: 'essien',
    playerName: 'Michael Essien',
    nationality: 'Ghana',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Chelsea · 2005', positions: ['CM'], rating: 77 },
      Star:   { era: 'Chelsea · 2007', positions: ['CM'], rating: 85 },
      Legend: { era: 'Chelsea · 2010', positions: ['CM'], rating: 87 },
    },
  },
  {
    playerId: 'makelele',
    playerName: 'Claude Makélélé',
    nationality: 'France',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Chelsea · 2003', positions: ['CM'], rating: 75 },
      Star:   { era: 'Chelsea · 2005', positions: ['CM'], rating: 83 },
      Legend: { era: 'Chelsea · 2007', positions: ['CM'], rating: 86 },
    },
  },
  {
    playerId: 'modric',
    playerName: 'Luka Modrić',
    nationality: 'Croatia',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Tottenham · 2008', positions: ['CM'], rating: 77 },
      Star:   { era: 'Tottenham · 2011', positions: ['CM'], rating: 85 },
      Legend: { era: 'Tottenham · 2012', positions: ['CM'], rating: 88 },
    },
  },
  {
    playerId: 'cazorla',
    playerName: 'Santi Cazorla',
    nationality: 'Spain',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Arsenal · 2012', positions: ['CM'], rating: 77 },
      Star:   { era: 'Arsenal · 2014', positions: ['CM'], rating: 85 },
      Legend: { era: 'Arsenal · 2016', positions: ['CM'], rating: 88 },
    },
  },
  {
    playerId: 'ramsey',
    playerName: 'Aaron Ramsey',
    nationality: 'Wales',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Arsenal · 2010', positions: ['CM'], rating: 75 },
      Star:   { era: 'Arsenal · 2014', positions: ['CM'], rating: 83 },
      Legend: { era: 'Arsenal · 2018', positions: ['CM'], rating: 86 },
    },
  },
  {
    playerId: 'dele',
    playerName: 'Dele Alli',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Tottenham · 2016', positions: ['CM'], rating: 75 },
      Star:   { era: 'Tottenham · 2017', positions: ['CM'], rating: 83 },
      Legend: { era: 'Tottenham · 2019', positions: ['CM'], rating: 86 },
    },
  },
  {
    playerId: 'grealish',
    playerName: 'Jack Grealish',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Aston Villa · 2019', positions: ['CM'],        rating: 76 },
      Star:   { era: 'Aston Villa · 2021', positions: ['CM'],        rating: 84 },
      Legend: { era: 'Man City · 2023',    positions: ['CM', 'LW'], rating: 87 },
    },
  },
  {
    playerId: 'joecole',
    playerName: 'Joe Cole',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'West Ham · 2002', positions: ['CM'],        rating: 74 },
      Star:   { era: 'Chelsea · 2006',  positions: ['CM'],        rating: 82 },
      Legend: { era: 'Chelsea · 2010',  positions: ['CM', 'LW'], rating: 85 },
    },
  },
  {
    playerId: 'parkjisung',
    playerName: 'Park Ji-sung',
    nationality: 'South Korea',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man Utd · 2005', positions: ['CM'],        rating: 74 },
      Star:   { era: 'Man Utd · 2008', positions: ['CM'],        rating: 81 },
      Legend: { era: 'Man Utd · 2011', positions: ['CM', 'LW'], rating: 84 },
    },
  },
  {
    playerId: 'henderson',
    playerName: 'Jordan Henderson',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Liverpool · 2012', positions: ['CM'], rating: 74 },
      Star:   { era: 'Liverpool · 2016', positions: ['CM'], rating: 83 },
      Legend: { era: 'Liverpool · 2020', positions: ['CM'], rating: 86 },
    },
  },
  {
    playerId: 'thiago',
    playerName: 'Thiago Alcântara',
    nationality: 'Spain',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Liverpool · 2021', positions: ['CM'], rating: 77 },
      Star:   { era: 'Liverpool · 2022', positions: ['CM'], rating: 84 },
      Legend: { era: 'Liverpool · 2023', positions: ['CM'], rating: 87 },
    },
  },
  {
    playerId: 'declanrice',
    playerName: 'Declan Rice',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'West Ham · 2020',  positions: ['CM'],        rating: 76 },
      Star:   { era: 'West Ham · 2022',  positions: ['CM'],        rating: 84 },
      // Began career as a CB before converting — unlocks that position at Legend.
      Legend: { era: 'Arsenal · 2024',   positions: ['CM', 'CB'], rating: 87 },
    },
  },
  {
    playerId: 'maddison',
    playerName: 'James Maddison',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Leicester · 2019',  positions: ['CM'], rating: 76 },
      Star:   { era: 'Leicester · 2021',  positions: ['CM'], rating: 83 },
      Legend: { era: 'Newcastle · 2024',  positions: ['CM'], rating: 86 },
    },
  },
  {
    playerId: 'garethbarry',
    playerName: 'Gareth Barry',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Aston Villa · 2004', positions: ['CM'], rating: 74 },
      Star:   { era: 'Aston Villa · 2009', positions: ['CM'], rating: 82 },
      Legend: { era: 'Man City · 2011',    positions: ['CM'], rating: 84 },
    },
  },
  {
    playerId: 'hamann',
    playerName: 'Dietmar Hamann',
    nationality: 'Germany',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Liverpool · 2001', positions: ['CM'], rating: 74 },
      Star:   { era: 'Liverpool · 2004', positions: ['CM'], rating: 82 },
      Legend: { era: 'Liverpool · 2006', positions: ['CM'], rating: 85 },
    },
  },
  {
    playerId: 'nickybutt',
    playerName: 'Nicky Butt',
    nationality: 'England',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man Utd · 1997', positions: ['CM'], rating: 72 },
      Star:   { era: 'Man Utd · 1999', positions: ['CM'], rating: 80 },
      Legend: { era: 'Man Utd · 2002', positions: ['CM'], rating: 82 },
    },
  },
  {
    playerId: 'ljungberg',
    playerName: 'Freddie Ljungberg',
    nationality: 'Sweden',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Arsenal · 1999', positions: ['CM'], rating: 74 },
      Star:   { era: 'Arsenal · 2002', positions: ['CM'], rating: 82 },
      Legend: { era: 'Arsenal · 2004', positions: ['CM'], rating: 85 },
    },
  },
  {
    playerId: 'odegaard',
    playerName: 'Martin Ødegaard',
    nationality: 'Norway',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Arsenal · 2021', positions: ['CM'], rating: 76 },
      Star:   { era: 'Arsenal · 2023', positions: ['CM'], rating: 84 },
      Legend: { era: 'Arsenal · 2024', positions: ['CM'], rating: 87 },
    },
  },
  {
    playerId: 'rodri',
    playerName: 'Rodri',
    nationality: 'Spain',
    pack: 'MID',
    tiers: {
      Rising: { era: 'Man City · 2020', positions: ['CM'], rating: 79 },
      Star:   { era: 'Man City · 2022', positions: ['CM'], rating: 86 },
      Legend: { era: 'Man City · 2024', positions: ['CM'], rating: 89 },
    },
  },

  // ---- ATT (40) -------------------------------------------------------------

  {
    playerId: 'rooney',
    playerName: 'Wayne Rooney',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Everton · 2002',   positions: ['ST'],        rating: 75 },
      Star:   { era: 'Man Utd · 2005',   positions: ['ST'],        rating: 85 },
      Legend: { era: 'Man Utd · 2011',   positions: ['ST', 'CM'], rating: 90 },
    },
  },
  {
    playerId: 'henry',
    playerName: 'Thierry Henry',
    nationality: 'France',
    pack: 'ATT',
    tiers: {
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
  {
    playerId: 'pires',
    playerName: 'Robert Pires',
    nationality: 'France',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Arsenal · 2001', positions: ['LW'], rating: 77 },
      Star:   { era: 'Arsenal · 2002', positions: ['LW'], rating: 85 },
      Legend: { era: 'Arsenal · 2004', positions: ['LW'], rating: 88 },
    },
  },
  {
    playerId: 'anelka',
    playerName: 'Nicolas Anelka',
    nationality: 'France',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Arsenal · 1997',  positions: ['ST'], rating: 75 },
      Star:   { era: 'Chelsea · 2005',  positions: ['ST'], rating: 83 },
      Legend: { era: 'Chelsea · 2009',  positions: ['ST'], rating: 86 },
    },
  },
  {
    playerId: 'lesferdinand',
    playerName: 'Les Ferdinand',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'QPR · 1993',       positions: ['ST'], rating: 76 },
      Star:   { era: 'Newcastle · 1995', positions: ['ST'], rating: 84 },
      Legend: { era: 'Newcastle · 1997', positions: ['ST'], rating: 87 },
    },
  },
  {
    playerId: 'sheringham',
    playerName: 'Teddy Sheringham',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Nottm Forest · 1993', positions: ['ST'], rating: 74 },
      Star:   { era: 'Tottenham · 1997',    positions: ['ST'], rating: 83 },
      Legend: { era: 'Man Utd · 1999',      positions: ['ST'], rating: 86 },
    },
  },
  {
    playerId: 'dwyorke',
    playerName: 'Dwight Yorke',
    nationality: 'Trinidad & Tobago',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Aston Villa · 1996', positions: ['ST'], rating: 76 },
      Star:   { era: 'Man Utd · 1999',     positions: ['ST'], rating: 85 },
      Legend: { era: 'Man Utd · 2000',     positions: ['ST'], rating: 88 },
    },
  },
  {
    playerId: 'solskjaer',
    playerName: 'Ole Gunnar Solskjær',
    nationality: 'Norway',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 1997', positions: ['ST'], rating: 74 },
      Star:   { era: 'Man Utd · 1999', positions: ['ST'], rating: 82 },
      Legend: { era: 'Man Utd · 2003', positions: ['ST'], rating: 85 },
    },
  },
  {
    playerId: 'torres',
    playerName: 'Fernando Torres',
    nationality: 'Spain',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Liverpool · 2007', positions: ['ST'], rating: 78 },
      Star:   { era: 'Liverpool · 2008', positions: ['ST'], rating: 88 },
      Legend: { era: 'Liverpool · 2009', positions: ['ST'], rating: 90 },
    },
  },
  {
    playerId: 'vanpersie',
    playerName: 'Robin van Persie',
    nationality: 'Netherlands',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Arsenal · 2007',  positions: ['ST'],        rating: 76 },
      Star:   { era: 'Arsenal · 2012',  positions: ['ST'],        rating: 87 },
      Legend: { era: 'Man Utd · 2013',  positions: ['ST', 'LW'], rating: 90 },
    },
  },
  {
    playerId: 'diegocosta',
    playerName: 'Diego Costa',
    nationality: 'Spain',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Chelsea · 2014', positions: ['ST'], rating: 77 },
      Star:   { era: 'Chelsea · 2015', positions: ['ST'], rating: 85 },
      Legend: { era: 'Chelsea · 2017', positions: ['ST'], rating: 87 },
    },
  },
  {
    playerId: 'vardy',
    playerName: 'Jamie Vardy',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Leicester · 2015', positions: ['ST'], rating: 75 },
      Star:   { era: 'Leicester · 2016', positions: ['ST'], rating: 85 },
      Legend: { era: 'Leicester · 2020', positions: ['ST'], rating: 88 },
    },
  },
  {
    playerId: 'zaha',
    playerName: 'Wilfried Zaha',
    nationality: 'Ivory Coast',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Crystal Palace · 2014', positions: ['LW'],        rating: 74 },
      Star:   { era: 'Crystal Palace · 2018', positions: ['LW'],        rating: 83 },
      Legend: { era: 'Crystal Palace · 2020', positions: ['LW', 'RW'], rating: 86 },
    },
  },
  {
    playerId: 'mahrez',
    playerName: 'Riyad Mahrez',
    nationality: 'Algeria',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Leicester · 2015', positions: ['RW'],        rating: 76 },
      Star:   { era: 'Leicester · 2016', positions: ['RW'],        rating: 85 },
      Legend: { era: 'Man City · 2022',  positions: ['RW', 'LW'], rating: 88 },
    },
  },
  {
    playerId: 'sanchez',
    playerName: 'Alexis Sánchez',
    nationality: 'Chile',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Arsenal · 2014', positions: ['LW'],        rating: 78 },
      Star:   { era: 'Arsenal · 2015', positions: ['LW'],        rating: 86 },
      Legend: { era: 'Arsenal · 2017', positions: ['LW', 'ST'], rating: 89 },
    },
  },
  {
    playerId: 'hazard',
    playerName: 'Eden Hazard',
    nationality: 'Belgium',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Chelsea · 2012', positions: ['LW'], rating: 79 },
      Star:   { era: 'Chelsea · 2015', positions: ['LW'], rating: 88 },
      Legend: { era: 'Chelsea · 2019', positions: ['LW'], rating: 91 },
    },
  },
  {
    playerId: 'rashford',
    playerName: 'Marcus Rashford',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man Utd · 2017', positions: ['LW'],        rating: 76 },
      Star:   { era: 'Man Utd · 2020', positions: ['LW'],        rating: 84 },
      Legend: { era: 'Man Utd · 2023', positions: ['LW', 'ST'], rating: 87 },
    },
  },
  {
    playerId: 'gjesus',
    playerName: 'Gabriel Jesus',
    nationality: 'Brazil',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Man City · 2018', positions: ['ST'],        rating: 76 },
      Star:   { era: 'Man City · 2021', positions: ['ST'],        rating: 83 },
      Legend: { era: 'Arsenal · 2023',  positions: ['ST', 'LW'], rating: 86 },
    },
  },
  {
    playerId: 'duff',
    playerName: 'Damien Duff',
    nationality: 'Ireland',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Blackburn · 2002', positions: ['LW'], rating: 74 },
      Star:   { era: 'Chelsea · 2005',   positions: ['LW'], rating: 83 },
      Legend: { era: 'Chelsea · 2006',   positions: ['LW'], rating: 86 },
    },
  },
  {
    playerId: 'overmars',
    playerName: 'Marc Overmars',
    nationality: 'Netherlands',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Arsenal · 1997', positions: ['LW'], rating: 76 },
      Star:   { era: 'Arsenal · 1998', positions: ['LW'], rating: 85 },
      Legend: { era: 'Arsenal · 2000', positions: ['LW'], rating: 87 },
    },
  },
  {
    playerId: 'heskey',
    playerName: 'Emile Heskey',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Liverpool · 2000',    positions: ['ST'], rating: 73 },
      Star:   { era: 'Liverpool · 2002',    positions: ['ST'], rating: 80 },
      Legend: { era: 'Aston Villa · 2010',  positions: ['ST'], rating: 82 },
    },
  },
  {
    playerId: 'kuyt',
    playerName: 'Dirk Kuyt',
    nationality: 'Netherlands',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Liverpool · 2007', positions: ['ST'],        rating: 74 },
      Star:   { era: 'Liverpool · 2009', positions: ['ST'],        rating: 82 },
      Legend: { era: 'Liverpool · 2012', positions: ['ST', 'RW'], rating: 84 },
    },
  },
  {
    playerId: 'sutton',
    playerName: 'Chris Sutton',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Blackburn · 1994', positions: ['ST'], rating: 74 },
      Star:   { era: 'Blackburn · 1995', positions: ['ST'], rating: 83 },
      Legend: { era: 'Blackburn · 1998', positions: ['ST'], rating: 85 },
    },
  },
  {
    playerId: 'defoe',
    playerName: 'Jermain Defoe',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Tottenham · 2005', positions: ['ST'], rating: 74 },
      Star:   { era: 'Tottenham · 2010', positions: ['ST'], rating: 83 },
      Legend: { era: 'Tottenham · 2012', positions: ['ST'], rating: 86 },
    },
  },
  {
    playerId: 'ianwright',
    playerName: 'Ian Wright',
    nationality: 'England',
    pack: 'ATT',
    tiers: {
      Rising: { era: 'Arsenal · 1992', positions: ['ST'], rating: 75 },
      Star:   { era: 'Arsenal · 1997', positions: ['ST'], rating: 84 },
      Legend: { era: 'Arsenal · 1998', positions: ['ST'], rating: 87 },
    },
  },

];

// ---------------------------------------------------------------------------
// Expand the source into the flat card list (360 cards).
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
