import {
  VISION_TYPES,
  WEAPON_TYPES,
  ARTIFACT_TYPES,
  LEVELS,
  REACTIONS,
  NORMAL_ATTACKS,
  CORE_STAT_TYPES,
  BASE_STAT_TYPES,
  ATTRIBUTE_STAT_TYPES,
  ATTACK_ELEMENTS,
  RESONANCE_VISION_TYPES,
  TRANSFORMATIVE_REACTIONS,
  ATTACK_PATTERNS,
} from "@Src/constants";

export type Nation = "outland" | "mondstadt" | "liyue" | "inazuma" | "sumeru" | "natlan" | "fontaine" | "snezhnaya";

export type Rarity = 1 | 2 | 3 | 4 | 5;

export type Level = (typeof LEVELS)[number];

export type WeaponType = (typeof WEAPON_TYPES)[number];

export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export type Vision = (typeof VISION_TYPES)[number];

export type ResonanceVision = (typeof RESONANCE_VISION_TYPES)[number];

export type NormalAttack = (typeof NORMAL_ATTACKS)[number];

export type AttackPattern = (typeof ATTACK_PATTERNS)[number];

export type AttackElement = (typeof ATTACK_ELEMENTS)[number];

export type CoreStat = (typeof CORE_STAT_TYPES)[number];

export type BaseStat = (typeof BASE_STAT_TYPES)[number];

export type AttributeStat = (typeof ATTRIBUTE_STAT_TYPES)[number];

export type AmplifyingReaction = "melt" | "vaporize";

export type QuickenReaction = "spread" | "aggravate";

export type Reaction = (typeof REACTIONS)[number];

export type TransformativeReaction = (typeof TRANSFORMATIVE_REACTIONS)[number];

export type CharInfo = {
  name: string;
  level: Level;
  NAs: number;
  ES: number;
  EB: number;
  cons: number;
};

export type ModInputType = "level" | "text" | "check" | "stacks" | "select" | "anemoable" | "dendroable";

export type ModInputConfig = {
  label?: string;
  type: ModInputType;
  for?: "self" | "teammate";
  /** See DEFAULT_MODIFIER_INITIAL_VALUES */
  initialValue?: number;
  max?: number;
  options?: string[];
};

/**
 * weapon used for calculation
 */
export type Weapon = {
  ID: number;
  type: WeaponType;
  code: number;
  level: Level;
  refi: number;
};

export type ArtifactSubStat = {
  type: AttributeStat;
  value: number;
};

/**
 * artifact used for calculation
 */
export type Artifact = {
  ID: number;
  code: number;
  type: ArtifactType;
  rarity: Rarity;
  level: number;
  mainStatType: AttributeStat;
  subStats: ArtifactSubStat[];
};

export type AppSettings = {
  charInfoIsSeparated: boolean;
  doKeepArtStatsOnSwitch: boolean;
  persistingUserData: boolean;
  charLevel: Level;
  charCons: number;
  charNAs: number;
  charES: number;
  charEB: number;
  wpLevel: Level;
  wpRefi: number;
  artLevel: number;
};

export type AppMessage = {
  active: boolean;
  type?: "error" | "success" | "info";
  content?: string;
};

/**
 * utility generic
 */
export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type StringRecord = Record<string, string>;

export type BooleanRecord = Record<string, boolean>;
