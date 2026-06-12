// ============================================================================
// Core domain types — single source of truth for the whole app.
// ============================================================================

export type Position = 'GK' | 'RB' | 'CB' | 'LB' | 'CM' | 'RW' | 'LW' | 'ST';

/** Broad category — used for pack grouping and out-of-position penalties. */
export type PositionCategory = 'GK' | 'DEF' | 'MID' | 'ATT';

/** The pack categories players are grouped into. */
export type PackCategory = 'GK' | 'DEF' | 'MID' | 'ATT';

export type Tier = 'Rising' | 'Star' | 'Legend';

export type Formation = '4-3-3' | '4-4-2' | '3-5-2';

/** A past England manager — the wheel assigns one per run, locking the formation. */
export interface EnglandManager {
  name: string;
  /** Years in charge of England, e.g. "1963–1974". */
  era: string;
  formation: Formation;
}

export type ModeId = 'england';

// ---------------------------------------------------------------------------
// World Cup tournament types
// ---------------------------------------------------------------------------

export type TournamentStage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'final';

export interface Nation {
  name: string;
  flag: string;
  rating: number;
}

export interface MatchResult {
  opponent: Nation;
  englandGoals: number;
  opponentGoals: number;
  /** Knockout only — won on penalties after a draw */
  penaltiesWin?: boolean;
  /** Knockout only — lost on penalties after a draw */
  penaltiesLoss?: boolean;
}


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
  /** Base (level 0) era string, e.g. "England · 1966". */
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
  /** How many times this card has been upgraded (0 = base, 2 = max). */
  upgradeLevel: 0 | 1 | 2;
  acquiredAt: number;
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
}

// ---------------------------------------------------------------------------
// Tournament run history
// ---------------------------------------------------------------------------

export interface TournamentRunResult {
  modeId: ModeId;
  success: boolean;
  /** How far England got (or 'won' on completion). */
  reachedStage: TournamentStage | 'won';
  squadRating: number;
  playedAt: number;
}

export interface ModeCompletion {
  modeId: ModeId;
  timesCompleted: number;
  bestSquadRating: number;
  firstCompletedAt: number;
}
