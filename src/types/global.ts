import {
  VISION_TYPES,
  WEAPON_TYPES,
  ARTIFACT_TYPES,
  LEVELS,
  PERCENT_STAT_TYPES,
  TARGET_RESISTANCES_TYPES,
  REACTIONS,
  NORMAL_ATTACKS,
  BASE_STAT_TYPES,
  FLAT_STAT_TYPES,
  ALL_STAT_TYPES,
  ATTACK_PATTERNS,
} from "@Src/constants";

export type Nation = "mondstadt" | "liyue" | "inazuma" | "sumeru";

export type Rarity = 1 | 2 | 3 | 4 | 5;

export type Level = typeof LEVELS[number];

export type Weapon = typeof WEAPON_TYPES[number];

export type Artifact = typeof ARTIFACT_TYPES[number];

export type Vision = typeof VISION_TYPES[number];

export type BaseStat = typeof BASE_STAT_TYPES[number];

export type FlatStat = typeof FLAT_STAT_TYPES[number];

export type PercentStat = typeof PERCENT_STAT_TYPES[number];

export type AllStat = typeof ALL_STAT_TYPES[number];

export type RngPercentStat = Exclude<PercentStat, "shStr" | "naAtkSpd" | "caAtkSpd">;

export type CommonStat = FlatStat | RngPercentStat | "shStr";

export type NormalAttack = typeof NORMAL_ATTACKS[number];

export type AttackElement = "elmt" | "phys";

export type AttackPattern = typeof ATTACK_PATTERNS[number];

export type Tracker = any;

export type TargetResistance = typeof TARGET_RESISTANCES_TYPES[number];

export type AmplifyingReaction = "melt" | "vaporize";

export type Reaction = typeof REACTIONS[number];

export type CharInfo = {
  name: string;
  level: Level;
  NAs: number;
  ES: number;
  EB: number;
  cons: number;
};

// #to-do
export type ModifierInput = string | number;


/**
 * utility generic
 */
export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;