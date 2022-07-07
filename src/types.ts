import {
  ELEMENT_TYPES,
  BASE_STAT_TYPE,
  FLAT_STAT_TYPES,
  ELEMENTAL_DMG_BONUS_TYPES,
  ATTACK_ELEMENT_DMG_BONUS_TYPES,
  RNG_PERCENT_STAT_TYPES,
  PERCENT_STAT_TYPES,
  WEAPON_TYPES,
  ARTIFACT_TYPES,
  ATTACK_PATTERN_TYPES,
  LEVELS,
} from "./constants";

export type Nation = "mondstadt" | "liyue" | "inazuma" | "sumeru";

export type Rarity = 1 | 2 | 3 | 4 | 5;

export type Level = typeof LEVELS[number];

export type Weapon = typeof WEAPON_TYPES[number];

export type Artifact = typeof ARTIFACT_TYPES[number];

export type Element = typeof ELEMENT_TYPES[number];

export type BaseStat = typeof BASE_STAT_TYPE[number];

export type FlatStat = typeof FLAT_STAT_TYPES[number];

export type ElementalDmgBonus = typeof ELEMENTAL_DMG_BONUS_TYPES[number];

export type AttackElementDmgBonus =
  typeof ATTACK_ELEMENT_DMG_BONUS_TYPES[number];

export type RngPercentStat = typeof RNG_PERCENT_STAT_TYPES[number];

export type PercentStat = typeof PERCENT_STAT_TYPES[number];

export type AttackPattern = typeof ATTACK_PATTERN_TYPES[number];

export type AttackElement = "elmt" | "phys";

export type AllStat = FlatStat | PercentStat;

export interface Tracker {}

export type ModAffect = "self" | "teammate" | "party";
