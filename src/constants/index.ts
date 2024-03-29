import { ModInputType } from "@Src/types";

export * from "./character-stats";

export const MAX_USER_WEAPONS = 200;
export const MAX_USER_ARTIFACTS = 800;
export const MAX_USER_SETUPS = 50;
export const MAX_CALC_SETUPS = 4;
export const INVENTORY_PAGE_SIZE = 60;

export const GENSHIN_DEV_URL = {
  base: "https://genshin.jmp.blue",
  character: (name: string) => `${GENSHIN_DEV_URL.base}/characters/${name}`,
};

export const BACKEND_URL = {
  base: import.meta.env.DEV ? "http://localhost:3001/api" : "https://gidmgcalculator-lathieuhuan.vercel.app/api",
  metadata() {
    return `${this.base}/meta-data`;
  },
  character: {
    byName: (name: string) => `${BACKEND_URL.base}/character?name=${name}`,
  },
  weapon: {
    byCode: (code: number) => `${BACKEND_URL.base}/weapon?code=${code}`,
  },
};

export enum EScreen {
  CALCULATOR = "Calculator",
  MY_SETUPS = "My Setups",
  MY_WEAPONS = "My Weapons",
  MY_ARTIFACTS = "My Artifacts",
  MY_CHARACTERS = "My Characters",
}

export enum EModAffect {
  SELF = "self",
  TEAMMATE = "teammate",
  SELF_TEAMMATE = "self teammate",
  PARTY = "party",
  ONE_UNIT = "one unit",
  ACTIVE_UNIT = "active unit",
}

/** Don't change the items order of any array below */

export const WEAPON_TYPES = ["sword", "claymore", "catalyst", "polearm", "bow"] as const;

export const ARTIFACT_TYPES = ["flower", "plume", "sands", "goblet", "circlet"] as const;

export const ELEMENT_TYPES = ["pyro", "hydro", "electro", "cryo", "geo", "anemo", "dendro"] as const;

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

export const ATTACK_ELEMENTS = [...ELEMENT_TYPES, "phys"] as const;

export const TALENT_TYPES = ["NAs", "ES", "EB", "altSprint"] as const;

export const BASE_STAT_TYPES = ["base_hp", "base_atk", "base_def"] as const;

export const CORE_STAT_TYPES = ["hp", "atk", "def"] as const;

export const ARTIFACT_SUBSTAT_TYPES = [
  "hp",
  "hp_",
  "atk",
  "atk_",
  "def",
  "def_",
  "em",
  "er_",
  "cRate_",
  "cDmg_",
] as const;

export const ATTRIBUTE_STAT_TYPES = [
  ...CORE_STAT_TYPES,
  "hp_",
  "atk_",
  "def_",
  "em",
  "er_",
  "cRate_",
  "cDmg_",
  ...ATTACK_ELEMENTS,
  "healB_",
  "inHealB_",
  "shieldS_",
  "naAtkSpd_",
  "caAtkSpd_",
] as const;

export const ATTACK_PATTERN_INFO_KEYS = ["pct_", "flat", "cRate_", "cDmg_", "mult_", "defIgn_", "multPlus"] as const;

export const ATTACK_ELEMENT_INFO_KEYS = ["flat", "cRate_", "cDmg_"] as const;

export const REACTION_BONUS_INFO_KEYS = ["pct_", "cRate_", "cDmg_"] as const;

// export const ELEMENT_ICONS = {
//   pyro: "e/e8/Element_Pyro",
//   cryo: "8/88/Element_Cryo",
//   hydro: "3/35/Element_Hydro",
//   electro: "7/73/Element_Electro",
//   anemo: "a/a4/Element_Anemo",
//   geo: "4/4a/Element_Geo",
//   dendro: "f/f4/Element_Dendro",
// };

export const WEAPON_TYPE_ICONS: Array<{ type: (typeof WEAPON_TYPES)[number]; icon: string }> = [
  { type: "bow", icon: "9/97/Weapon-class-bow-icon" },
  { type: "catalyst", icon: "0/02/Weapon-class-catalyst-icon" },
  { type: "claymore", icon: "5/51/Weapon-class-claymore-icon" },
  { type: "polearm", icon: "9/91/Weapon-class-polearm-icon" },
  { type: "sword", icon: "9/95/Weapon-class-sword-icon" },
];

export const ARTIFACT_TYPE_ICONS: Array<{ type: (typeof ARTIFACT_TYPES)[number]; icon: string }> = [
  { type: "flower", icon: "2/2d/Icon_Flower_of_Life" },
  { type: "plume", icon: "8/8b/Icon_Plume_of_Death" },
  { type: "sands", icon: "9/9f/Icon_Sands_of_Eon" },
  { type: "goblet", icon: "3/37/Icon_Goblet_of_Eonothem" },
  { type: "circlet", icon: "6/64/Icon_Circlet_of_Logos" },
];

export const TRANSFORMATIVE_REACTIONS = [
  "bloom",
  "hyperbloom",
  "burgeon",
  "burning",
  "swirl",
  "superconduct",
  "electroCharged",
  "overloaded",
  "shattered",
] as const;

export const QUICKEN_REACTIONS = ["spread", "aggravate"] as const;

export const AMPLIFYING_REACTIONS = ["melt", "vaporize"] as const;

export const REACTIONS = [...TRANSFORMATIVE_REACTIONS, ...QUICKEN_REACTIONS, ...AMPLIFYING_REACTIONS] as const;

export const BASE_REACTION_DAMAGE: Record<number, number> = {
  1: 17.17,
  20: 80.58,
  40: 207.38,
  50: 323.6,
  60: 492.88,
  70: 765.64,
  80: 1077.44,
  90: 1446.85,
};

export const RESONANCE_ELEMENT_TYPES = ["pyro", "cryo", "geo", "hydro", "dendro"];

export const DEFAULT_WEAPON_CODE = {
  bow: 11,
  catalyst: 36,
  claymore: 59,
  polearm: 84,
  sword: 108,
};

export const DEFAULT_MODIFIER_INITIAL_VALUES: Record<ModInputType, number> = {
  check: 0,
  level: 1,
  text: 0,
  select: 1,
  stacks: 1,
  anemoable: 0,
  dendroable: 0,
};
