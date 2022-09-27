import {
  VISION_TYPES,
  WEAPON_TYPES,
  ARTIFACT_TYPES,
  LEVELS,
  REACTIONS,
  NORMAL_ATTACKS,
  CORE_STAT_TYPES,
  ARTIFACT_PERCENT_STAT_TYPES,
  BASE_STAT_TYPES,
  ATTRIBUTE_STAT_TYPES,
  ATTACK_ELEMENTS,
  RESONANCE_VISION_TYPES,
  TRANSFORMATIVE_REACTIONS,
} from "@Src/constants";

export type Nation =
  | "outland"
  | "mondstadt"
  | "liyue"
  | "inazuma"
  | "sumeru"
  | "natlan"
  | "fontaine"
  | "snezhnaya";

export type Rarity = 1 | 2 | 3 | 4 | 5;

export type Level = typeof LEVELS[number];

export type Weapon = typeof WEAPON_TYPES[number];

export type Artifact = typeof ARTIFACT_TYPES[number];

export type Vision = typeof VISION_TYPES[number];

export type ResonanceVision = typeof RESONANCE_VISION_TYPES[number];

export type NormalAttack = typeof NORMAL_ATTACKS[number];

export type AttackPattern = NormalAttack | "ES" | "EB";

export type AttackElement = typeof ATTACK_ELEMENTS[number];

export type CoreStat = typeof CORE_STAT_TYPES[number];

export type BaseStat = typeof BASE_STAT_TYPES[number];

export type ArtifactPercentStat = typeof ARTIFACT_PERCENT_STAT_TYPES[number];

export type AttributeStat = typeof ATTRIBUTE_STAT_TYPES[number];

export type Tracker = any;

export type AmplifyingReaction = "melt" | "vaporize";

export type Reaction = typeof REACTIONS[number];

export type TransformativeReaction = typeof TRANSFORMATIVE_REACTIONS[number];

export type CharInfo = {
  name: string;
  level: Level;
  NAs: number;
  ES: number;
  EB: number;
  cons: number;
};

/**
 * utility generic
 */
export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
