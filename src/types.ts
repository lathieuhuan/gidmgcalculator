import {
  VISION_TYPES,
  WEAPON_TYPES,
  ARTIFACT_TYPES,
  LEVELS,
  PERCENT_STAT_TYPES,
  TARGET_RESISTANCES_TYPES,
  REACTIONS,
  NORMAL_ATTACKS,
} from "./constants";

export type Nation = "mondstadt" | "liyue" | "inazuma" | "sumeru";

export type Rarity = 1 | 2 | 3 | 4 | 5;

export type Level = typeof LEVELS[number];

export type Weapon = typeof WEAPON_TYPES[number];

export type Artifact = typeof ARTIFACT_TYPES[number];

export type Vision = typeof VISION_TYPES[number];

export type BaseStat = "base_hp" | "base_atk" | "base_def";

export type FlatStat = "hp" | "atk" | "def" | "em";

export type PercentStat = typeof PERCENT_STAT_TYPES[number];

export type AllStat = BaseStat | FlatStat | PercentStat;

export type RngPercentStat = Exclude<
  PercentStat,
  "shStr" | "naAtkSpd" | "caAtkSpd"
>;

export type CommonStat = FlatStat | RngPercentStat | "shStr";

export type NormalAttack = typeof NORMAL_ATTACKS[number];

export type AttackElement = "elmt" | "phys";

export type AttackPattern = NormalAttack | "ES" | "EB";

export type Tracker = any;

export type ModAffect = "self" | "teammate" | "party";

export type AmplifyingReaction = "melt" | "vaporize";

export type TargetResistance = typeof TARGET_RESISTANCES_TYPES[number];

export type Reaction = typeof REACTIONS[number];

export interface CharInfo {
  name: string;
  level: Level;
  NAs: number;
  ES: number;
  EB: number;
  cons: number;
}
