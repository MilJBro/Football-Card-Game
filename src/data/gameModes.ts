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
    focus: 'A balanced XI with no weak links survives cup ties best.',
  },
  {
    id: 'european-glory',
    name: 'European Tour',
    description:
      'Take on the best clubs on the continent. Navigate the knockout stages and bring the Champions League trophy home.',
    winConditionText: 'Win the Champions League',
    focus: 'Sharp attackers and midfielders win tight European knockouts.',
  },
  {
    id: 'iron-defence',
    name: 'Iron Defence',
    description:
      'Build an impenetrable backline and rule the league. Concede fewer than 15 goals across the season and win the title.',
    winConditionText: 'Concede under 15 goals and win the Premier League',
    focus: 'Pour upgrades into your goalkeeper and defenders.',
  },
  {
    id: 'centurions',
    name: 'Centurions',
    description:
      'Record-breaking dominance. Reach 100 points or more and win the Premier League.',
    winConditionText: 'Reach 100+ points and win the Premier League',
    focus: 'Load up your attack and midfield to rack up the points.',
  },
  {
    id: 'invincibles',
    name: 'Invincibles',
    description:
      'Go the entire league season unbeaten and win the title. No defeats allowed.',
    winConditionText: 'Go unbeaten and win the Premier League',
    focus: 'A miserly defence keeps you unbeaten — prioritise the back.',
  },
  {
    id: 'quadruple',
    name: 'The Quadruple',
    description:
      'Football immortality. Win the Premier League, FA Cup, League Cup and Champions League in one season.',
    winConditionText: 'Win the Premier League, FA Cup, League Cup and Champions League',
    focus: 'Every position must be elite — no passengers anywhere.',
  },
];

export const MODE_BY_ID: Record<ModeId, GameModeDef> = Object.fromEntries(
  GAME_MODES.map((m) => [m.id, m])
) as Record<ModeId, GameModeDef>;

export function getMode(modeId: string): GameModeDef | undefined {
  return MODE_BY_ID[modeId as ModeId];
}
