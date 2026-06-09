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

/** One upgrade step's worth of changed data. */
export interface CardUpgrade {
  rating: number;
  club: string;
  season: string;
  era: string;
  /** Only set when positions differ from the base card. */
  positions?: Position[];
}

/** A single card definition — one entry per player, with upgrade data embedded. */
export interface PlayerCardDef {
  /** Unique card id — equals playerId. */
  id: string;
  playerId: string;
  playerName: string;
  nationality: string;
  /** Base (level 0) club name. */
  club: string;
  /** Base (level 0) season year. */
  season: string;
  /** Base (level 0) era string, e.g. "Man Utd · 2011". */
  era: string;
  pack: PackCategory;
  /** Base (level 0) positions. */
  positions: Position[];
  /** Base (level 0) rating. */
  rating: number;
  /** [level-1 data, level-2 data] — two upgrade steps. */
  upgrades: [CardUpgrade, CardUpgrade];
}

/** A card the player owns in their collection. */
export interface OwnedCard {
  cardId: string;
  quantity: number;
  /** How many times this card has been upgraded (0 = base, 2 = max). */
  upgradeLevel: 0 | 1 | 2;
  /** True once a duplicate has been acquired (quantity >= 2). */
  isFoilUnlocked: boolean;
  /** Whether the user is displaying the foil skin. */
  isFoilEquipped: boolean;
  acquiredAt: number;
}

// ---------------------------------------------------------------------------
// Packs
// ---------------------------------------------------------------------------

export interface PackDef {
  id: string; // e.g. "att"
  name: string; // e.g. "Attacker Pack"
  pack: PackCategory;
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
  /** Human-readable win condition. */
  winConditionText: string;
  /** Coins deducted upfront to run this simulation. */
  entryCost: number;
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
  entryCost: number;
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
