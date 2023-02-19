import type { ReactNode } from "react";
import type {
  AttackElement,
  AttackPattern,
  Vision,
  Nation,
  Rarity,
  WeaponType,
  CharInfo,
  NormalAttack,
  ModInputConfig,
  AttributeStat,
} from "./global";
import type {
  CharData,
  ModifierCtrl,
  PartyData,
  ResistanceReduction,
  AttackPatternBonus,
  TotalAttribute,
  ModifierInput,
  BuffModifierArgsWrapper,
  TalentBuff,
  Tracker,
} from "./calculator";
import { EModAffect } from "@Src/constants";

export type DataCharacter = {
  code: number;
  beta?: boolean;
  name: string;
  GOOD?: string;
  icon: string;
  sideIcon: string;
  rarity: Rarity;
  nation: Nation;
  vision: Vision;
  weaponType: WeaponType;
  stats: number[][];
  bonusStat: {
    type: AttributeStat;
    value: number;
  };
  NAsConfig: {
    name: string;
    getExtraStats?: GetExtraStatsFn;
  };
  isReverseXtraLv?: boolean;
  activeTalents: ActiveTalents;
  passiveTalents: NoStatsAbility[];
  constellation: NoStatsAbility[];
  innateBuffs?: InnateBuff[];
  buffs?: AbilityBuff[];
  debuffs?: AbilityDebuff[];
};

/**
 * extraStats are not calculated into damage results
 */
export type GetExtraStatsFn = (level: number) => {
  name: string;
  value: ReactNode;
}[];

type StatDefault = {
  /**
   * Common scale for stats' multFactors
   */
  multScale?: number;
  /**
   * Common attributeType for stats' multFactors
   */
  multAttributeType?: TalentStatAttributeType;
};

type NormalAttacks = StatDefault & {
  stats: TalentStat[];
};

type GetTalentBuffArgs = {
  char: CharInfo;
  charData: CharData;
  partyData: PartyData;
  totalAttr: TotalAttribute;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
};

export type GetTalentBuffFn = (args: GetTalentBuffArgs) => TalentBuff;

export type TalentStatAttributeType = "base_atk" | "atk" | "def" | "hp" | "em";

export type ActualAttackPattern = AttackPattern | "none";

export type ActualAttackElement = AttackElement | "various";

export type SubAttackPattern = "FCA";

type TalentStatMultFactor = {
  root: number;
  /** When 0 stat not scale off talent level */
  scale?: number;
  /** Calc default to 'atk'. Only on ES / EB */
  attributeType?: TalentStatAttributeType;
};

export type TalentStat = {
  name: string;
  attPatt?: ActualAttackPattern;
  subAttPatt?: SubAttackPattern;
  attElmt?: ActualAttackElement;
  /**
   * Damage factors multiplying an attribute, scaling off talent level
   */
  multFactors: number | number[] | TalentStatMultFactor | TalentStatMultFactor[];
  /**
   * Whether multFactors is sum or not
   */
  isWholeFactor?: boolean;
  /**
   * If true, stat not listed in-game, just more calculation, e.g. total of all hits
   */
  isNotOfficial?: boolean;
  getTalentBuff?: GetTalentBuffFn;
  /** only on ES / EB */
  notAttack?: "healing" | "shield" | "other";
  /**
   * Damage factor multiplying root, caling off talent level. Only on ES / EB
   */
  flatFactor?:
    | number
    | {
        root: number;
        /** Calc default to getTalentDefaultInfo's return.flatFactorScale.
         * When 0 not scale off talent level.
         */
        scale?: number;
      };
  /** only on ES / EB */
  getLimit?: (args: { totalAttr: TotalAttribute }) => number;
};

type ElementalSkill = StatDefault & {
  name: string;
  image: string;
  stats: TalentStat[];
  getExtraStats?: GetExtraStatsFn;
};

type ElementalBurst = ElementalSkill & { energyCost: number };

type NoStatsAbility = {
  name: string;
  image: string;
  desc?: JSX.Element;
  xtraDesc?: JSX.Element[];
};

export type ActiveTalents = {
  NA: NormalAttacks;
  CA: NormalAttacks;
  PA: NormalAttacks;
  ES: ElementalSkill;
  EB: ElementalBurst;
  // #to-check
  altSprint?: NoStatsAbility;
};

export type InnateBuff = {
  src: string;
  isGranted: (char: CharInfo) => boolean;
  desc: (args: {
    charData: CharData;
    partyData: PartyData;
    totalAttr: TotalAttribute;
  }) => ReactNode;
  applyBuff?: (args: ApplyCharInnateBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharInnateBuffArgs) => void;
};

type ApplyCharInnateBuffArgs = BuffModifierArgsWrapper & {
  charBuffCtrls: ModifierCtrl[];
  desc: string;
};

type AbilityModifier = {
  index: number;
  src: string;
  isGranted?: (char: CharInfo) => boolean;
};

// BUFFS

export type AbilityBuff = AbilityModifier & {
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  infuseConfig?: {
    overwritable: boolean;
    range?: NormalAttack[];
    disabledNAs?: boolean;
  };
  desc: (args: {
    toSelf: boolean;
    char: CharInfo;
    charData: CharData;
    charBuffCtrls: ModifierCtrl[];
    partyData: PartyData;
    totalAttr: TotalAttribute;
    inputs: ModifierInput[];
  }) => ReactNode;
  applyBuff?: (args: ApplyCharBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharBuffArgs) => void;
};

export type ApplyCharBuffArgs = BuffModifierArgsWrapper & {
  inputs: ModifierInput[];
  toSelf: boolean;
  charBuffCtrls: ModifierCtrl[];
  desc: string;
};

// DEBUFFS

type ApplyCharDebuffFn = (args: {
  resistReduct: ResistanceReduction;
  attPattBonus: AttackPatternBonus;
  char: CharInfo;
  inputs: ModifierInput[];
  partyData: PartyData;
  fromSelf: boolean;
  desc: string;
  tracker?: Tracker;
}) => void;

export type AbilityDebuff = AbilityModifier & {
  affect?: EModAffect;
  inputConfigs?: ModInputConfig[];
  desc: (args: {
    fromSelf: boolean;
    char: CharInfo;
    inputs: ModifierInput[];
    partyData: PartyData;
  }) => ReactNode;
  applyDebuff?: ApplyCharDebuffFn;
};
