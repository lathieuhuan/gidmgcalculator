import type { ReactNode } from "react";
import type {
  AttackElement,
  AttackPattern,
  Vision,
  Nation,
  Rarity,
  Weapon,
  CharInfo,
  Tracker,
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
  AttackPatternInfoKey,
  TotalAttribute,
  ModifierInput,
  BuffModifierArgsWrapper,
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
  weapon: Weapon;
  stats: number[][];
  bonusStat: {
    type: AttackElement | ArtifactPercentStat | "em" | "healBn";
    value: number;
  };
  NAsConfig: {
    name: string;
    getExtraStats?: GetExtraStatsFn;
  };
  activeTalents: {
    NA: NormalAttacks;
    CA: NormalAttacks;
    PA: NormalAttacks;
    ES: ElementalSkill;
    EB: ElementalBurst;
    // #to-check
    altSprint?: NoStatsAbility;
  };
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

export type TalentBuff = Partial<Record<AttackPatternInfoKey, { desc: string; value: number }>>;

export type GetTalentBuffFn = (args: GetTalentBuffArgs) => TalentBuff | void;

export type BaseStatType = "base_atk" | "atk" | "def" | "hp" | "em";

type ActualAttackPattern = AttackPattern | null;

type ActualAttackElement = AttackElement | "various";

export type SubAttackPattern = "FCA";

export type StatInfo = {
  name: string;
  attPatt?: ActualAttackPattern;
  subAttPatt?: SubAttackPattern;
  attElmt?: ActualAttackElement;
  multBase: number | number[];
  multType?: number;
  /** only on ES / EB */
  baseStatType?: BaseStatType;
  /**
   * If true, stat not listed in-game, just more calculation, e.g. total of all hits
   */
  notOfficial?: boolean;
  /**
   * If true, multBase and flat.base will not scale with talent level
   */
  isStatic?: boolean;
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
  };
  desc: (args: {
    toSelf: boolean;
    char: CharInfo;
    charData: CharData;
    charBuffCtrls: ModifierCtrl[];
    partyData: PartyData;
    totalAttr: TotalAttribute;
    inputs?: ModifierInput[];
  }) => ReactNode;
  applyBuff?: (args: ApplyCharBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharBuffArgs) => void;
};

export type ApplyCharBuffArgs = BuffModifierArgsWrapper & {
  inputs?: ModifierInput[];
  toSelf: boolean;
  charBuffCtrls: ModifierCtrl[];
  desc: string;
};

// DEBUFFS

export type ApplyCharDebuffFn = (args: {
  resistReduct: ResistanceReduction;
  attPattBonus: AttackPatternBonus;
  // may need in future
  // selfDebuffCtrls: ModifierCtrl[];
  char: CharInfo;
  inputs?: ModifierInput[];
  partyData: PartyData;
  fromSelf: boolean;
  desc?: string;
  tracker?: Tracker;
}) => void;

export type AbilityDebuff = AbilityModifier & {
  affect?: EModAffect;
  inputConfigs?: ModInputConfig[];
  desc: (args: {
    fromSelf: boolean;
    char: CharInfo;
    inputs?: ModifierInput[];
    partyData: PartyData;
  }) => ReactNode;
  applyDebuff?: ApplyCharDebuffFn;
};
