import type { EnglandManager } from '@/store/types';

// Past England managers and the shape they sent their sides out in.
// The manager wheel picks one at random per run — their formation is the one
// you must play through the whole tournament.
export const ENGLAND_MANAGERS: EnglandManager[] = [
  { name: 'Alf Ramsey',          era: '1963–1974', formation: '4-3-3'   },
  { name: 'Don Revie',           era: '1974–1977', formation: '4-4-2'   },
  { name: 'Ron Greenwood',       era: '1977–1982', formation: '4-4-2'   },
  { name: 'Bobby Robson',        era: '1982–1990', formation: '3-5-2'   },
  { name: 'Graham Taylor',       era: '1990–1993', formation: '4-4-2'   },
  { name: 'Terry Venables',      era: '1994–1996', formation: '4-3-2-1' },
  { name: 'Glenn Hoddle',        era: '1996–1999', formation: '3-5-2'   },
  { name: 'Kevin Keegan',        era: '1999–2000', formation: '4-4-2'   },
  { name: 'Sven-Göran Eriksson', era: '2001–2006', formation: '4-4-2'   },
  { name: 'Steve McClaren',      era: '2006–2007', formation: '4-4-2'   },
  { name: 'Fabio Capello',       era: '2008–2011', formation: '4-2-3-1' },
  { name: 'Roy Hodgson',         era: '2012–2016', formation: '4-3-3'   },
  { name: 'Sam Allardyce',       era: '2016',      formation: '4-2-3-1' },
  { name: 'Gareth Southgate',    era: '2016–2024', formation: '3-5-2'   },
  { name: 'Thomas Tuchel',       era: '2025–',     formation: '4-2-3-1' },
];
