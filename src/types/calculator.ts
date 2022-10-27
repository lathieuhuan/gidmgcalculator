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
  TransformativeReaction,
  Tracker,
} from "./global";
import { ATTACK_PATTERN_INFO_KEYS, TALENT_TYPES } from "@Src/constants";

export type SetupType = "original" | "combined" | "complex";

export type CalcSetupManageInfo = {
  ID: number;
  type: SetupType;
  name: string;
};

export type CalcSetup = {
  char: CharInfo;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];

  weapon: CalcWeapon;
  wpBuffCtrls: ModifierCtrl[];
  subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl;

  artInfo: CalcArtInfo;
  artBuffCtrls: ModifierCtrl[];
  subArtBuffCtrls: SubArtModCtrl[];
  subArtDebuffCtrls: SubArtModCtrl[];

  party: Party;
  elmtModCtrls: ElementModCtrl;
  customBuffCtrls: CustomBuffCtrl[];
  customDebuffCtrls: CustomDebuffCtrl[];
};

export type TCharData = {
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
export type ArtPieceMainStat =
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
  mainStatType: ArtPieceMainStat;
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
  weapon: {
    code: number;
    refi: number;
    buffCtrls: ModifierCtrl[];
  };
  artifact: null | {
    code: number;
    buffCtrls: ModifierCtrl[];
    debuffCtrls: ModifierCtrl[];
  };
};

export type Party = (Teammate | null)[];

export type Resonance = {
  vision: ResonanceVision;
  activated: boolean;
  inputs?: boolean[];
};

export type ElementModCtrl = {
  ampRxn: AmplifyingReaction | null;
  infusion_ampRxn: AmplifyingReaction | null;
  superconduct: boolean;
  aggravate: boolean;
  spread: boolean;
  resonances: Resonance[];
};

export type CustomBuffCtrlType = AttributeStat | AttackPatternBonusKey | TransformativeReaction;

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
  code: number;
  variantType: Vision | null;
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

type CalculatedDamage = Record<"nonCrit" | "crit" | "average", number | number[]>;

type CalculatedDamageCluster = {
  [k: string]: CalculatedDamage;
};

export type DamageResult = Record<"NAs" | "ES" | "EB" | "RXN", CalculatedDamageCluster>;

export type PartyData = TCharData[];

export type BuffModifierArgsWrapper = {
  char: CharInfo;
  charData: TCharData;
  partyData: PartyData;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  rxnBonus: ReactionBonus;
  infusion: FinalInfusion;
  tracker?: Tracker;
};
