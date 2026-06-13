import type { GameModeDef, ModeId } from '@/store/types';

export const GAME_MODES: GameModeDef[] = [
  {
    id: 'england',
    name: 'Golden XI',
    description:
      'Build your England squad from historic internationals and guide them through the World Cup — group stage, knockouts, all the way to the final.',
    winConditionText: 'Win the World Cup Final',
  },
];

export const MODE_BY_ID: Record<ModeId, GameModeDef> = Object.fromEntries(
  GAME_MODES.map((m) => [m.id, m])
) as Record<ModeId, GameModeDef>;

export function getMode(modeId: string): GameModeDef | undefined {
  return MODE_BY_ID[modeId as ModeId];
}
