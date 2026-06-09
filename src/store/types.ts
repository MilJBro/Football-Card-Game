// ============================================================================
// Core domain types — single source of truth for the whole app.
// ============================================================================

export type Position = 'GK' | 'RB' | 'CB' | 'LB' | 'CM' | 'RW' | 'LW' | 'ST';

/** Broad category — used for pack grouping and out-of-position penalties. */
export type PositionCategory = 'GK' | 'DEF' | 'MID' | 'ATT';

/** The pack categories players are grouped into in the shop. */
export type PackCategory = 'GK' | 'DEF' | 'MID' | 'ATT';

export type Tier = 'Rising' | 'Star' | 'Legend';

export type Formation = '4-3-3' | '4-4-2' | '3-5-2';

export type ModeId =
  | 'domestic-double'
  | 'european-glory'
  | 'quadruple'
  | 'iron-defence'
  | 'invincibles'
  | 'centurions';

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

/** A single card definition: one player at one career era (tier). */
export interface PlayerCardDef {
  /** Unique card id, e.g. "rooney-legend". */
  id: string;
  /** Stable player id shared across tiers, e.g. "rooney". */
  playerId: string;
  playerName: string;
  /** Player's nationality, e.g. "England". */
  nationality: string;
  /** Club name at this tier, e.g. "Man Utd". */
  club: string;
  /** Season / year this card represents, e.g. "2011". */
  season: string;
  /** Club + year shown as the era subtitle, e.g. "Man Utd · 2011". */
  era: string;
  /** Pack category this card is sold under. */
  pack: PackCategory;
  tier: Tier;
  /** One or two natural positions (historical). Max 2. */
  positions: Position[];
  /** Single overall rating, 1-99. */
  rating: number;
}

/** A card the player owns in their collection. */
export interface OwnedCard {
  cardId: string;
  quantity: number;
  /** True once a duplicate has been acquired (quantity >= 2). */
  isFoilUnlocked: boolean;
  /** Whether the user is displaying the foil skin. */
  isFoilEquipped: boolean;
  acquiredAt: number;
}

// ---------------------------------------------------------------------------
// Packs
// ---------------------------------------------------------------------------

/** Pack rarity buckets (cheapest → most expensive). */
export type PackRarity = 'squad' | 'firstteam' | 'elite';

export interface PackDef {
  id: string; // e.g. "att-elite"
  name: string; // e.g. "Attacker Elite Pack"
  pack: PackCategory;
  rarity: PackRarity;
  cost: number;
  cardCount: number;
  description: string;
  /** Draw odds across the three card grades (weights, need not sum to 100). */
  weights: Record<Tier, number>;
}

// ---------------------------------------------------------------------------
// Squad
// ---------------------------------------------------------------------------

/** A slot on the pitch. `label` is what is shown (e.g. CDM); `accepts` is the
 *  natural position group that incurs no penalty. */
export interface FormationSlot {
  slotId: string;
  /** Displayed label on the pitch (RM, CDM, CF, etc.). */
  label: string;
  /** Natural position for this slot (used for penalty calculation). */
  naturalPosition: Position;
}

export interface FormationDef {
  formation: Formation;
  slots: FormationSlot[]; // always 11
}

/** A built squad: which card occupies each slot. */
export interface Squad {
  formation: Formation;
  /** slotId -> cardId (or null if empty). */
  assignments: Record<string, string | null>;
}

// ---------------------------------------------------------------------------
// Game modes
// ---------------------------------------------------------------------------

export interface GameModeDef {
  id: ModeId;
  name: string;
  description: string;
  /** 1-5 difficulty stars. */
  difficulty: number;
  /** Suggested squad rating to have a realistic chance. */
  recommendedRating: number;
  /** Coins awarded on first completion. */
  firstReward: number;
  /** Coins awarded on repeat completions. */
  repeatReward: number;
  /** Human-readable win condition. */
  winConditionText: string;
}

/** A simulated season's results. */
export interface SeasonResult {
  // League
  leaguePosition: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  // Cups: did we win them?
  wonLeague: boolean;
  wonFaCup: boolean;
  wonLeagueCup: boolean;
  wonChampionsLeague: boolean;
  unbeaten: boolean;
}

export interface ModeRunResult {
  modeId: ModeId;
  season: SeasonResult;
  success: boolean;
  reward: number;
  squadRating: number;
  playedAt: number;
}

export interface ModeCompletion {
  modeId: ModeId;
  timesCompleted: number;
  bestSquadRating: number;
  firstCompletedAt: number;
}

// ---------------------------------------------------------------------------
// Coins / transactions
// ---------------------------------------------------------------------------

export interface CoinTransaction {
  amount: number; // positive = earned, negative = spent
  reason: string;
  at: number;
}
