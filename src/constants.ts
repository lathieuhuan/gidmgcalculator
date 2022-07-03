export enum EScreen {
  CALCULATOR = "Calculator",
  MY_SETUPS = "MySetups",
  MY_WEAPONS = "MyWeapons",
  MY_ARTIFACTS = "MyArtifacts",
  MY_CHARACTERS = "MyCharacters",
}

export const WEAPON_TYPES = [
  "sword",
  "claymore",
  "catalyst",
  "polearm",
  "bow",
] as const;

export const ARTIFACT_TYPES = [
  "flower",
  "plume",
  "sands",
  "goblet",
  "circlet",
] as const;

export const ELEMENT_TYPES = [
  "pyro",
  "hydro",
  "electro",
  "cryo",
  "geo",
  "anemo",
  "dendro",
] as const;

export const ATTACK_ELEMENT_TYPES = [
  "pyro",
  "hydro",
  "electro",
  "cryo",
  "geo",
  "anemo",
  "dendro",
  "phys",
] as const;

export const ATTACK_PATTERN_TYPES = ["NA", "CA", "PA", "ES", "EB"] as const;

export const BASE_STAT_TYPE = ["base_hp", "base_atk", "base_def"] as const;

export const FLAT_STAT_TYPES = ["hp", "atk", "def", "em"] as const;

export const ELEMENTAL_DMG_BONUS_TYPES = [
  "pyro_",
  "hydro_",
  "dendro_",
  "electro_",
  "anemo_",
  "cryo_",
  "geo_",
] as const;

export const ATTACK_ELEMENT_DMG_BONUS_TYPES = [
  "pyro_",
  "hydro_",
  "dendro_",
  "electro_",
  "anemo_",
  "cryo_",
  "geo_",
  "phys_",
] as const;

export const RNG_PERCENT_STAT_TYPES = [
  "hp_",
  "atk_",
  "def_",
  "cRate",
  "cDmg",
  "healBn",
  "er",
  "pyro_",
  "hydro_",
  "dendro_",
  "electro_",
  "anemo_",
  "cryo_",
  "geo_",
  "phys_",
] as const;

export const PERCENT_STAT_TYPES = [
  "hp_",
  "atk_",
  "def_",
  "cRate",
  "cDmg",
  "healBn",
  "er",
  "shStr",
  "pyro_",
  "hydro_",
  "dendro_",
  "electro_",
  "anemo_",
  "cryo_",
  "geo_",
  "phys_",
  "naAtkSpd",
  "caAtkSpd",
] as const;

export const LEVELS = [
  "1/20",
  "20/20",
  "20/40",
  "40/40",
  "40/50",
  "50/50",
  "50/60",
  "60/60",
  "60/70",
  "70/70",
  "70/80",
  "80/80",
  "80/90",
  "90/90",
];
