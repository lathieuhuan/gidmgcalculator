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
  Rarity,
  ArtifactPercentStat,
  CoreStat,
  AttributeStat,
  PartiallyRequired,
  NormalAttack,
  BaseStat,
} from "./global";
import { ATTACK_PATTERN_INFO_KEYS, TALENT_TYPES } from "@Src/constants";

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

  allWeapons: CalcWeapon[];
  allWpBuffCtrls: Array<ModifierCtrl[]>;
  allSubWpComplexBuffCtrls: SubWeaponComplexBuffCtrl[];

  allArtInfos: CalcArtInfo[];
  allArtBuffCtrls: Array<ModifierCtrl[]>;
  allSubArtBuffCtrls: Array<SubArtModCtrl[]>;
  allSubArtDebuffCtrls: Array<SubArtModCtrl[]>;

  allParties: Party[];
  allTmBuffCtrls: Array<ModifierCtrl[]>;
  allTmDebuffCtrls: Array<ModifierCtrl[]>;

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

export type ModifierInput = string | number | boolean;

export type ModifierCtrl = {
  activated: boolean;
  index: number;
  inputs?: ModifierInput[];
};

export type CalcWeapon = {
  ID: number;
  type: Weapon;
  code: number;
  level: Level;
  refi: number;
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
    type: CoreStat | ArtifactPercentStat | "em";
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
};
// ARTIFACTS ends

export type Party = (string | null)[];

export type Resonance = {
  vision: Extract<Vision, "pyro" | "cryo" | "geo">;
  activated: boolean;
}[];

export type ElementModCtrl = {
  ampRxn: AmplifyingReaction | null;
  infusion_ampRxn: AmplifyingReaction | null;
  superconduct: boolean;
  resonance: Resonance;
};

export type CustomBuffCtrl = {
  // #to-do
  type: AttributeStat | AttackPatternBonusKey;
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

export type TotalAttribute = Record<BaseStat | AttributeStat, number>;

export type ArtifactAttribute = PartiallyRequired<Partial<Record<AttributeStat, number>>, CoreStat>;

export type AttackPatternInfoKey = typeof ATTACK_PATTERN_INFO_KEYS[number];
export type AttackPatternInfo = Record<AttackPatternInfoKey, number>;
export type AttackPatternBonusKey = AttackPattern | "all";
export type AttackPatternBonus = Record<AttackPatternBonusKey, AttackPatternInfo>;

export type AttacklementInfoKey = "cDmg" | "flat";
export type AttacklementInfo = Record<AttacklementInfoKey, number>;
export type AttackElementBonus = Record<AttackElement, AttacklementInfo>;

export type ReactionBonusKey = Reaction | "infusion_melt" | "infusion_vaporize";

export type ReactionBonus = Record<ReactionBonusKey, number>;

export type ResistanceReduction = Record<AttackElement | "def", number>;

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
