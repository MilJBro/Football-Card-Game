import type { GameModeDef, ModeId } from '@/store/types';

// The 6 standalone challenges. Each is a separate season simulation; squads do
// not carry over between them. Difficulty raises the bar your squad must clear.
export const GAME_MODES: GameModeDef[] = [
  {
    id: 'domestic-double',
    name: 'Domestic Double',
    description:
      'Sweep the domestic cups in a single season. Win both the FA Cup and the League Cup.',
    difficulty: 2,
    recommendedRating: 80,
    firstReward: 2500,
    repeatReward: 800,
    winConditionText: 'Win the FA Cup and the League Cup',
  },
  {
    id: 'european-glory',
    name: 'European Glory',
    description: 'Conquer the continent. Lift the Champions League trophy.',
    difficulty: 3,
    recommendedRating: 85,
    firstReward: 3500,
    repeatReward: 1200,
    winConditionText: 'Win the Champions League',
  },
  {
    id: 'iron-defence',
    name: 'Iron Defence',
    description:
      'Build an impenetrable backline and rule the league. Concede fewer than 15 goals across the season and win the title.',
    difficulty: 5,
    recommendedRating: 89,
    firstReward: 6000,
    repeatReward: 1800,
    winConditionText: 'Concede under 15 goals and win the Premier League',
  },
  {
    id: 'centurions',
    name: 'Centurions',
    description:
      'Record-breaking dominance. Reach 100 points or more and win the Premier League.',
    difficulty: 3,
    recommendedRating: 84,
    firstReward: 4000,
    repeatReward: 1400,
    winConditionText: 'Reach 100+ points and win the Premier League',
  },
  {
    id: 'invincibles',
    name: 'Invincibles',
    description:
      'Go the entire league season unbeaten and win the title. No defeats allowed.',
    difficulty: 4,
    recommendedRating: 86,
    firstReward: 5500,
    repeatReward: 1800,
    winConditionText: 'Go unbeaten and win the Premier League',
  },
  {
    id: 'quadruple',
    name: 'The Quadruple',
    description:
      'Football immortality. Win the Premier League, FA Cup, League Cup and Champions League in one season.',
    difficulty: 5,
    recommendedRating: 88,
    firstReward: 9000,
    repeatReward: 3000,
    winConditionText: 'Win the Premier League, FA Cup, League Cup and Champions League',
  },
];

export const MODE_BY_ID: Record<ModeId, GameModeDef> = Object.fromEntries(
  GAME_MODES.map((m) => [m.id, m])
) as Record<ModeId, GameModeDef>;

export function getMode(modeId: string): GameModeDef | undefined {
  return MODE_BY_ID[modeId as ModeId];
}
