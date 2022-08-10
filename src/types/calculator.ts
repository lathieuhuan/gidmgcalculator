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
  ResonanceVision,
} from "./global";
import { ATTACK_PATTERN_INFO_KEYS, TALENT_TYPES } from "@Src/constants";
import { MonsterConfig } from "@Data/monsters/types";

export type CalculatorState = {
  currentIndex: number;
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
  allElmtModCtrls: ElementModCtrl[];
  allCustomBuffCtrls: Array<CustomBuffCtrl[]>;
  allCustomDebuffCtrls: Array<CustomDebuffCtrl[]>;
  target: Target;
  monster: Monster;

  allTotalAttrs: TotalAttribute[];
  allartAttr: ArtifactAttribute[];
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
export type CalcArtPieceMainStat =
  | Exclude<CoreStat, "def">
  | ArtifactPercentStat
  | "em"
  | AttackElement
  | "healBn";

export type CalcArtPieceSubStat = CoreStat | ArtifactPercentStat | "em";

export type CalcArtPieceSubStatInfo = {
  type: CalcArtPieceSubStat;
  value: number;
};

export type CalcArtPiece = {
  ID: number;
  code: number;
  type: Artifact;
  rarity: Rarity;
  level: number;
  mainStatType: CalcArtPieceMainStat;
  subStats: CalcArtPieceSubStatInfo[];
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

export type Teammate = {
  name: string;
  buffCtrls: ModifierCtrl[];
  debuffCtrls: ModifierCtrl[];
};

export type Party = (Teammate | null)[];

export type ResonancePair = {
  vision: ResonanceVision;
  activated: boolean;
  inputs?: boolean[];
};

export type ElementModCtrl = {
  ampRxn: AmplifyingReaction | null;
  infusion_ampRxn: AmplifyingReaction | null;
  superconduct: boolean;
  resonance: ResonancePair[];
};

// #to-do
export type CustomBuffCtrlType = AttributeStat | AttackPatternBonusKey;

export type CustomBuffCtrl = {
  category: number;
  type: CustomBuffCtrlType;
  value: number;
};

export type CustomDebuffCtrlType = AttackElement | "def";

export type CustomDebuffCtrl = {
  type: CustomDebuffCtrlType;
  value: number;
};

export type Target = { level: number } & Record<AttackElement, number>;

export type Monster = {
  index: number;
  variantIndex: number | null;
  configs: MonsterConfig[];
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

export type DamageResult = Record<"NAs" | "ES" | "EB" | "RXN", CalculatedStatCluster>;

export type PartyData = {
  name: string;
  vision: Vision;
  nation: Nation;
  EBcost: number;
}[];
