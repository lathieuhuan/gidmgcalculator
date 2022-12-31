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
  ArtifactPercentStat,
  ModInputConfig,
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
    type: AttackElement | ArtifactPercentStat | "em" | "healBn";
    value: number;
  };
  NAsConfig: {
    name: string;
    getExtraStats?: GetExtraStatsFn;
  };
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

type NormalAttacks = {
  stats: StatInfo[];
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

export type BaseStatType = "base_atk" | "atk" | "def" | "hp" | "em";

export type ActualAttackPattern = AttackPattern | "none";

export type ActualAttackElement = AttackElement | "various";

export type SubAttackPattern = "FCA";

export type StatInfo = {
  name: string;
  attPatt?: ActualAttackPattern;
  subAttPatt?: SubAttackPattern;
  attElmt?: ActualAttackElement;
  multBase: number | number[];
  /** when 0 stat not scale with talent level */
  multType?: number;
  /** only on ES / EB */
  baseStatType?: BaseStatType;
  /**
   * If true, stat not listed in-game, just more calculation, e.g. total of all hits
   */
  isNotOfficial?: boolean;
  /**
   * If true, multBase and flat.base will not scale with talent level
   */
  // isStatic?: boolean;
  getTalentBuff?: GetTalentBuffFn;
  /** only on ES / EB */
  notAttack?: "healing" | "shield" | "other";

  /** only on ES / EB */
  flat?: {
    base: number;
    type: number;
  };
  /** only on ES / EB */
  getLimit?: (args: { totalAttr: TotalAttribute }) => number;
};

type ElementalSkill = {
  name: string;
  image: string;
  xtraLvAtCons?: 3 | 5;
  stats: StatInfo[];
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
