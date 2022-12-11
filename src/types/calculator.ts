import type {
  Artifact,
  AttackElement,
  AttackPattern,
  Level,
  Nation,
  Vision,
  Weapon,
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
} from "./global";
import type { Tracker } from "@Calculators/types";
import {
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERN_INFO_KEYS,
  REACTION_BONUS_INFO_KEYS,
  TALENT_TYPES,
} from "@Src/constants";

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
  artifacts: CalcArtifacts;
  artBuffCtrls: ModifierCtrl[];
  artDebuffCtrls: ArtifactDebuffCtrl[];

  party: Party;
  elmtModCtrls: ElementModCtrl;
  customBuffCtrls: CustomBuffCtrl[];
  customDebuffCtrls: CustomDebuffCtrl[];
  customInfusion: Infusion;
};

export type CharData = {
  code: number;
  name: string;
  icon: string;
  nation: Nation;
  vision: Vision;
  weapon: Weapon;
  EBcost: number;
};

export type ModifierInput = number;

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

// ARTIFACTS starts
export type ArtifactMainStat =
  | Exclude<CoreStat, "def">
  | ArtifactPercentStat
  | "em"
  | AttackElement
  | "healBn";

export type ArtifactSubStat = CoreStat | ArtifactPercentStat | "em";

export type ArtifactSubStatInfo = {
  type: ArtifactSubStat;
  value: number;
};

export type CalcArtifact = {
  ID: number;
  code: number;
  type: Artifact;
  rarity: Rarity;
  level: number;
  mainStatType: ArtifactMainStat;
  subStats: ArtifactSubStatInfo[];
};

export type CalcArtifacts = (CalcArtifact | null)[];

export type ArtifactSetBonus = {
  code: number;
  bonusLv: number;
};

export type ArtifactDebuffCtrl = ModifierCtrl & {
  code: number;
};
// ARTIFACTS ends

// PARTY starts
export type TeammateWeapon = {
  code: number;
  type: Weapon;
  refi: number;
  buffCtrls: ModifierCtrl[];
};

export type TeammateArtifact = {
  code: number;
  buffCtrls: ModifierCtrl[];
  debuffCtrls: ModifierCtrl[];
};

export type Teammate = {
  name: string;
  buffCtrls: ModifierCtrl[];
  debuffCtrls: ModifierCtrl[];
  weapon: TeammateWeapon;
  artifact: TeammateArtifact;
};

export type Party = (Teammate | null)[];
// PARTY ends

export type Resonance = {
  vision: ResonanceVision;
  activated: boolean;
  inputs?: ModifierInput[];
};

export type AttackReaction = null | "melt" | "vaporize" | "aggravate" | "spread";

export type ElementModCtrl = {
  infuse_reaction: AttackReaction;
  reaction: AttackReaction;
  superconduct: boolean;
  resonances: Resonance[];
};

export type CustomBuffCtrlType = AttributeStat | AttackPatternBonusKey | TransformativeReaction;

export type CustomBuffCtrl = {
  category: number;
  type: CustomBuffCtrlType;
  value: number;
};

export type CustomDebuffCtrlType = ResistanceReductionKey;

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

export type AttacklementInfoKey = typeof ATTACK_ELEMENT_INFO_KEYS[number];
export type AttacklementInfo = Record<AttacklementInfoKey, number>;
export type AttackElementBonus = Record<AttackElement, AttacklementInfo>;

export type ReactionBonusInfoKey = typeof REACTION_BONUS_INFO_KEYS[number];
export type ReactionBonusInfo = Record<ReactionBonusInfoKey, number>;
export type ReactionBonus = Record<Reaction, ReactionBonusInfo>;

export type ResistanceReductionKey = AttackElement | "def";
export type ResistanceReduction = Record<ResistanceReductionKey, number>;

export type Infusion = {
  element: AttackElement;
  range?: NormalAttack[];
};

export type Talent = typeof TALENT_TYPES[number];

type CalculatedDamage = {
  nonCrit: number | number[];
  crit: number | number[];
  average: number | number[];
};

export type CalculatedDamageCluster = {
  [k: string]: CalculatedDamage;
};

export type DamageResult = Record<"NAs" | "ES" | "EB" | "RXN", CalculatedDamageCluster>;

export type PartyData = (CharData | null)[];

export type BuffModifierArgsWrapper = {
  char: CharInfo;
  charData: CharData;
  partyData: PartyData;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  rxnBonus: ReactionBonus;
  infusedElement: AttackElement;
  tracker?: Tracker;
};

export type DebuffModifierArgsWrapper = {
  char: CharInfo;
  resistReduct: ResistanceReduction;
  attPattBonus: AttackPatternBonus;
  partyData: PartyData;
  tracker?: Tracker;
};
