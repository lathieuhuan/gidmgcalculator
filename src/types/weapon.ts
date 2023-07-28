import type { ReactNode } from "react";
import type { Rarity, ModInputConfig, AttributeStat, PartiallyOptional } from "./global";
import type {
  AttackPatternBonus,
  BuffModifierArgsWrapper,
  ModifierInput,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  Tracker,
} from "./calculator";
import type { AppCharacter } from "./character";
import type { AttackPatternPath } from "../utils/calculation";

import { EModAffect } from "@Src/constants";

export type DefaultAppWeapon = Pick<
  AppWeapon,
  "code" | "beta" | "name" | "rarity" | "icon" | "applyBuff" | "applyFinalBuff" | "buffs"
>;

type VisionStack = {
  type: "vision";
  element: "same_included" | "same_excluded" | "various" | "different";
  max?: number;
};

type AttributeStack = {
  type: "attribute";
  field: string | "own_element";
  convertRate?: number;
};

type InputIndex = {
  value: number;
  /** Tulaytullah's Remembrance */
  convertRate?: number;
};

type InputStack = {
  type: "input";
  /** Default to 0 */
  index?: number | InputIndex[];
  /** liyueSeries */
  doubledAtInput?: number;
  /** if number, add to main */
  maxStackBonus?: number;
  //  | Pick<AutoBuff, "base" | "increment" | "targetGroup" | "targetPath">;
};

type EnergyStack = {
  type: "energy";
};

type StackConfig = VisionStack | AttributeStack | InputStack | EnergyStack;

type AutoBuff = {
  /** only for "Predator" bow */
  charCode?: number;
  base: number;
  /** also scale off refi */
  initialBonus?: number;
  /** fixed type has no incremen */
  increment?: number;
  stacks?: StackConfig | StackConfig[];
  targetGroup: "totalAttr" | "attPattBonus";
  targetPath: "own_element" | AttributeStat | AttackPatternPath | AttributeStat[] | AttackPatternPath[];
  /** also scale off refi, increment default to main increment */
  max?:
    | number
    | {
        base: number;
        increment: number;
      };
  /**
   * On buffs, if number, it's compareValue, index default to 0
   * On autobuffs, need source
   */
  checkInput?:
    | number
    | {
        index?: number;
        source?: "various_vision";
        compareValue: number;
      };
};

/**
 * If there's base outside, calculate bonus.
 * If there're buffBonuses, calculate bonuses, with outside targetGroup, increment as default
 */
type NewBuff = Partial<AutoBuff> & {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  /** only for The Widsith */
  // selectIndex?: number;
  buffBonuses?: Array<
    PartiallyOptional<AutoBuff, "targetGroup"> & {
      /** if number, it compareValue, index default to 0 */
      checkInput?:
        | number
        | {
            index: number;
            compareValue: number;
          };
    }
  >;
};

/**
 * Weapon in app data
 */
export type AppWeapon = {
  code: number;
  beta?: boolean;
  name: string;
  rarity: Rarity;
  icon: string;
  mainStatScale: string;
  subStat?: {
    type: AttributeStat;
    scale: string;
  };
  applyBuff?: (args: ApplyWpPassiveBuffsArgs) => void;
  applyFinalBuff?: (args: ApplyWpPassiveBuffsArgs) => void;
  passiveName: string;
  passiveDesc: (args: WeaponDescArgs) => {
    core?: JSX.Element;
    extra?: JSX.Element[];
  };
  buffs?: WeaponBuff[];

  autoBuffs?: AutoBuff[];
  newBuffs?: NewBuff[];
};

type ApplyWpPassiveBuffsArgs = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  rxnBonus?: ReactionBonus;
  charData: AppCharacter;
  partyData?: PartyData;
  refi: number;
  desc: string;
  tracker?: Tracker;
};

type ApplyWpBuffArgs = BuffModifierArgsWrapper & {
  inputs: ModifierInput[];
  refi: number;
  desc?: string;
};

type ApplyWpFinalBuffArgs = BuffModifierArgsWrapper & {
  refi: number;
  desc?: string;
  inputs: ModifierInput[];
};

type WeaponDescArgs = {
  refi: number;
};

type WeaponBuff = {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  applyBuff?: (args: ApplyWpBuffArgs) => void;
  applyFinalBuff?: (args: ApplyWpFinalBuffArgs) => void;
  desc: (
    args: WeaponDescArgs & {
      totalAttr: TotalAttribute;
    }
  ) => ReactNode;
};
