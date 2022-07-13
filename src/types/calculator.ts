import type {
  Artifact,
  AttackElement,
  AttackPattern,
  Level,
  Nation,
  Vision,
  Weapon,
  AmplifyingReaction,
  Reaction,
  CharInfo,
  ModifierInput,
  Rarity,
  ArtifactPercentStat,
  CoreStat,
  AttributeStat,
  PartiallyRequired,
  NormalAttack,
  BaseStat,
  PartiallyOptional,
} from "./global";
import { SKILL_BONUS_INFO_KEYS, TALENT_TYPES } from "@Src/constants";

export type CalculatorState = {
  currentSetup: number;
  configs: {
    separateCharInfo: boolean;
    keepArtStatsOnSwitch: boolean;
  };
  setups: CalcSetup[];
  char: CalcChar;
  charData: CalcCharData;
  allSelfBuffCtrls: Array<ModifierCtrl[]>;
  allSelfDebuffCtrls: Array<ModifierCtrl[]>;
  allWps: CalcWeapon[];
  allSubWpComplexBuffCtrls: SubWeaponComplexBuffCtrl[];
  allSubWpComplexDebuffCtrls: {};
  allArtInfo: CalcArtInfo[];
  allParties: Party[];
  allElmtModCtrls: ElementModCtrl[];
  allCustomBuffCtrls: Array<CustomBuffCtrl[]>;
  allCustomDebuffCtrls: Array<CustomDebuffCtrl[]>;
  target: Target;
  monster: Monster;
  allTotalAttrs: TotalAttribute[];
  allArtAttrs: ArtifactAttribute[];
  allRxnBonuses: ReactionBonus[];
  allFinalInfusion: FinalInfusion[];
  allDmgResult: DamageResult[];
  isError: boolean;
  touched: boolean;
};

export type SetupType = "original" | "";

export type CalcSetup = {
  name: string;
  ID: number;
  type: SetupType;
};

type ComplexCharInfo = {
  name: string;
  level: Level[];
  NAs: number[];
  ES: number[];
  EB: number[];
  cons: number[];
};

export type CalcChar = CharInfo | ComplexCharInfo;

export type CalcCharData = {
  code: number;
  name: string;
  nation: Nation;
  vision: Vision;
  weapon: Weapon;
  EBcost: number;
};

export type ModifierCtrl = {
  activated: boolean;
  index: number;
  inputs?: (number | string)[];
};

export type CalcWeapon = {
  ID: number;
  type: Weapon;
  code: number;
  level: Level;
  refi: number;
  buffCtrls: ModifierCtrl[];
};

export type SubWeaponBuffCtrl = {
  code: number;
  activated: boolean;
  refi: number;
  index: number;
  inputs?: ModifierInput[];
};

export type SubWeaponComplexBuffCtrl = Partial<Record<Weapon, SubWeaponBuffCtrl[]>>;

// ARTIFACTS starts
export type CalcArtPiece = {
  ID: number;
  code: number;
  type: Artifact;
  rarity: Rarity;
  level: number;
  mainStatType: Exclude<CoreStat, "def"> | ArtifactPercentStat | "em" | AttackElement | "healBn";
  subStats: {
    type: string;
    value: number;
  }[];
};

export type CalcArtPieces = (CalcArtPiece | null)[];

export type CalcArtSet = {
  code: number;
  bonusLv: number;
};

export type SubArtModCtrl = ModifierCtrl & {
  code: number;
};

export type CalcArtInfo = {
  pieces: CalcArtPieces;
  sets: CalcArtSet[];
  buffCtrls: ModifierCtrl[];
  subBuffCtrls: SubArtModCtrl[];
  subDebuffCtrls: SubArtModCtrl[];
};
// ARTIFACTS ends

export type Teammate = {
  name: string;
  buffCtrls: ModifierCtrl[];
  debuffCtrls: ModifierCtrl[];
};
export type Party = (Teammate | null)[];

export type Resonance = {
  vision: Extract<Vision, "pyro" | "cryo" | "geo">;
  activated: boolean;
}[];

export type ElementModCtrl = {
  naAmpRxn: AmplifyingReaction | null;
  ampRxn: AmplifyingReaction | null;
  superconduct: boolean;
  resonance: Resonance;
};

export type CustomBuffCtrl = {
  // #to-do
  type: AttributeStat | SkillBonusKey;
  value: number;
  category: number;
};

export type CustomDebuffCtrl = {
  type: AttackElement | "def";
  value: number;
};

export type Target = { level: number } & Record<AttackElement, number>;

export type Monster = {
  index: number;
  variantIndex: number | null;
  configs: (number | string)[];
};

// export type TotalAttribute = PartiallyOptional<
//   Record<BaseStat | AttributeStat, number>,
//   "hp_" | "atk_" | "def_"
// >;
export type TotalAttribute = Record<BaseStat | AttributeStat, number>;

export type ArtifactAttribute = PartiallyRequired<Partial<Record<AttributeStat, number>>, CoreStat>;

export type SkillBonusInfoKey = typeof SKILL_BONUS_INFO_KEYS[number];

export type SkillBonusInfo = Record<SkillBonusInfoKey, number>;

export type SkillBonusKey = AttackPattern | AttackElement | "all";

export type SkillBonus = Record<SkillBonusKey, SkillBonusInfo>;

export type ReactionBonusKey = Reaction | "na_melt" | "na_vaporize";

export type ReactionBonus = Record<ReactionBonusKey, number>;

export type ResistanceReduction = Record<AttackElement | "def", number>;

export type DefenseIgnore = Record<AttackPattern, number>;

export type FinalInfusion = Record<NormalAttack, AttackElement>;

export type Talent = typeof TALENT_TYPES[number];

type CalculatedStat = Record<"nonCrit" | "crit" | "average", number | number[]>;

type CalculatedStatCluster = {
  [k: string]: CalculatedStat;
};

export type DamageResult = Record<Talent | "RXN", CalculatedStatCluster>;

export type PartyData = {
  name: string;
  vision: Vision;
  nation: Nation;
  EBcost: number;
}[];
