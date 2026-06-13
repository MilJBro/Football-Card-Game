import type { PlayerCardDef, Position, Tier, PackCategory } from '@/store/types';

// ============================================================================
// England World Cup internationals — every player to appear in a final WC
// squad for England since 1966.
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

// Single-rating helper — all three tiers are identical so upgrades have no effect.
function sr(
  playerId: string,
  playerName: string,
  pack: PackCategory,
  positions: Position[],
  rating: number,
  era: string,
): PlayerSource {
  const t: TierSource = { era, positions, rating };
  return { playerId, playerName, nationality: 'England', pack, tiers: { Rising: t, Star: t, Legend: t } };
}

const PLAYERS: PlayerSource[] = [

  // ── GK ──────────────────────────────────────────────────────────────────────
  // Existing players kept with original multi-tier format
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
  // New GKs
  sr('gbanks',    'Gordon Banks',   'GK', ['GK'], 92, 'England · 1966'),
  sr('bonetti',   'Peter Bonetti',  'GK', ['GK'], 78, 'England · 1970'),
  sr('clemence',  'Ray Clemence',   'GK', ['GK'], 84, 'England · 1982'),
  sr('nmartyn',   'Nigel Martyn',   'GK', ['GK'], 80, 'England · 1998'),
  sr('probinson', 'Paul Robinson',  'GK', ['GK'], 76, 'England · 2006'),
  sr('djames',    'David James',    'GK', ['GK'], 78, 'England · 2006'),
  sr('jhart',     'Joe Hart',       'GK', ['GK'], 83, 'England · 2014'),
  sr('npope',     'Nick Pope',      'GK', ['GK'], 79, 'England · 2022'),

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
  // New RBs
  sr('gcohen',    'George Cohen',           'DEF', ['RB'], 80, 'England · 1966'),
  sr('mmills',    'Mick Mills',             'DEF', ['RB'], 76, 'England · 1982'),
  sr('vanderson', 'Viv Anderson',           'DEF', ['RB'], 77, 'England · 1986'),
  sr('gstevens',  'Gary Stevens',           'DEF', ['RB'], 76, 'England · 1986'),
  sr('pparker',   'Paul Parker',            'DEF', ['RB'], 75, 'England · 1990'),
  sr('dmills',    'Danny Mills',            'DEF', ['RB'], 72, 'England · 2002'),
  sr('kwalker',   'Kyle Walker',            'DEF', ['RB'], 84, 'England · 2022'),
  sr('rjames',    'Reece James',            'DEF', ['RB'], 80, 'England · 2022'),
  sr('taa',       'Trent Alexander-Arnold', 'DEF', ['RB'], 82, 'England · 2022'),

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
  // New CBs
  sr('jcharlton',  'Jack Charlton',    'DEF', ['CB'], 82, 'England · 1966'),
  sr('nhunter',    'Norman Hunter',    'DEF', ['CB'], 80, 'England · 1966'),
  sr('blabone',    'Brian Labone',     'DEF', ['CB'], 78, 'England · 1970'),
  sr('philthompson','Phil Thompson',   'DEF', ['CB'], 76, 'England · 1982'),
  sr('dwatson',    'Dave Watson',      'DEF', ['CB'], 76, 'England · 1982'),
  sr('tbutcher',   'Terry Butcher',    'DEF', ['CB'], 83, 'England · 1986'),
  sr('mwright',    'Mark Wright',      'DEF', ['CB'], 79, 'England · 1990'),
  sr('dwalker',    'Des Walker',       'DEF', ['CB'], 80, 'England · 1990'),
  sr('tadams',     'Tony Adams',       'DEF', ['CB'], 85, 'England · 1998'),
  sr('southgate',  'Gareth Southgate', 'DEF', ['CB'], 79, 'England · 1998'),
  sr('jterry',     'John Terry',       'DEF', ['CB'], 87, 'England · 2006'),
  sr('carragher',  'Jamie Carragher',  'DEF', ['CB'], 80, 'England · 2006'),
  sr('wbrown',     'Wes Brown',        'DEF', ['CB'], 74, 'England · 2002'),
  sr('lking',      'Ledley King',      'DEF', ['CB'], 80, 'England · 2010'),
  sr('mupson',     'Matthew Upson',    'DEF', ['CB'], 76, 'England · 2010'),
  sr('csmallingg', 'Chris Smalling',   'DEF', ['CB'], 75, 'England · 2014'),
  sr('philjones',  'Phil Jones',       'DEF', ['CB'], 73, 'England · 2014'),
  sr('gcahill',    'Gary Cahill',      'DEF', ['CB'], 81, 'England · 2018'),
  sr('jstones',    'John Stones',      'DEF', ['CB'], 83, 'England · 2022'),
  sr('hmaguire',   'Harry Maguire',    'DEF', ['CB'], 80, 'England · 2022'),
  sr('edier',      'Eric Dier',        'DEF', ['CB'], 77, 'England · 2022'),

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
  // New LBs
  sr('rwilson',   'Ray Wilson',      'DEF', ['LB'], 82, 'England · 1966'),
  sr('tcooper',   'Terry Cooper',    'DEF', ['LB'], 79, 'England · 1970'),
  sr('ksansom',   'Kenny Sansom',    'DEF', ['LB'], 81, 'England · 1982'),
  sr('pneville',  'Phil Neville',    'DEF', ['LB'], 73, 'England · 1998'),
  sr('lbaines',   'Leighton Baines', 'DEF', ['LB'], 79, 'England · 2014'),
  sr('drose',     'Danny Rose',      'DEF', ['LB'], 76, 'England · 2018'),
  sr('ayoung',    'Ashley Young',    'DEF', ['LB'], 74, 'England · 2018'),
  sr('bchilwell', 'Ben Chilwell',    'DEF', ['LB'], 77, 'England · 2022'),

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
  // New CMs
  sr('nstiles',     'Nobby Stiles',      'MID', ['CM'], 80, 'England · 1966'),
  sr('aball',       'Alan Ball',          'MID', ['CM'], 83, 'England · 1966'),
  sr('mpeters',     'Martin Peters',      'MID', ['CM'], 82, 'England · 1966'),
  sr('amullery',    'Alan Mullery',       'MID', ['CM'], 77, 'England · 1970'),
  sr('cbell',       'Colin Bell',         'MID', ['CM'], 80, 'England · 1970'),
  sr('ehughes',     'Emlyn Hughes',       'MID', ['CM'], 78, 'England · 1970'),
  sr('brobson',     'Bryan Robson',       'MID', ['CM'], 88, 'England · 1986'),
  sr('ghoddle',     'Glenn Hoddle',       'MID', ['CM'], 86, 'England · 1986'),
  sr('rwilkins',    'Ray Wilkins',        'MID', ['CM'], 79, 'England · 1986'),
  sr('preid',       'Peter Reid',         'MID', ['CM'], 76, 'England · 1986'),
  sr('gascoigne',   'Paul Gascoigne',     'MID', ['CM'], 89, 'England · 1990'),
  sr('dplatt',      'David Platt',        'MID', ['CM'], 79, 'England · 1990'),
  sr('pince',       'Paul Ince',          'MID', ['CM'], 79, 'England · 1998'),
  sr('dbatty',      'David Batty',        'MID', ['CM'], 74, 'England · 1998'),
  sr('pscholes',    'Paul Scholes',       'MID', ['CM'], 85, 'England · 1998'),
  sr('nbutt',       'Nicky Butt',         'MID', ['CM'], 77, 'England · 2002'),
  sr('kjdyer',      'Kieron Dyer',        'MID', ['CM'], 74, 'England · 2002'),
  sr('flampard',    'Frank Lampard',      'MID', ['CM'], 88, 'England · 2006'),
  sr('ohargreaves', 'Owen Hargreaves',    'MID', ['CM'], 78, 'England · 2006'),
  sr('jcole',       'Joe Cole',           'MID', ['CM'], 80, 'England · 2006'),
  sr('jjenas',      'Jermaine Jenas',     'MID', ['CM'], 74, 'England · 2006'),
  sr('gbarry',      'Gareth Barry',       'MID', ['CM'], 78, 'England · 2010'),
  sr('mcarrick',    'Michael Carrick',    'MID', ['CM'], 79, 'England · 2010'),
  sr('jmilner',     'James Milner',       'MID', ['CM'], 78, 'England · 2010'),
  sr('jwilshere',   'Jack Wilshere',      'MID', ['CM'], 79, 'England · 2014'),
  sr('jhenderson',  'Jordan Henderson',   'MID', ['CM'], 81, 'England · 2018'),
  sr('dalli',       'Dele Alli',          'MID', ['CM'], 79, 'England · 2018'),
  sr('jbellingham', 'Jude Bellingham',    'MID', ['CM'], 90, 'England · 2022'),
  sr('mmount',      'Mason Mount',        'MID', ['CM'], 82, 'England · 2022'),
  sr('cgallagher',  'Conor Gallagher',    'MID', ['CM'], 76, 'England · 2022'),
  sr('kphillips',   'Kalvin Phillips',    'MID', ['CM'], 77, 'England · 2022'),

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
  // New RWs
  sr('icallaghan', 'Ian Callaghan',          'ATT', ['RW'], 73, 'England · 1966'),
  sr('jconnelly',  'John Connelly',          'ATT', ['RW'], 72, 'England · 1966'),
  sr('tpaine',     'Terry Paine',            'ATT', ['RW'], 71, 'England · 1966'),
  sr('scoppell',   'Steve Coppell',          'ATT', ['RW'], 75, 'England · 1982'),
  sr('cwaddle',    'Chris Waddle',           'ATT', ['RW'], 82, 'England · 1990'),
  sr('tsteven',    'Trevor Steven',          'ATT', ['RW'], 76, 'England · 1990'),
  sr('swp',        'Shaun Wright-Phillips',  'ATT', ['RW'], 76, 'England · 2006'),
  sr('tsinclairr', 'Trevor Sinclair',        'ATT', ['RW'], 73, 'England · 2002'),
  sr('alennon',    'Aaron Lennon',           'ATT', ['RW'], 74, 'England · 2006'),
  sr('aoc',        'Alex Oxlade-Chamberlain','ATT', ['RW'], 77, 'England · 2014'),
  sr('jlingard',   'Jesse Lingard',          'ATT', ['RW'], 74, 'England · 2018'),

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
  // New LWs
  sr('peterthompson', 'Peter Thompson',   'ATT', ['LW'], 73, 'England · 1966'),
  sr('pbeardsley',    'Peter Beardsley',  'ATT', ['LW'], 83, 'England · 1986'),
  sr('pmerson',       'Paul Merson',      'ATT', ['LW'], 75, 'England · 1998'),
  sr('smcmanaman',    'Steve McManaman',  'ATT', ['LW'], 78, 'England · 1998'),
  sr('jgrealish',     'Jack Grealish',    'ATT', ['LW'], 82, 'England · 2022'),

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
  // New STs
  sr('jgreaves',    'Jimmy Greaves',      'ATT', ['ST'], 85, 'England · 1966'),
  sr('rhunt',       'Roger Hunt',         'ATT', ['ST'], 80, 'England · 1966'),
  sr('jastle',      'Jeff Astle',         'ATT', ['ST'], 73, 'England · 1970'),
  sr('flee',        'Francis Lee',        'ATT', ['ST'], 76, 'England · 1970'),
  sr('posgood',     'Peter Osgood',       'ATT', ['ST'], 75, 'England · 1970'),
  sr('tfrancis',    'Trevor Francis',     'ATT', ['ST'], 80, 'England · 1982'),
  sr('twoodcock',   'Tony Woodcock',      'ATT', ['ST'], 74, 'England · 1982'),
  sr('pwithe',      'Peter Withe',        'ATT', ['ST'], 73, 'England · 1982'),
  sr('mhateley',    'Mark Hateley',       'ATT', ['ST'], 75, 'England · 1986'),
  sr('sbull',       'Steve Bull',         'ATT', ['ST'], 75, 'England · 1990'),
  sr('lferdinand',  'Les Ferdinand',      'ATT', ['ST'], 81, 'England · 1998'),
  sr('ashearer',    'Alan Shearer',       'ATT', ['ST'], 89, 'England · 1998'),
  sr('tsheringham', 'Teddy Sheringham',   'ATT', ['ST'], 82, 'England · 1998'),
  sr('rfowler',     'Robbie Fowler',      'ATT', ['ST'], 80, 'England · 2002'),
  sr('eheskey',     'Emile Heskey',       'ATT', ['ST'], 74, 'England · 2002'),
  sr('dvassell',    'Darius Vassell',     'ATT', ['ST'], 74, 'England · 2002'),
  sr('mowen',       'Michael Owen',       'ATT', ['ST'], 86, 'England · 2002'),
  sr('pcrouch',     'Peter Crouch',       'ATT', ['ST'], 78, 'England · 2006'),
  sr('jdefoe',      'Jermain Defoe',      'ATT', ['ST'], 79, 'England · 2010'),
  sr('dsturridge',  'Daniel Sturridge',   'ATT', ['ST'], 82, 'England · 2014'),
  sr('rlambert',    'Rickie Lambert',     'ATT', ['ST'], 73, 'England · 2014'),
  sr('dwelbeck',    'Danny Welbeck',      'ATT', ['ST'], 77, 'England · 2014'),
  sr('jvardy',      'Jamie Vardy',        'ATT', ['ST'], 81, 'England · 2018'),
  sr('hkane',       'Harry Kane',         'ATT', ['ST'], 91, 'England · 2022'),
  sr('cwilson',     'Callum Wilson',      'ATT', ['ST'], 75, 'England · 2022'),
  sr('itoney',      'Ivan Toney',         'ATT', ['ST'], 77, 'England · 2022'),

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
