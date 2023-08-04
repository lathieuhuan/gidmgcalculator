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

export type StackConfig = VisionStack | AttributeStack | InputStack | EnergyStack | NationStack;

type TargetAttribute = "own_element" | AttributeStat | AttributeStat[];

export type AutoBuff = {
  // charCode?: number; // only on Predator for Aloy
  base?: number;
  /** Need "stacks", number of stacks - 1 = index of options. Each option scale off refi, increment is 1/3 */
  options?: number[];
  /** Only on Fading Twilight, also scale off refi, increment is 1/3 */
  initialBonus?: number;
  /** Fixed type has no increment */
  increment?: number;
  stacks?: StackConfig | StackConfig[];
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
   * For this buff to available, the input at the index must equal to compareValue.
   * If number, it's compareValue, index default to 0.
   */
  checkInput?:
    | number
    // Only on Ballad of the Fjords
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
  // Default increment = base / 3, default seedType is "green"
  | { base: number; increment?: number; seedType?: Exclude<DescriptionSeedType, "red"> }
  // Default increment = base / 3, seedType is "red"
  | { max: number; increment?: number }
  // Options for each refi, default seedType is "green"
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
  /**
   * If number, it's the index of weapon's description's pots.
   * If string, it can use weapon's description's seeds.
   * Default to 0.
   */
  description?: number | string;
  /** buffBonus use outside "base", "stacks" as default */
  buffBonuses?: AutoBuff[];
};
