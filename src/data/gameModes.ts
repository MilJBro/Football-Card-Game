import type { GameModeDef, ModeId } from '@/store/types';

// The 6 standalone challenges. Each is a separate season simulation; squads do
// not carry over between them.
export const GAME_MODES: GameModeDef[] = [
  {
    id: 'domestic-double',
    name: 'Cup Run',
    description:
      'Back-to-back knockout runs in a single season. Go the distance in both domestic cups and lift two trophies.',
    winConditionText: 'Win the FA Cup and the League Cup',
    entryCost: 500,
  },
  {
    id: 'european-glory',
    name: 'European Tour',
    description:
      'Take on the best clubs on the continent. Navigate the knockout stages and bring the Champions League trophy home.',
    winConditionText: 'Win the Champions League',
    entryCost: 600,
  },
  {
    id: 'iron-defence',
    name: 'Iron Defence',
    description:
      "Build an impenetrable backline. Concede fewer than 15 goals across the entire season and claim the title — you'll need an elite squad, not just good defenders.",
    winConditionText: 'Concede under 15 goals and win the Premier League',
    entryCost: 600,
  },
  {
    id: 'centurions',
    name: 'Centurions',
    description:
      'Record-breaking dominance. Reach 100 points or more and win the Premier League.',
    winConditionText: 'Reach 100+ points and win the Premier League',
    entryCost: 600,
  },
  {
    id: 'invincibles',
    name: 'Invincibles',
    description:
      'Go the entire league season unbeaten and win the title. No defeats allowed.',
    winConditionText: 'Go unbeaten and win the Premier League',
    entryCost: 700,
  },
  {
    id: 'quadruple',
    name: 'The Quadruple',
    description:
      'Football immortality. Win the Premier League, FA Cup, League Cup and Champions League in one season.',
    winConditionText: 'Win the Premier League, FA Cup, League Cup and Champions League',
    entryCost: 1000,
  },
];

export const MODE_BY_ID: Record<ModeId, GameModeDef> = Object.fromEntries(
  GAME_MODES.map((m) => [m.id, m])
) as Record<ModeId, GameModeDef>;

export function getMode(modeId: string): GameModeDef | undefined {
  return MODE_BY_ID[modeId as ModeId];
}
