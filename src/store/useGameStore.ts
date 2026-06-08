import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OwnedCard,
  CoinTransaction,
  ModeCompletion,
  ModeRunResult,
  ModeId,
} from '@/store/types';
import { getCard, getNextTierCard } from '@/data/players';
import {
  STARTING_COINS,
  discardValue,
  dailyLoginReward,
  upgradeCost,
} from '@/lib/coinRewards';

export interface UpgradeResult {
  ok: boolean;
  reason?: string;
  newCardId?: string;
  foilUnlocked?: boolean;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86_400_000);
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

  // ---- Daily login ----
  lastLoginDate: string | null;
  loginStreak: number;

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

  // ---- Actions: daily login ----
  claimDailyLogin: () => number | null; // returns reward, or null if already claimed

  // ---- Dev / reset ----
  resetProgress: () => void;
}

const initialState = {
  coins: STARTING_COINS,
  totalEarned: STARTING_COINS,
  transactions: [] as CoinTransaction[],
  ownedCards: {} as Record<string, OwnedCard>,
  completions: {} as Record<string, ModeCompletion>,
  history: [] as ModeRunResult[],
  lastLoginDate: null as string | null,
  loginStreak: 0,
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
        const value = discardValue(card);

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
            { amount: value, reason: `Sold ${card.playerName} (${card.tier})`, at: Date.now() },
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
        const next = getNextTierCard(cardId);
        if (!card) return { ok: false, reason: 'Unknown card' };
        if (!next) return { ok: false, reason: 'Already at max tier' };

        const owned = s.ownedCards[cardId];
        if (!owned || owned.quantity < 1) return { ok: false, reason: 'You do not own this card' };

        const cost = upgradeCost(card.tier);
        if (s.coins < cost) return { ok: false, reason: 'Not enough coins' };

        // Consume one copy of the lower-tier card.
        const nextOwned = { ...s.ownedCards };
        if (owned.quantity <= 1) {
          delete nextOwned[cardId];
        } else {
          nextOwned[cardId] = { ...owned, quantity: owned.quantity - 1 };
        }

        // Add the upgraded card (may stack / unlock a foil if already owned).
        const existingNext = nextOwned[next.id];
        let foilUnlocked = false;
        if (!existingNext) {
          nextOwned[next.id] = {
            cardId: next.id,
            quantity: 1,
            isFoilUnlocked: false,
            isFoilEquipped: false,
            acquiredAt: Date.now(),
          };
        } else {
          const quantity = existingNext.quantity + 1;
          foilUnlocked = quantity >= 2 && !existingNext.isFoilUnlocked;
          nextOwned[next.id] = {
            ...existingNext,
            quantity,
            isFoilUnlocked: existingNext.isFoilUnlocked || quantity >= 2,
          };
        }

        set({
          ownedCards: nextOwned,
          coins: s.coins - cost,
          transactions: [
            { amount: -cost, reason: `Upgraded ${card.playerName} to ${next.tier}`, at: Date.now() },
            ...s.transactions,
          ].slice(0, 100),
        });

        return { ok: true, newCardId: next.id, foilUnlocked };
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

      claimDailyLogin: () => {
        const s = get();
        const today = todayISO();
        if (s.lastLoginDate === today) return null;

        const gap = s.lastLoginDate ? daysBetween(s.lastLoginDate, today) : null;
        const newStreak = gap === 1 ? s.loginStreak + 1 : 1;
        const reward = dailyLoginReward(newStreak);

        set({
          lastLoginDate: today,
          loginStreak: newStreak,
          coins: s.coins + reward,
          totalEarned: s.totalEarned + reward,
          transactions: [
            { amount: reward, reason: `Daily login (streak ${newStreak})`, at: Date.now() },
            ...s.transactions,
          ].slice(0, 100),
        });
        return reward;
      },

      resetProgress: () => set({ ...initialState }),
    }),
    {
      name: 'football-card-game-v1',
      version: 1,
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
