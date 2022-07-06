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
