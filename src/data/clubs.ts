export interface PLClub {
  id: string;
  name: string;
  short: string;
  primary: string;
  secondary: string;
}

export const PL_CLUBS: PLClub[] = [
  { id: 'arsenal',        name: 'Arsenal',            short: 'ARS', primary: '#EF0107', secondary: '#023474' },
  { id: 'aston-villa',    name: 'Aston Villa',         short: 'AVL', primary: '#670E36', secondary: '#95BFE5' },
  { id: 'bournemouth',    name: 'Bournemouth',         short: 'BOU', primary: '#DA291C', secondary: '#000000' },
  { id: 'brentford',      name: 'Brentford',           short: 'BRE', primary: '#E30613', secondary: '#FFD700' },
  { id: 'brighton',       name: 'Brighton',            short: 'BHA', primary: '#0057B8', secondary: '#FFD700' },
  { id: 'chelsea',        name: 'Chelsea',             short: 'CHE', primary: '#034694', secondary: '#DBA111' },
  { id: 'crystal-palace', name: 'Crystal Palace',      short: 'CRY', primary: '#1B458F', secondary: '#C4122E' },
  { id: 'everton',        name: 'Everton',             short: 'EVE', primary: '#003399', secondary: '#FFFFFF' },
  { id: 'fulham',         name: 'Fulham',              short: 'FUL', primary: '#000000', secondary: '#FFFFFF' },
  { id: 'ipswich',        name: 'Ipswich Town',        short: 'IPS', primary: '#0044A9', secondary: '#FFFFFF' },
  { id: 'leicester',      name: 'Leicester City',      short: 'LEI', primary: '#003090', secondary: '#FDBE11' },
  { id: 'liverpool',      name: 'Liverpool',           short: 'LIV', primary: '#C8102E', secondary: '#F6EB61' },
  { id: 'man-city',       name: 'Man City',            short: 'MCI', primary: '#6CABDD', secondary: '#1C2C5B' },
  { id: 'man-united',     name: 'Man United',          short: 'MUN', primary: '#DA291C', secondary: '#FBE122' },
  { id: 'newcastle',      name: 'Newcastle',           short: 'NEW', primary: '#241F20', secondary: '#FFFFFF' },
  { id: 'nottm-forest',   name: "Nott'm Forest",       short: 'NFO', primary: '#DD0000', secondary: '#FFFFFF' },
  { id: 'southampton',    name: 'Southampton',         short: 'SOU', primary: '#D71920', secondary: '#130C0E' },
  { id: 'spurs',          name: 'Spurs',               short: 'TOT', primary: '#132257', secondary: '#FFFFFF' },
  { id: 'west-ham',       name: 'West Ham',            short: 'WHU', primary: '#7A263A', secondary: '#1BB1E7' },
  { id: 'wolves',         name: 'Wolves',              short: 'WOL', primary: '#FDB913', secondary: '#231F20' },
];
