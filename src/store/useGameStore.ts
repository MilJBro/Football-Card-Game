import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OwnedCard,
  ModeCompletion,
  TournamentRunResult,
  ModeId,
  Squad,
  TournamentStage,
  MatchResult,
  OtherGroupMatch,
  Nation,
  EnglandManager,
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
  /** Manager assigned by the wheel for this run — locks the formation. */
  manager: EnglandManager | null;

  // ---- Tournament state ----
  /** Which stage is next to simulate. null = haven't started yet. */
  currentStage: TournamentStage | null;
  /** England's three group opponents, drawn before the tournament starts. */
  groupOpponents: Nation[];
  /** Group matches played so far this tournament (max 3). */
  groupMatches: MatchResult[];
  /** The other two teams' fixtures, one per matchday — feeds the live table. */
  otherGroupMatches: OtherGroupMatch[];
  /** Pre-drawn opponent for the next knockout stage. */
  nextOpponent: Nation | null;
  tournamentWon: boolean;
  tournamentEliminated: boolean;


  // ---- Actions: collection ----
  addCards: (cardIds: string[]) => void;

  // ---- Actions: modes ----
  recordRun: (result: TournamentRunResult) => void;

  // ---- Actions: identity ----
  setTeamName: (name: string) => void;

  // ---- Actions: active run ----
  setActiveModeId: (modeId: string | null) => void;
  setActiveSquad: (squad: Squad | null) => void;
  setManager: (manager: EnglandManager | null) => void;

  // ---- Actions: tournament progression ----
  startTournament: () => void;
  setGroupOpponents: (nations: Nation[]) => void;
  recordGroupMatch: (match: MatchResult) => void;
  recordOtherGroupMatch: (match: OtherGroupMatch) => void;
  setNextOpponent: (nation: Nation | null) => void;
  advanceStage: (nextStage: TournamentStage | null) => void;
  eliminateFromTournament: () => void;
  winTournament: () => void;
  restartRun: () => void;


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
  manager: null as EnglandManager | null,
  currentStage: null as TournamentStage | null,
  groupOpponents: [] as Nation[],
  groupMatches: [] as MatchResult[],
  otherGroupMatches: [] as OtherGroupMatch[],
  nextOpponent: null as Nation | null,
  tournamentWon: false,
  tournamentEliminated: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
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
      setManager: (manager) => set({ manager }),

      // Keeps groupOpponents — the group is drawn before kick-off.
      startTournament: () =>
        set({
          currentStage: 'group',
          groupMatches: [],
          otherGroupMatches: [],
          nextOpponent: null,
          tournamentWon: false,
          tournamentEliminated: false,
        }),

      setGroupOpponents: (nations) => set({ groupOpponents: nations }),

      recordGroupMatch: (match) =>
        set((s) => ({ groupMatches: [...s.groupMatches, match] })),

      recordOtherGroupMatch: (match) =>
        set((s) => ({ otherGroupMatches: [...s.otherGroupMatches, match] })),

      setNextOpponent: (nation) => set({ nextOpponent: nation }),

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
          manager: null,
          currentStage: null,
          groupOpponents: [],
          groupMatches: [],
          otherGroupMatches: [],
          nextOpponent: null,
          tournamentWon: false,
          tournamentEliminated: false,
        }),

      resetProgress: () => set({ ...initialState }),

      resetChallengeState: () =>
        set((s) => ({
          ownedCards: {},
          activeSquad: null,
          manager: null,
          currentStage: null,
          groupOpponents: [],
          groupMatches: [],
          otherGroupMatches: [],
          nextOpponent: null,
          tournamentWon: false,
          tournamentEliminated: false,
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
