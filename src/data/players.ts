import type { PlayerCardDef, Position, Tier, PackCategory } from '@/store/types';

// ============================================================================
// England World Cup internationals — every player to appear in a final WC
// squad for England since 1966. The era field lists all WC years.
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

// Single-rating helper: wcYears e.g. "1966, 1970" → era "England · 1966, 1970"
function sr(
  playerId: string,
  playerName: string,
  pack: PackCategory,
  positions: Position[],
  rating: number,
  wcYears: string,
): PlayerSource {
  const era = `England · ${wcYears}`;
  const t: TierSource = { era, positions, rating };
  return { playerId, playerName, nationality: 'England', pack, tiers: { Rising: t, Star: t, Legend: t } };
}

const PLAYERS: PlayerSource[] = [

  // ── GK ──────────────────────────────────────────────────────────────────────
  sr('shilton',   'Peter Shilton',  'GK', ['GK'], 89, '1982, 1986, 1990'),
  sr('seaman',    'David Seaman',   'GK', ['GK'], 87, '1998, 2002'),
  sr('pickford',  'Jordan Pickford','GK', ['GK'], 86, '2018, 2022'),
  sr('gbanks',    'Gordon Banks',   'GK', ['GK'], 92, '1966, 1970'),
  sr('bonetti',   'Peter Bonetti',  'GK', ['GK'], 78, '1966, 1970'),
  sr('rspringett','Ron Springett',  'GK', ['GK'], 73, '1962, 1966'),
  sr('clemence',  'Ray Clemence',   'GK', ['GK'], 84, '1982'),
  sr('nmartyn',   'Nigel Martyn',   'GK', ['GK'], 80, '1998, 2002'),
  sr('probinson', 'Paul Robinson',  'GK', ['GK'], 76, '2006'),
  sr('djames',    'David James',    'GK', ['GK'], 78, '2002, 2006, 2010'),
  sr('jhart',     'Joe Hart',       'GK', ['GK'], 83, '2010, 2014'),
  sr('npope',     'Nick Pope',      'GK', ['GK'], 79, '2018, 2022'),

  // ── RB ──────────────────────────────────────────────────────────────────────
  sr('gneville',  'Gary Neville',           'DEF', ['RB'], 85, '1998, 2002, 2006'),
  sr('gjohnson',  'Glen Johnson',           'DEF', ['RB'], 82, '2006, 2010, 2014'),
  sr('trippier',  'Kieran Trippier',        'DEF', ['RB'], 86, '2018, 2022'),
  sr('gcohen',    'George Cohen',           'DEF', ['RB'], 80, '1966'),
  sr('jarmfield', 'Jimmy Armfield',         'DEF', ['RB'], 80, '1962, 1966'),
  sr('mmills',    'Mick Mills',             'DEF', ['RB'], 76, '1982'),
  sr('vanderson', 'Viv Anderson',           'DEF', ['RB'], 77, '1986'),
  sr('gstevens',  'Gary Stevens',           'DEF', ['RB'], 76, '1986, 1990'),
  sr('pparker',   'Paul Parker',            'DEF', ['RB'], 75, '1990'),
  sr('dmills',    'Danny Mills',            'DEF', ['RB'], 72, '2002'),
  sr('kwalker',   'Kyle Walker',            'DEF', ['RB'], 84, '2018, 2022'),
  sr('rjames',    'Reece James',            'DEF', ['RB'], 80, '2022'),
  sr('taa',       'Trent Alexander-Arnold', 'DEF', ['RB'], 82, '2022'),

  // ── CB ──────────────────────────────────────────────────────────────────────
  sr('bobbymoore',  'Bobby Moore',      'DEF', ['CB'], 92, '1966, 1970'),
  sr('solcampbell', 'Sol Campbell',     'DEF', ['CB'], 88, '1998, 2002, 2006'),
  sr('rioferd',     'Rio Ferdinand',   'DEF', ['CB'], 90, '2002, 2006'),
  sr('jcharlton',   'Jack Charlton',   'DEF', ['CB'], 82, '1966, 1970'),
  sr('nhunter',     'Norman Hunter',   'DEF', ['CB'], 80, '1966, 1970'),
  sr('blabone',     'Brian Labone',    'DEF', ['CB'], 78, '1970'),
  sr('rflowers',    'Ron Flowers',     'DEF', ['CB'], 75, '1958, 1962, 1966'),
  sr('philthompson','Phil Thompson',   'DEF', ['CB'], 76, '1982'),
  sr('dwatson',     'Dave Watson',     'DEF', ['CB'], 76, '1982'),
  sr('tbutcher',    'Terry Butcher',   'DEF', ['CB'], 83, '1982, 1986, 1990'),
  sr('mwright',     'Mark Wright',     'DEF', ['CB'], 79, '1986, 1990'),
  sr('dwalker',     'Des Walker',      'DEF', ['CB'], 80, '1990'),
  sr('tadams',      'Tony Adams',      'DEF', ['CB'], 85, '1986, 1990, 1998'),
  sr('southgate',   'Gareth Southgate','DEF', ['CB'], 79, '1998'),
  sr('jterry',      'John Terry',      'DEF', ['CB'], 87, '2006, 2010'),
  sr('carragher',   'Jamie Carragher', 'DEF', ['CB'], 80, '2002, 2006, 2010'),
  sr('wbrown',      'Wes Brown',       'DEF', ['CB'], 74, '2002'),
  sr('lking',       'Ledley King',     'DEF', ['CB'], 80, '2006, 2010'),
  sr('mupson',      'Matthew Upson',   'DEF', ['CB'], 76, '2010'),
  sr('csmallingg',  'Chris Smalling',  'DEF', ['CB'], 75, '2014'),
  sr('philjones',   'Phil Jones',      'DEF', ['CB'], 73, '2014'),
  sr('gcahill',     'Gary Cahill',     'DEF', ['CB'], 81, '2014, 2018'),
  sr('jstones',     'John Stones',     'DEF', ['CB'], 83, '2018, 2022'),
  sr('hmaguire',    'Harry Maguire',   'DEF', ['CB'], 80, '2018, 2022'),
  sr('edier',       'Eric Dier',       'DEF', ['CB'], 77, '2018, 2022'),

  // ── LB ──────────────────────────────────────────────────────────────────────
  sr('stuartpearce','Stuart Pearce',   'DEF', ['LB'], 86, '1986, 1990'),
  sr('ashleycole',  'Ashley Cole',     'DEF', ['LB'], 90, '2002, 2006, 2010'),
  sr('lukeshaw',    'Luke Shaw',       'DEF', ['LB'], 86, '2018, 2022'),
  sr('rwilson',     'Ray Wilson',      'DEF', ['LB'], 84, '1966'),
  sr('gbyrne',      'Gerry Byrne',     'DEF', ['LB'], 74, '1966'),
  sr('tcooper',     'Terry Cooper',    'DEF', ['LB'], 79, '1970'),
  sr('ksansom',     'Kenny Sansom',    'DEF', ['LB'], 81, '1982, 1986'),
  sr('pneville',    'Phil Neville',    'DEF', ['LB'], 73, '1998, 2002'),
  sr('lbaines',     'Leighton Baines', 'DEF', ['LB'], 79, '2014'),
  sr('drose',       'Danny Rose',      'DEF', ['LB'], 76, '2018'),
  sr('ayoung',      'Ashley Young',    'DEF', ['LB'], 74, '2018'),
  sr('bchilwell',   'Ben Chilwell',    'DEF', ['LB'], 77, '2022'),

  // ── CM ──────────────────────────────────────────────────────────────────────
  sr('bobbycharlton','Bobby Charlton', 'MID', ['CM'], 93, '1966, 1970'),
  sr('gerrard',     'Steven Gerrard',  'MID', ['CM'], 91, '2006, 2010, 2014'),
  sr('decrice',     'Declan Rice',     'MID', ['CM'], 88, '2022'),
  sr('nstiles',     'Nobby Stiles',    'MID', ['CM'], 80, '1966'),
  sr('geastham',    'George Eastham',  'MID', ['CM'], 77, '1966'),
  sr('aball',       'Alan Ball',       'MID', ['CM'], 85, '1966, 1970'),
  sr('mpeters',     'Martin Peters',   'MID', ['CM'], 82, '1966, 1970'),
  sr('amullery',    'Alan Mullery',    'MID', ['CM'], 77, '1970'),
  sr('cbell',       'Colin Bell',      'MID', ['CM'], 80, '1970'),
  sr('ehughes',     'Emlyn Hughes',    'MID', ['CM'], 78, '1970'),
  sr('brobson',     'Bryan Robson',    'MID', ['CM'], 88, '1982, 1986, 1990'),
  sr('ghoddle',     'Glenn Hoddle',    'MID', ['CM'], 86, '1982, 1986'),
  sr('rwilkins',    'Ray Wilkins',     'MID', ['CM'], 79, '1982, 1986'),
  sr('preid',       'Peter Reid',      'MID', ['CM'], 76, '1986'),
  sr('gascoigne',   'Paul Gascoigne',  'MID', ['CM'], 89, '1990, 1998'),
  sr('dplatt',      'David Platt',     'MID', ['CM'], 79, '1990'),
  sr('pince',       'Paul Ince',       'MID', ['CM'], 79, '1998'),
  sr('dbatty',      'David Batty',     'MID', ['CM'], 74, '1998'),
  sr('pscholes',    'Paul Scholes',    'MID', ['CM'], 85, '1998, 2002'),
  sr('nbutt',       'Nicky Butt',      'MID', ['CM'], 77, '1998, 2002, 2006'),
  sr('kjdyer',      'Kieron Dyer',     'MID', ['CM'], 74, '2002, 2006'),
  sr('flampard',    'Frank Lampard',   'MID', ['CM'], 88, '2002, 2006, 2010, 2014'),
  sr('ohargreaves', 'Owen Hargreaves', 'MID', ['CM'], 78, '2002, 2006'),
  sr('jcole',       'Joe Cole',        'MID', ['CM'], 80, '2002, 2006, 2010'),
  sr('jjenas',      'Jermaine Jenas',  'MID', ['CM'], 74, '2006'),
  sr('mcarrick',    'Michael Carrick', 'MID', ['CM'], 79, '2006, 2010'),
  sr('gbarry',      'Gareth Barry',    'MID', ['CM'], 78, '2010, 2014'),
  sr('jmilner',     'James Milner',    'MID', ['CM'], 78, '2010, 2014'),
  sr('jwilshere',   'Jack Wilshere',   'MID', ['CM'], 79, '2014'),
  sr('jhenderson',  'Jordan Henderson','MID', ['CM'], 81, '2014, 2018, 2022'),
  sr('dalli',       'Dele Alli',       'MID', ['CM'], 79, '2018'),
  sr('jbellingham', 'Jude Bellingham', 'MID', ['CM'], 90, '2022'),
  sr('mmount',      'Mason Mount',     'MID', ['CM'], 82, '2022'),
  sr('cgallagher',  'Conor Gallagher', 'MID', ['CM'], 76, '2022'),
  sr('kphillips',   'Kalvin Phillips', 'MID', ['CM'], 77, '2022'),

  // ── RW ──────────────────────────────────────────────────────────────────────
  sr('beckham',    'David Beckham',          'ATT', ['RW'], 89, '1998, 2002, 2006'),
  sr('saka',       'Bukayo Saka',            'ATT', ['RW'], 89, '2022'),
  sr('foden',      'Phil Foden',             'ATT', ['RW'], 90, '2022'),
  sr('icallaghan', 'Ian Callaghan',          'ATT', ['RW'], 73, '1966'),
  sr('jconnelly',  'John Connelly',          'ATT', ['RW'], 72, '1966'),
  sr('tpaine',     'Terry Paine',            'ATT', ['RW'], 71, '1966'),
  sr('scoppell',   'Steve Coppell',          'ATT', ['RW'], 75, '1982'),
  sr('cwaddle',    'Chris Waddle',           'ATT', ['RW'], 82, '1986, 1990'),
  sr('tsteven',    'Trevor Steven',          'ATT', ['RW'], 76, '1986, 1990'),
  sr('tsinclairr', 'Trevor Sinclair',        'ATT', ['RW'], 73, '2002'),
  sr('swp',        'Shaun Wright-Phillips',  'ATT', ['RW'], 76, '2006, 2010'),
  sr('alennon',    'Aaron Lennon',           'ATT', ['RW'], 74, '2006, 2010'),
  sr('aoc',        'Alex Oxlade-Chamberlain','ATT', ['RW'], 77, '2014'),
  sr('jlingard',   'Jesse Lingard',          'ATT', ['RW'], 74, '2018'),

  // ── LW ──────────────────────────────────────────────────────────────────────
  sr('johnbarnes',    'John Barnes',      'ATT', ['LW'], 88, '1986, 1990'),
  sr('sterling',      'Raheem Sterling',  'ATT', ['LW'], 88, '2018, 2022'),
  sr('rashford',      'Marcus Rashford',  'ATT', ['LW'], 87, '2018, 2022'),

  sr('pbeardsley',    'Peter Beardsley',  'ATT', ['LW'], 83, '1986, 1990'),
  sr('pmerson',       'Paul Merson',      'ATT', ['LW'], 75, '1998'),
  sr('smcmanaman',    'Steve McManaman',  'ATT', ['LW'], 78, '1998, 2002'),
  sr('jgrealish',     'Jack Grealish',    'ATT', ['LW'], 82, '2022'),

  // ── ST ──────────────────────────────────────────────────────────────────────
  sr('hurst',       'Geoff Hurst',       'ATT', ['ST'], 91, '1966, 1970'),
  sr('lineker',     'Gary Lineker',      'ATT', ['ST'], 90, '1986, 1990'),
  sr('rooney',      'Wayne Rooney',      'ATT', ['ST'], 89, '2006, 2010, 2014'),
  sr('jgreaves',    'Jimmy Greaves',     'ATT', ['ST'], 88, '1966'),
  sr('rhunt',       'Roger Hunt',        'ATT', ['ST'], 80, '1966'),
  sr('jastle',      'Jeff Astle',        'ATT', ['ST'], 73, '1970'),
  sr('flee',        'Francis Lee',       'ATT', ['ST'], 76, '1970'),
  sr('posgood',     'Peter Osgood',      'ATT', ['ST'], 75, '1970'),
  sr('tfrancis',    'Trevor Francis',    'ATT', ['ST'], 80, '1982'),
  sr('twoodcock',   'Tony Woodcock',     'ATT', ['ST'], 74, '1982'),
  sr('pwithe',      'Peter Withe',       'ATT', ['ST'], 73, '1982'),
  sr('mhateley',    'Mark Hateley',      'ATT', ['ST'], 75, '1986'),
  sr('sbull',       'Steve Bull',        'ATT', ['ST'], 75, '1990'),
  sr('lferdinand',  'Les Ferdinand',     'ATT', ['ST'], 81, '1998'),
  sr('ashearer',    'Alan Shearer',      'ATT', ['ST'], 89, '1998'),
  sr('tsheringham', 'Teddy Sheringham',  'ATT', ['ST'], 82, '1998, 2002'),
  sr('rfowler',     'Robbie Fowler',     'ATT', ['ST'], 80, '1998'),
  sr('mowen',       'Michael Owen',      'ATT', ['ST'], 86, '1998, 2002, 2006'),
  sr('eheskey',     'Emile Heskey',      'ATT', ['ST'], 74, '2002, 2010'),
  sr('dvassell',    'Darius Vassell',    'ATT', ['ST'], 74, '2002'),
  sr('pcrouch',     'Peter Crouch',      'ATT', ['ST'], 78, '2006, 2010'),
  sr('jdefoe',      'Jermain Defoe',     'ATT', ['ST'], 79, '2010'),
  sr('dsturridge',  'Daniel Sturridge',  'ATT', ['ST'], 82, '2014'),
  sr('rlambert',    'Rickie Lambert',    'ATT', ['ST'], 73, '2014'),
  sr('dwelbeck',    'Danny Welbeck',     'ATT', ['ST'], 77, '2014, 2018'),
  sr('jvardy',      'Jamie Vardy',       'ATT', ['ST'], 81, '2018'),
  sr('hkane',       'Harry Kane',        'ATT', ['ST'], 91, '2018, 2022'),
  sr('cwilson',     'Callum Wilson',     'ATT', ['ST'], 75, '2022'),
  sr('itoney',      'Ivan Toney',        'ATT', ['ST'], 77, '2022'),

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
