import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OwnedCard,
  CoinTransaction,
  ModeCompletion,
  ModeRunResult,
  ModeId,
} from '@/store/types';
import { getCard } from '@/data/players';
import { STARTING_COINS, discardValue, upgradeCost } from '@/lib/coinRewards';

export interface UpgradeResult {
  ok: boolean;
  reason?: string;
  newCardId?: string;
  foilUnlocked?: boolean;
}

export interface GameState {
  // ---- Coins ----
  coins: number;
  totalEarned: number;
  transactions: CoinTransaction[];

  // ---- Collection ----
  ownedCards: Record<string, OwnedCard>;

  // ---- Modes ----
  completions: Record<string, ModeCompletion>;
  history: ModeRunResult[];

  // ---- Actions: coins ----
  addCoins: (amount: number, reason: string) => void;
  spendCoins: (amount: number, reason: string) => boolean;

  // ---- Actions: collection ----
  addCards: (cardIds: string[]) => { newCards: string[]; foilsUnlocked: string[] };
  discardCard: (cardId: string) => number; // returns coins gained, 0 if none
  toggleFoilEquipped: (cardId: string) => void;
  upgradeCard: (cardId: string) => UpgradeResult;

  // ---- Actions: modes ----
  recordRun: (result: ModeRunResult) => void;

  // ---- Dev / reset ----
  resetProgress: () => void;
  resetChallengeState: () => void;
}

const initialState = {
  coins: STARTING_COINS,
  totalEarned: STARTING_COINS,
  transactions: [] as CoinTransaction[],
  ownedCards: {} as Record<string, OwnedCard>,
  completions: {} as Record<string, ModeCompletion>,
  history: [] as ModeRunResult[],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addCoins: (amount, reason) =>
        set((s) => ({
          coins: s.coins + amount,
          totalEarned: s.totalEarned + Math.max(0, amount),
          transactions: [{ amount, reason, at: Date.now() }, ...s.transactions].slice(0, 100),
        })),

      spendCoins: (amount, reason) => {
        const s = get();
        if (s.coins < amount) return false;
        set({
          coins: s.coins - amount,
          transactions: [
            { amount: -amount, reason, at: Date.now() },
            ...s.transactions,
          ].slice(0, 100),
        });
        return true;
      },

      addCards: (cardIds) => {
        const newCards: string[] = [];
        const foilsUnlocked: string[] = [];
        set((s) => {
          const owned = { ...s.ownedCards };
          for (const cardId of cardIds) {
            const existing = owned[cardId];
            if (!existing) {
              owned[cardId] = {
                cardId,
                quantity: 1,
                upgradeLevel: 0,
                isFoilUnlocked: false,
                isFoilEquipped: false,
                acquiredAt: Date.now(),
              };
              newCards.push(cardId);
            } else {
              const quantity = existing.quantity + 1;
              const justUnlockedFoil = quantity >= 2 && !existing.isFoilUnlocked;
              if (justUnlockedFoil) foilsUnlocked.push(cardId);
              owned[cardId] = {
                ...existing,
                quantity,
                isFoilUnlocked: existing.isFoilUnlocked || quantity >= 2,
              };
            }
          }
          return { ownedCards: owned };
        });
        return { newCards, foilsUnlocked };
      },

      discardCard: (cardId) => {
        const s = get();
        const owned = s.ownedCards[cardId];
        const card = getCard(cardId);
        if (!owned || !card || owned.quantity < 1) return 0;
        const upgradeLevel = (owned.upgradeLevel ?? 0) as 0 | 1 | 2;
        const value = discardValue(card, upgradeLevel);

        const nextOwned = { ...s.ownedCards };
        if (owned.quantity <= 1) {
          delete nextOwned[cardId];
        } else {
          nextOwned[cardId] = { ...owned, quantity: owned.quantity - 1 };
        }

        set({
          ownedCards: nextOwned,
          coins: s.coins + value,
          totalEarned: s.totalEarned + value,
          transactions: [
            { amount: value, reason: `Sold ${card.playerName}`, at: Date.now() },
            ...s.transactions,
          ].slice(0, 100),
        });
        return value;
      },

      toggleFoilEquipped: (cardId) =>
        set((s) => {
          const owned = s.ownedCards[cardId];
          if (!owned || !owned.isFoilUnlocked) return s;
          return {
            ownedCards: {
              ...s.ownedCards,
              [cardId]: { ...owned, isFoilEquipped: !owned.isFoilEquipped },
            },
          };
        }),

      upgradeCard: (cardId) => {
        const s = get();
        const card = getCard(cardId);
        if (!card) return { ok: false, reason: 'Unknown card' };

        const owned = s.ownedCards[cardId];
        if (!owned || owned.quantity < 1) return { ok: false, reason: 'You do not own this card' };

        const currentLevel = (owned.upgradeLevel ?? 0) as 0 | 1 | 2;
        if (currentLevel >= 2) return { ok: false, reason: 'Already at max level' };

        const cost = upgradeCost(currentLevel);
        if (s.coins < cost) return { ok: false, reason: 'Not enough coins' };

        const newLevel = (currentLevel + 1) as 0 | 1 | 2;
        set({
          ownedCards: {
            ...s.ownedCards,
            [cardId]: { ...owned, upgradeLevel: newLevel },
          },
          coins: s.coins - cost,
          transactions: [
            { amount: -cost, reason: `Upgraded ${card.playerName} to level ${newLevel}`, at: Date.now() },
            ...s.transactions,
          ].slice(0, 100),
        });

        return { ok: true };
      },

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

      resetProgress: () => set({ ...initialState }),

      resetChallengeState: () =>
        set((s) => ({
          coins: STARTING_COINS,
          totalEarned: STARTING_COINS,
          transactions: [],
          ownedCards: {},
          // completions and history are cross-challenge — keep them
          completions: s.completions,
          history: s.history,
        })),
    }),
    {
      name: 'football-card-game-v2',
      version: 2,
    }
  )
);

// Convenience selector helpers (used across pages).
export function getModeCompletion(
  completions: Record<string, ModeCompletion>,
  modeId: ModeId
): ModeCompletion | undefined {
  return completions[modeId];
}
