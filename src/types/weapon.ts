import type { ReactNode } from "react";
import type { Rarity, ModInputConfig, AttributeStat, Vision } from "./global";
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
  convertRate?: number;
};

type InputStack = {
  type: "input";
  index?: number | InputIndex[]; // default to 0
  maxStackBonus?: number;
};

type EnergyStack = {
  type: "energy";
};

type StackConfig = VisionStack | AttributeStack | InputStack | EnergyStack;

type AutoBuff = {
  /** only for "Predator" bow */
  charCode?: number;
  base: number | number[];
  /** also scale off refi */
  initialBonus?: number;
  /** fixed type has no incremen */
  increment?: number;
  stacks?: StackConfig;
  targetGroup: "totalAttr" | "attPattBonus";
  targetPath: string | string[];
  /** also scale off refi, increment default to main increment */
  max?:
    | number
    | {
        base: number;
        increment: number;
      };
};

type NewBuff = AutoBuff & {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
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
