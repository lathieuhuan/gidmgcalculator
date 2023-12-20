import type { AttackPatternPath } from "../utils/calculation";
import type { AttributeStat, ModInputConfig, Rarity, WeaponType } from "./global";
import { EModAffect } from "@Src/constants";

// export type DefaultAppWeapon = Pick<
//   AppWeapon,
//   "code" | "beta" | "name" | "rarity" | "icon" | "applyBuff" | "applyFinalBuff" | "buffs"
// >;

/**
 * Weapon in app data
 */
export type AppWeapon = {
  /** This is id */
  code: number;
  beta?: boolean;
  type: WeaponType;
  name: string;
  rarity: Rarity;
  icon: string;
  mainStatScale: string;
  subStat?: {
    type: AttributeStat;
    scale: string;
  };
  passiveName?: string;
  descriptions?: string[];
  autoBuffs?: WeaponBonus[];
  buffs?: WeaponBuff[];
};

type VisionStack = {
  type: "vision";
  element: "same_included" | "same_excluded" | "different";
  max?: number;
};

type AttributeStack = {
  type: "attribute";
  field: "hp" | "base_atk" | "def" | "em" | "er_";
  convertRate?: number;
  minus?: number;
};

/** Only on Tulaytullah's Remembrance */
type InputIndex = {
  value: number;
  convertRate?: number;
};

type InputStack = {
  type: "input";
  /** Default to 0 */
  index?: number | InputIndex[];
  /**
   * The index of the input which when activated (equal to 1), buffValue is doubled.
   * Only on Liyue Series.
   */
  doubledAtInput?: number;
};

/** Only on Watatsumi series */
type EnergyStack = {
  type: "energy";
};

/** Only on Lythic series */
type NationStack = {
  type: "nation";
};

export type WeaponStackConfig = VisionStack | AttributeStack | InputStack | EnergyStack | NationStack;

type TargetAttribute = "own_element" | AttributeStat | AttributeStat[];

export type WeaponBonus = {
  base?: number;
  /** Need [stacks], number of stacks - 1 = index of options. Each option scale off refi, increment is 1/3 */
  options?: number[];
  /** Only on Fading Twilight, also scale off refi, increment is 1/3 */
  initialBonus?: number;
  /** Default to 1/3 [base]. Fixed buff type has increment = 0 */
  increment?: number;
  stacks?: WeaponStackConfig | WeaponStackConfig[];
  targetAttribute?: TargetAttribute;
  targetAttPatt?: AttackPatternPath | AttackPatternPath[];
  max?:
    | number
    // Only on Jadefall's Splendor
    | {
        base: number;
        increment: number;
      };
  /**
   * For this buff to available, the input at the [index] must meet [compareValue] by [compareType].
   * If number, it's [compareValue], [index] default to 0.
   */
  checkInput?:
    | number
    // Only on Ballad of the Fjords
    | {
        /** Default to 0 */
        index?: number;
        /** Only on Ballad of the Fjords. No [index] when there's [source] */
        source?: "various_vision";
        compareValue: number;
        /** Default to equal */
        compareType?: "equal" | "atleast";
      };
};

export type WeaponBuff = WeaponBonus & {
  /** This is id */
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  /**
   * If number, it's the index of weapon's descriptions (AppWeapon.descriptions).
   * Default to 0.
   */
  description?: number | string;
  /** buffBonus use outside [base] (WeaponBonus.base) and [stacks] (WeaponBonus.stacks) as default */
  wpBonuses?: WeaponBonus[];
};
