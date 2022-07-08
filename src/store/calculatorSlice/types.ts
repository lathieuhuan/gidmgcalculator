import type {
  AllStat,
  Artifact,
  CommonStat,
  AttackElement,
  AttackPattern,
  FlatStat,
  Level,
  Nation,
  Rarity,
  RngPercentStat,
  Vision,
  Weapon,
  AmplifyingReaction,
  TargetResistance,
  Reaction,
  NormalAttack,
  CharInfo,
} from "@Src/types";

export interface CalculatorState {
  currentSetup: number;
  configs: {
    separateCharInfo: boolean;
    keepArtStatsOnSwitch: boolean;
  };
  setups: CalcSetup[];
  char: CharInfo | null;
  charData: CalcCharData | null;
  allSelfBuffCtrls: Array<ModifierCtrl[]>;
  allSelfDebuffCtrls: Array<ModifierCtrl[]>;
  allWps: CalcWeapon[];
  allSubWpBuffCtrls: Partial<Record<Weapon, SubWeaponBuffCtrl[]>>;
  allSubWpDebuffCtrls: {};
  allArtInfo: CalcArtInfo[];
  allParties: [Teammate | null, Teammate | null, Teammate | null][];
  allElmtModCtrls: ElementModCtrl[];
  allCustomBuffCtrls: Array<CustomBuffCtrl[]>;
  allCustomDebuffCtrls: Array<CustomDebuffCtrl[]>;
  target: Target;
  monster: Monster | null;
  allTotalAttrs: TotalAttributes[];
  allArtAttrs: ArtifactAttribute[];
  allRxnBonuses: ReactionBonus[];
  allFinalInfusion: FinalInfusion[];
  allDmgResult: DamageResult[];
}

export type SetupType = "original" | "";

export interface CalcSetup {
  name: string;
  ID: number;
  type: SetupType;
}

export interface CalcCharData {
  code: number;
  name: string;
  nation: Nation;
  vision: Vision;
  weapon: Weapon;
  EBcost: number;
}

export interface ModifierCtrl {
  activated: boolean;
  index: number;
  inputs?: (number | string)[];
}

interface CalcWeapon {
  ID: number;
  type: Weapon;
  code: number;
  level: Level;
  refinement: number;
  buffCtrls: ModifierCtrl[];
}

interface SubWeaponBuffCtrl {
  code: number;
  activated: boolean;
  refinement: number;
  index: number;
}

// ARTIFACTS starts
export interface CalcArtPiece {
  ID: number;
  code: number;
  type: Artifact;
  rarity: Rarity;
  level: number;
  mainStatType: CommonStat;
  subStats: {
    type: CommonStat;
    value: number;
  }[];
}

export interface CalcArtSet {
  code: number;
  bonusLv: number;
}

interface CalcArtInfo {
  pieces: (CalcArtPiece | null)[];
  sets: CalcArtSet[];
  buffCtrls: ModifierCtrl[];
  subBuffCtrls: ModifierCtrl[];
  subDebuffCtrls: ModifierCtrl[];
}
// ARTIFACTS ends

interface Teammate {
  name: string;
  buffCtrls: ModifierCtrl[];
  debuffCtrls: ModifierCtrl[];
}

interface ElementModCtrl {
  naAmpRxn: AmplifyingReaction | null;
  ampRxn: AmplifyingReaction | null;
  superconduct: boolean;
  resonance: {
    vision: Vision;
    activated: boolean;
  }[];
}

interface CustomBuffCtrl {
  // #to-do
  type: CommonStat | "";
  value: number;
  category: number;
}

interface CustomDebuffCtrl {
  // #to-do
  type: "";
  value: number;
}

export interface Target extends Record<TargetResistance, number> {
  level: number;
}

interface Monster {
  index: number;
  inputs: (number | string)[];
}

export type TotalAttributes = Record<AllStat, number>;

export type ArtifactAttribute = Omit<Record<FlatStat, number>, "em"> &
  Partial<Record<RngPercentStat | "em", number>>;

export type SkillBonusInfoKey = "cRate" | "cDmg" | "pct" | "flat";

type SkillBonusInfo = Record<SkillBonusInfoKey, number>;

export type SkillBonusKey = AttackPattern | AttackElement | "all";

export type SkillBonus = Record<SkillBonusKey, SkillBonusInfo>;

export type ReactionBonusKey = Reaction | "naMelt" | "naVaporize";

export type ReactionBonus = Record<ReactionBonusKey, number>;

type FinalInfusion = Record<NormalAttack, AttackElement>;

type AttackDamage = Record<"nonCrit" | "crit" | "average", number>;

type SkillDamage = {
  [k: string]: AttackDamage;
};

type DamageResult = Record<"NAs" | "ES" | "EB" | "RXN", SkillDamage>;
