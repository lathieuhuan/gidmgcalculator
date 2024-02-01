import {
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERN_INFO_KEYS,
  REACTION_BONUS_INFO_KEYS,
  TALENT_TYPES,
} from "@Src/constants";
import type { AttackElementPath, AttackPatternPath, ReactionBonusPath } from "@Src/utils/calculation";
import type { ActualAttackElement, AppCharacter, CalcItemType } from "./character";
import type {
  Artifact,
  AttackElement,
  AttackPattern,
  AttributeStat,
  CharInfo,
  CoreStat,
  NormalAttack,
  PartiallyRequired,
  Reaction,
  TotalAttributeStat,
  Vision,
  Weapon,
  WeaponType,
} from "./global";

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

export type ModifierInput = number;

export type ModifierCtrl = {
  activated: boolean;
  /** This is WeaponBuff.index / ArtifactBuff.index / Modifier_Character.index */
  index: number;
  inputs?: ModifierInput[];
};

export type CalcWeapon = Weapon;

export type CalcArtifact = Artifact;

export type CalcArtifacts = (CalcArtifact | null)[];

export type ArtifactSetBonus = {
  code: number;
  bonusLv: number;
};

export type ArtifactDebuffCtrl = ModifierCtrl & {
  code: number;
};

// PARTY starts
export type TeammateWeapon = {
  code: number;
  type: WeaponType;
  refi: number;
  buffCtrls: ModifierCtrl[];
};

export type TeammateArtifact = {
  code: number;
  buffCtrls: ModifierCtrl[];
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
  vision: Vision;
  activated: boolean;
  inputs?: ModifierInput[];
};

export type AttackReaction = null | "melt" | "vaporize" | "aggravate" | "spread";

export type ElementModCtrl = {
  infuse_reaction: AttackReaction;
  reaction: AttackReaction;
  absorption: Vision | null;
  superconduct: boolean;
  resonances: Resonance[];
};

export type CustomBuffCtrlCategory = "totalAttr" | "attPattBonus" | "attElmtBonus" | "rxnBonus";

export type CustomBuffCtrlType = AttributeStat | AttackPatternBonusKey | Reaction;

export type CustomBuffCtrl = {
  category: "totalAttr" | "attPattBonus" | "attElmtBonus" | "rxnBonus";
  type: CustomBuffCtrlType;
  subType?: AttackPatternInfoKey | AttackElementInfoKey | ReactionBonusInfoKey;
  value: number;
};

export type CustomDebuffCtrlType = ResistanceReductionKey;

export type CustomDebuffCtrl = {
  type: CustomDebuffCtrlType;
  value: number;
};

export type Target = {
  code: number;
  level: number;
  variantType?: Vision;
  inputs?: number[];
  resistances: Record<AttackElement, number>;
};

export type SetupImportInfo = {
  importRoute?: "url" | "highManager";
  ID?: number;
  name?: string;
  type?: "original" | "combined";
  calcSetup?: CalcSetup;
  target?: Target;
};

export type TotalAttribute = Record<TotalAttributeStat, number>;

export type ArtifactAttribute = PartiallyRequired<Partial<Record<AttributeStat, number>>, CoreStat>;

export type AttackPatternInfoKey = (typeof ATTACK_PATTERN_INFO_KEYS)[number];
export type AttackPatternInfo = Record<AttackPatternInfoKey, number>;
export type AttackPatternBonusKey = AttackPattern | "all";
export type AttackPatternBonus = Record<AttackPatternBonusKey, AttackPatternInfo>;

export type AttackElementInfoKey = (typeof ATTACK_ELEMENT_INFO_KEYS)[number];
export type AttacklementInfo = Record<AttackElementInfoKey, number>;
export type AttackElementBonus = Record<AttackElement, AttacklementInfo>;

export type ReactionBonusInfoKey = (typeof REACTION_BONUS_INFO_KEYS)[number];
export type ReactionBonusInfo = Record<ReactionBonusInfoKey, number>;
export type ReactionBonus = Record<Reaction, ReactionBonusInfo>;

export type CalcItemBuff = {
  ids: string | string[];
  bonus: CalcItemBonus;
};

export type ResistanceReductionKey = AttackElement | "def";
export type ResistanceReduction = Record<ResistanceReductionKey, number>;

export type Infusion = {
  element: AttackElement;
  range?: NormalAttack[];
};

export type Talent = (typeof TALENT_TYPES)[number];

type CalculatedDamage = {
  nonCrit: number | number[];
  crit: number | number[];
  average: number | number[];
  attElmt?: ActualAttackElement;
};

export type CalculatedDamageCluster = Record<string, CalculatedDamage>;

export type DamageResult = Record<"NAs" | "ES" | "EB" | "RXN", CalculatedDamageCluster>;

type TeammateData = Pick<AppCharacter, "code" | "name" | "icon" | "nation" | "vision" | "weaponType" | "EBcost">;

export type PartyData = (TeammateData | null)[];

export type BuffInfoWrap = {
  char: CharInfo;
  charData: AppCharacter;
  partyData: PartyData;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  calcItemBuffs: CalcItemBuff[];
  rxnBonus: ReactionBonus;
  infusedElement?: AttackElement;
  tracker?: Tracker;
};

export type DebuffInfoWrap = {
  char: CharInfo;
  resistReduct: ResistanceReduction;
  charData: AppCharacter;
  partyData: PartyData;
  tracker?: Tracker;
};

export type CalcItemBonus = Partial<Record<AttackPatternInfoKey, { desc: string; value: number }>>;

// Tracker

export type TrackerRecord = {
  desc: string;
  value: number;
};

export type TrackerCalcItemRecord = {
  itemType: CalcItemType;
  multFactors: Array<{
    desc?: string;
    value: number;
    talentMult?: number;
  }>;
  totalFlat?: number;
  normalMult: number;
  specialMult?: number;
  rxnMult?: number;
  defMult?: number;
  resMult?: number;
  cRate_?: number;
  cDmg_?: number;
  note?: string;
  exclusives?: CalcItemBonus[];
};

export type Tracker = {
  totalAttr: Record<TotalAttributeStat, TrackerRecord[]>;
  attPattBonus: Record<AttackPatternPath, TrackerRecord[]>;
  attElmtBonus: Record<AttackElementPath, TrackerRecord[]>;
  rxnBonus: Record<ReactionBonusPath, TrackerRecord[]>;
  resistReduct: Record<ResistanceReductionKey, TrackerRecord[]>;
  NAs: Record<string, TrackerCalcItemRecord>;
  ES: Record<string, TrackerCalcItemRecord>;
  EB: Record<string, TrackerCalcItemRecord>;
  RXN: Record<string, TrackerCalcItemRecord>;
};
