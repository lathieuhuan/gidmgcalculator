import { AttackDamageType } from "./types";

export enum EScreen {
  CALCULATOR = "Calculator",
  MY_SETUPS = "MySetups",
  MY_WEAPONS = "MyWeapons",
  MY_ARTIFACTS = "MyArtifacts",
  MY_CHARACTERS = "MyCharacters",
}

export enum EModifierSrc {
  A1 = "Ascension 1 Passive Talent",
  A4 = "Ascension 4 Passive Talent",
  C1 = "Constellation 1",
  C2 = "Constellation 2",
  C4 = "Constellation 4",
  C6 = "Constellation 6",
}

export enum EModAffect {
  SELF = "self",
  TEAMMATE = "teammate",
  PARTY = "party",
}

export const WEAPON_TYPES = ["sword", "claymore", "catalyst", "polearm", "bow"] as const;

export const ARTIFACT_TYPES = ["flower", "plume", "sands", "goblet", "circlet"] as const;

export const VISION_TYPES = ["pyro", "hydro", "electro", "cryo", "geo", "anemo", "dendro"] as const;

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
] as const;

export const NORMAL_ATTACKS = ["NA", "CA", "PA"] as const;

export const ATTACK_PATTERNS = [...NORMAL_ATTACKS, "ES", "EB"] as const;

export const TALENT_TYPES = ["NAs", "ES", "EB"] as const;

// export const CHAR_INFO_FIELDS = ["level", ...TALENT_TYPES, "cons"] as const;

export const ATTACK_DAMAGE_TYPES = [...VISION_TYPES, "phys"] as const;

export const BASE_STAT_TYPES = ["base_hp", "base_atk", "base_def"] as const;

export const CORE_STAT_TYPES = ["hp", "atk", "def"] as const;

export const FLAT_STAT_TYPES = [...CORE_STAT_TYPES, "em"] as const;

export const ELEMENTAL_DMG_BONUS_TYPES = [
  "pyro_",
  "hydro_",
  "dendro_",
  "electro_",
  "anemo_",
  "cryo_",
  "geo_",
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
  ...ELEMENTAL_DMG_BONUS_TYPES,
  "phys_",
  "naAtkSpd",
  "caAtkSpd",
] as const;

export const ALL_STAT_TYPES = [
  ...BASE_STAT_TYPES,
  ...FLAT_STAT_TYPES,
  ...PERCENT_STAT_TYPES,
] as const;

export const ARTIFACT_SUBSTAT_TYPES = [
  "hp",
  "hp_",
  "atk",
  "atk_",
  "def",
  "def_%",
  "em",
  "em",
  "cRate",
  "cDmg",
] as const;

export const SKILL_BONUS_INFO_KEYS = [
  "cRate",
  "cDmg",
  "pct",
  "flat",
  "mult",
  "specialMult",
] as const;

export const TARGET_RESISTANCES_TYPES = [
  "pyro_res",
  "hydro_res",
  "dendro_res",
  "electro_res",
  "anemo_res",
  "cryo_res",
  "geo_res",
  "phys_res",
] as const;

export const DEBUFFS_MULTIPLIER_KEYS = [
  // reduce target's def and resistances
  "def_rd",
  "pyro_rd",
  "hydro_rd",
  "dendro_rd",
  "electro_rd",
  "anemo_rd",
  "cryo_rd",
  "geo_rd",
  "phys_rd",
  // ignore target's def by ATTACK_PATTERNS
  "NA_ig",
  "CA_ig",
  "PA_ig",
  "ES_ig",
  "EB_ig",
] as const;

export const VISION_ICONS = {
  pyro: "e/e8/Element_Pyro",
  cryo: "8/88/Element_Cryo",
  hydro: "3/35/Element_Hydro",
  electro: "7/73/Element_Electro",
  anemo: "a/a4/Element_Anemo",
  geo: "4/4a/Element_Geo",
  dendro: "f/f4/Element_Dendro",
};

export const WEAPON_ICONS: Record<typeof WEAPON_TYPES[number], string> = {
  bow: "9/97/Weapon-class-bow-icon",
  catalyst: "0/02/Weapon-class-catalyst-icon",
  claymore: "5/51/Weapon-class-claymore-icon",
  polearm: "9/91/Weapon-class-polearm-icon",
  sword: "9/95/Weapon-class-sword-icon",
};

export const TRANSFORMATIVE_REACTIONS = [
  "superconduct",
  "swirl",
  "electroCharged",
  "overloaded",
  "shattered",
] as const;

export const TRANSFORMATIVE_REACTION_INFO: Record<
  typeof TRANSFORMATIVE_REACTIONS[number],
  { mult: number; dmgType: AttackDamageType | "various" }
> = {
  superconduct: { mult: 1, dmgType: "cryo" },
  swirl: { mult: 1.2, dmgType: "various" },
  electroCharged: { mult: 2.4, dmgType: "electro" },
  overloaded: { mult: 4, dmgType: "pyro" },
  shattered: { mult: 3, dmgType: "phys" },
};

export const BASE_REACTION_DAMAGE: Record<number, number> = {
  1: 9,
  20: 40,
  40: 104,
  50: 162,
  60: 245,
  70: 383,
  80: 540,
  90: 725,
};

export const AMPLIFYING_ELEMENTS = ["pyro", "hydro", "cryo"];

export const AMPLIFYING_REACTIONS = ["melt", "vaporize"] as const;

export const REACTIONS = [...TRANSFORMATIVE_REACTIONS, ...AMPLIFYING_REACTIONS] as const;

export const RESONANCE_INFO = {
  pyro: {
    name: "Fervent Flames",
    key: "atk_",
    value: 25,
  },
  cryo: {
    name: "Shattering Ice",
    key: "cRate",
    value: 15,
  },
  geo: {
    name: "Enduring Rock",
    key: "shStr",
    value: 15,
  },
} as const;
