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
  Tracker,
} from "./calculator";
import { EModAffect } from "@Src/constants";

export type AppCharacter = {
  code: number;
  name: string;
  beta?: boolean;
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
  activeTalents: {
    NAs: ActiveTalent;
    ES: ActiveTalent;
    EB: ActiveTalent;
  };
  patternActs: {
    NA: PatternAct;
    CA: PatternAct;
    PA: PatternAct;
    ES: PatternAct;
    EB: PatternAct;
  };
  passiveTalents: Ability[];
  constellation: Ability[];
  innateBuffs?: InnateBuff[];
  buffs?: AbilityBuff[];
  debuffs?: AbilityDebuff[];
};

type Ability = {
  name: string;
  image?: string;
  description?: string;
};

type ActiveTalent = Ability & {
  bonusLvAtCons?: number;
  energyCost?: number;
};

export type TalentAttributeType = "base_atk" | "atk" | "def" | "hp" | "em";

export type ActualAttackPattern = AttackPattern | "none";

export type ActualAttackElement = AttackElement | "various";

type PatternActMultFactor = {
  root: number;
  /** When 0 stat not scale off talent level */
  scale?: number;
  /** Calc default to 'atk'. Only on ES / EB */
  attributeType?: TalentAttributeType;
};

export type PatternStat = {
  id?: string;
  name: string;
  type?: "attack" | "healing" | "shield" | "other";
  attPatt?: ActualAttackPattern;
  attElmt?: ActualAttackElement;
  subAttPatt?: "FCA";
  /**
   * Damage factors multiplying an attribute, scaling off talent level
   */
  multFactors: number | number[] | PatternActMultFactor | PatternActMultFactor[];
  multFactorsAreOne?: boolean;
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
};

type PatternAct = {
  multScale?: number;
  multAttributeType?: TalentAttributeType;
  stats: PatternStat[];
};

export type InnateBuff = {
  src: string;
  isGranted: (char: CharInfo) => boolean;
  desc: (args: { charData: CharData; partyData: PartyData; totalAttr: TotalAttribute }) => ReactNode;
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

// ============ BUFFS ============
export type BuffDescriptionArgs = Pick<
  ApplyCharBuffArgs,
  "toSelf" | "char" | "charData" | "charBuffCtrls" | "partyData" | "totalAttr" | "inputs"
>;

export type AbilityBuff = AbilityModifier & {
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  infuseConfig?: {
    overwritable: boolean;
    range?: NormalAttack[];
    disabledNAs?: boolean;
  };
  desc: (args: BuffDescriptionArgs) => ReactNode;
  applyBuff?: (args: ApplyCharBuffArgs) => void;
  applyFinalBuff?: (args: ApplyCharBuffArgs) => void;
};

export type ApplyCharBuffArgs = BuffModifierArgsWrapper & {
  inputs: ModifierInput[];
  toSelf: boolean;
  charBuffCtrls: ModifierCtrl[];
  desc: string;
};

// ============ DEBUFFS ============
export type AbilityDebuff = AbilityModifier & {
  affect?: EModAffect;
  inputConfigs?: ModInputConfig[];
  desc: (args: { fromSelf: boolean; char: CharInfo; inputs: ModifierInput[]; partyData: PartyData }) => ReactNode;
  applyDebuff?: (args: {
    resistReduct: ResistanceReduction;
    attPattBonus: AttackPatternBonus;
    char: CharInfo;
    inputs: ModifierInput[];
    partyData: PartyData;
    fromSelf: boolean;
    desc: string;
    tracker?: Tracker;
  }) => void;
};
