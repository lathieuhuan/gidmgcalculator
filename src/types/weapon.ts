import type { AttackPatternPath } from "../utils/calculation";
import type { AttributeStat, ModInputConfig, Rarity } from "./global";
import { EModAffect } from "@Src/constants";

// export type DefaultAppWeapon = Pick<
//   AppWeapon,
//   "code" | "beta" | "name" | "rarity" | "icon" | "applyBuff" | "applyFinalBuff" | "buffs"
// >;

type VisionStack = {
  type: "vision";
  element: "same_included" | "same_excluded" | "different";
  max?: number;
};

type AttributeStack = {
  type: "attribute";
  field: "hp" | "base_atk" | "def" | "em" | "er_";
  convertRate?: number;
  pedestal?: number;
};

type InputIndex = {
  value: number;
  /** only on Tulaytullah's Remembrance */
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
};

/** Watatsumi series */
type EnergyStack = {
  type: "energy";
};

/** Lythic series */
type NationStack = {
  type: "nation";
};

type StackConfig = VisionStack | AttributeStack | InputStack | EnergyStack | NationStack;

type TargetAttribute = "own_element" | AttributeStat | AttributeStat[];

export type AutoBuff = {
  // charCode?: number; // only on Predator for Aloy
  base?: number;
  /** only on Fading Twilight, also scale off refi, increment is 1/3 */
  initialBonus?: number;
  /** fixed type has no increment */
  increment?: number;
  stacks?: StackConfig | StackConfig[];
  targetAttribute?: TargetAttribute;
  targetAttPatt?: AttackPatternPath | AttackPatternPath[];
  max?:
    | number
    // only on Jadefall's Splendor
    | {
        base: number;
        increment: number;
      };
  /**
   * If number, it's compareValue, index default to 0
   */
  checkInput?:
    | number
    // only on Ballad of the Fjords
    | {
        index?: number;
        /** No index when there's source */
        source?: "various_vision";
        compareValue: number;
        /** Default to equal */
        compareType?: "equal" | "atleast";
      };
};

export type DescriptionSeedType = "dull" | "green" | "red";

export type DescriptionSeed =
  | number
  | { base: number; increment?: number; seedType?: DescriptionSeedType }
  | { options: number[]; seedType?: DescriptionSeedType };

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
  passiveName?: string;
  description?: {
    pots: string[];
    seeds: DescriptionSeed[];
  };
  autoBuffs?: AutoBuff[];
  buffs?: WeaponBuff[];
};

export type WeaponBuff = AutoBuff & {
  index: number;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];

  description?: number | string;
  buffBonuses?: AutoBuff[];
};
