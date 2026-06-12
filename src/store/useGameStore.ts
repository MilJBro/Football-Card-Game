import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OwnedCard,
  ModeCompletion,
  TournamentRunResult,
  ModeId,
  Squad,
  TournamentStage,
} from '@/store/types';

export interface GameState {
  // ---- Collection (current run) ----
  ownedCards: Record<string, OwnedCard>;

  // ---- Modes ----
  completions: Record<string, ModeCompletion>;
  history: TournamentRunResult[];

  // ---- Identity ----
  teamName: string;

  // ---- Active run ----
  activeModeId: string | null;
  activeSquad: Squad | null;

  // ---- Tournament state ----
  /** Which stage is next to simulate. null = haven't started yet. */
  currentStage: TournamentStage | null;
  tournamentWon: boolean;
  tournamentEliminated: boolean;

  // ---- Upgrade tokens (current run) ----
  upgradeTokens: number;

  // ---- Actions: collection ----
  addCards: (cardIds: string[]) => void;

  // ---- Actions: modes ----
  recordRun: (result: TournamentRunResult) => void;

  // ---- Actions: identity ----
  setTeamName: (name: string) => void;

  // ---- Actions: active run ----
  setActiveModeId: (modeId: string | null) => void;
  setActiveSquad: (squad: Squad | null) => void;

  // ---- Actions: tournament progression ----
  startTournament: () => void;
  advanceStage: (nextStage: TournamentStage | null) => void;
  eliminateFromTournament: () => void;
  winTournament: () => void;
  restartRun: () => void;

  // ---- Actions: upgrade tokens ----
  addUpgradeToken: () => void;
  spendUpgradeToken: (cardId: string) => boolean;

  // ---- Dev / reset ----
  resetProgress: () => void;
  resetChallengeState: () => void;
}

const initialState = {
  ownedCards: {} as Record<string, OwnedCard>,
  completions: {} as Record<string, ModeCompletion>,
  history: [] as TournamentRunResult[],
  teamName: '',
  activeModeId: null as string | null,
  activeSquad: null as Squad | null,
  currentStage: null as TournamentStage | null,
  tournamentWon: false,
  tournamentEliminated: false,
  upgradeTokens: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addCards: (cardIds) =>
        set((s) => {
          const owned = { ...s.ownedCards };
          for (const cardId of cardIds) {
            if (!owned[cardId]) {
              owned[cardId] = { cardId, upgradeLevel: 0, acquiredAt: Date.now() };
            }
          }
          return { ownedCards: owned };
        }),

      recordRun: (result) =>
        set((s) => {
          const history = [result, ...s.history].slice(0, 50);
          const completions = { ...s.completions };
          if (result.success) {
            const prev = completions[result.modeId];
            completions[result.modeId] = {
              modeId: result.modeId,
              timesCompleted: (prev?.timesCompleted ?? 0) + 1,
              bestSquadRating: Math.max(prev?.bestSquadRating ?? 0, result.squadRating),
              firstCompletedAt: prev?.firstCompletedAt ?? Date.now(),
            };
          }
          return { history, completions };
        }),

      setTeamName: (name) => set({ teamName: name.slice(0, 25) }),

      setActiveModeId: (modeId) => set({ activeModeId: modeId }),
      setActiveSquad: (squad) => set({ activeSquad: squad }),

      startTournament: () => set({ currentStage: 'group', tournamentWon: false, tournamentEliminated: false }),

      advanceStage: (nextStage) =>
        set({ currentStage: nextStage }),

      eliminateFromTournament: () =>
        set({ tournamentEliminated: true, currentStage: null }),

      winTournament: () =>
        set({ tournamentWon: true, currentStage: null }),

      restartRun: () =>
        set({
          ownedCards: {},
          activeSquad: null,
          currentStage: null,
          tournamentWon: false,
          tournamentEliminated: false,
          upgradeTokens: 0,
        }),

      addUpgradeToken: () => set((s) => ({ upgradeTokens: s.upgradeTokens + 1 })),

      spendUpgradeToken: (cardId) => {
        const s = get();
        if (s.upgradeTokens <= 0) return false;
        const owned = s.ownedCards[cardId];
        if (!owned || (owned.upgradeLevel ?? 0) >= 2) return false;
        set({
          upgradeTokens: s.upgradeTokens - 1,
          ownedCards: {
            ...s.ownedCards,
            [cardId]: { ...owned, upgradeLevel: ((owned.upgradeLevel ?? 0) + 1) as 0 | 1 | 2 },
          },
        });
        return true;
      },

      resetProgress: () => set({ ...initialState }),

      resetChallengeState: () =>
        set((s) => ({
          ownedCards: {},
          activeSquad: null,
          currentStage: null,
          tournamentWon: false,
          tournamentEliminated: false,
          upgradeTokens: 0,
          completions: s.completions,
          history: s.history,
          teamName: s.teamName,
        })),
    }),
    {
      name: 'football-card-game-v4',
      version: 4,
    }
  )
);

export function getModeCompletion(
  completions: Record<string, ModeCompletion>,
  modeId: ModeId
): ModeCompletion | undefined {
  return completions[modeId];
}
