export enum EScreen {
  CALCULATOR = "Calculator",
  MY_SETUPS = "MySetups",
  MY_WEAPONS = "MyWeapons",
  MY_ARTIFACTS = "MyArtifacts",
  MY_CHARACTERS = "MyCharacters",
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

export const ATTACK_ELEMENTS = [...VISION_TYPES, "phys"] as const;

export const TALENT_TYPES = ["NAs", "ES", "EB", "altSprint"] as const;

export const BASE_STAT_TYPES = ["base_hp", "base_atk", "base_def"] as const;

export const CORE_STAT_TYPES = ["hp", "atk", "def"] as const;

// # to-check
export const ARTIFACT_PERCENT_STAT_TYPES = ["hp_", "atk_", "def_", "cRate", "cDmg", "er"] as const;

export const OTHER_PERCENT_STAT_TYPES = ["healBn", "shStr", "naAtkSpd", "caAtkSpd"] as const;

export const ATTRIBUTE_STAT_TYPES = [
  ...CORE_STAT_TYPES,
  "em",
  ...ARTIFACT_PERCENT_STAT_TYPES,
  ...ATTACK_ELEMENTS,
  ...OTHER_PERCENT_STAT_TYPES,
] as const;

export const ATTACK_PATTERN_INFO_KEYS = [
  "cRate",
  "cDmg",
  "pct",
  "flat",
  "mult",
  "defIgnore",
  "specialMult",
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

export const AMPLIFYING_ELEMENTS = ["pyro", "hydro", "cryo"];

export const AMPLIFYING_REACTIONS = ["melt", "vaporize"] as const;

export const REACTIONS = [...TRANSFORMATIVE_REACTIONS, ...AMPLIFYING_REACTIONS] as const;
