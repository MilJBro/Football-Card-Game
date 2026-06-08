import type { FormationDef, Formation, FormationSlot, Position } from '@/store/types';

// Each slot has an x/y position (percentage of the pitch, 0,0 = top-left) for
// rendering, a display label, and a natural position for penalty calculation.
export interface PitchSlot extends FormationSlot {
  x: number; // 0-100
  y: number; // 0-100 (0 = opponent goal / top, 100 = own goal / bottom)
}

export interface PitchFormation extends FormationDef {
  slots: PitchSlot[];
}

function slot(slotId: string, label: string, natural: Position, x: number, y: number): PitchSlot {
  return { slotId, label, naturalPosition: natural, x, y };
}

export const FORMATIONS: Record<Formation, PitchFormation> = {
  '4-3-3': {
    formation: '4-3-3',
    slots: [
      slot('gk', 'GK', 'GK', 50, 90),
      slot('lb', 'LB', 'LB', 15, 70),
      slot('lcb', 'CB', 'CB', 37, 72),
      slot('rcb', 'CB', 'CB', 63, 72),
      slot('rb', 'RB', 'RB', 85, 70),
      slot('lcm', 'CM', 'CM', 28, 48),
      slot('cm', 'CM', 'CM', 50, 50),
      slot('rcm', 'CM', 'CM', 72, 48),
      slot('lw', 'LW', 'LW', 18, 22),
      slot('st', 'ST', 'ST', 50, 18),
      slot('rw', 'RW', 'RW', 82, 22),
    ],
  },
  '4-4-2': {
    formation: '4-4-2',
    slots: [
      slot('gk', 'GK', 'GK', 50, 90),
      slot('lb', 'LB', 'LB', 15, 72),
      slot('lcb', 'CB', 'CB', 37, 74),
      slot('rcb', 'CB', 'CB', 63, 74),
      slot('rb', 'RB', 'RB', 85, 72),
      // Wide midfield slots labelled LM/RM but treated as winger positions.
      slot('lm', 'LM', 'LW', 15, 48),
      slot('lcm', 'CM', 'CM', 38, 50),
      slot('rcm', 'CM', 'CM', 62, 50),
      slot('rm', 'RM', 'RW', 85, 48),
      slot('lst', 'ST', 'ST', 35, 20),
      slot('rst', 'ST', 'ST', 65, 20),
    ],
  },
  '3-5-2': {
    formation: '3-5-2',
    slots: [
      slot('gk', 'GK', 'GK', 50, 90),
      slot('lcb', 'CB', 'CB', 28, 74),
      slot('ccb', 'CB', 'CB', 50, 76),
      slot('rcb', 'CB', 'CB', 72, 74),
      // Wing-backs stay as full-back positions (no RWB/LWB).
      slot('lwb', 'LB', 'LB', 10, 50),
      slot('lcm', 'CM', 'CM', 32, 52),
      slot('ccm', 'CM', 'CM', 50, 54),
      slot('rcm', 'CM', 'CM', 68, 52),
      slot('rwb', 'RB', 'RB', 90, 50),
      slot('lst', 'ST', 'ST', 38, 20),
      slot('rst', 'ST', 'ST', 62, 20),
    ],
  },
};

export function getFormation(formation: Formation): PitchFormation {
  return FORMATIONS[formation];
}

export const FORMATION_LIST: Formation[] = ['4-3-3', '4-4-2', '3-5-2'];
