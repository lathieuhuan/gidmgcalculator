import type { AttributeStat, ModInputConfig, Rarity, WeaponType } from "./global";
import type { ResistanceReductionKey } from "./calculator";
import { EModAffect } from "@Src/constants";
import { AttackPatternPath, ReactionBonusPath } from "@Src/utils/calculation";

type ArtTypeData = {
  name: string;
  icon: string;
};

/**
 * Artifact in app data
 */
export type AppArtifact = {
  code: number;
  beta?: boolean;
  name: string;
  variants: Rarity[];
  flower: ArtTypeData;
  plume: ArtTypeData;
  sands: ArtTypeData;
  goblet: ArtTypeData;
  circlet: ArtTypeData;

  descriptions: string[];
  setBonuses?: SetBonus[];
  buffs?: ArtifactBuff[];
  debuffs?: ArtifactDebuff[];
};

type SetBonus = {
  description?: number[];
  artBonuses?: ArtifactBonus | ArtifactBonus[];
};

type TargetAttribute = "input_element" | AttributeStat | AttributeStat[];

type InputStack = {
  type: "input";
  /** Default to 0 */
  index?: number;
};

type AttributeStack = {
  type: "attribute";
  field: "base_atk" | "hp" | "atk" | "def" | "em" | "er_";
};

type VisionStack = {
  type: "vision";
  element: "same_excluded" | "different";
  max?: number;
};

type SetBonusCommon = {
  /** Only on Vermillion Hereafter */
  initialValue?: number;
  value: number | number[];
  stacks?: InputStack | AttributeStack | VisionStack;
  /**
   * For this buff to available, the input at the index must equal to compareValue.
   * If number, it's compareValue, index default to 0.
   */
  checkInput?:
    | number
    | {
        /** Default to 0 */
        index?: number;
        value: number;
      };
  max?: number;
};

type AttributeSetBonus = SetBonusCommon & {
  target: "totalAttr";
  path: TargetAttribute;
  /** Only when path = "input_element". Default to 0 */
  inputIndex?: number;
};

type AttPattSetBonus = SetBonusCommon & {
  target: "attPattBonus";
  path: AttackPatternPath | AttackPatternPath[];
  weaponTypes?: WeaponType[];
};

type RxnBonusSetBonus = SetBonusCommon & {
  target: "rxnBonus";
  path: ReactionBonusPath | ReactionBonusPath[];
};

export type ArtifactBonus = AttributeSetBonus | AttPattSetBonus | RxnBonusSetBonus;

export type ArtifactModifier = {
  inputConfigs?: ModInputConfig[];
  description: number | number[];
};

type ArtifactBuff = ArtifactModifier & {
  index: number;
  affect: EModAffect;
  artBonuses: ArtifactBonus | ArtifactBonus[];
};

type SetPenalty = {
  value: number;
  path: "input_element" | ResistanceReductionKey;
  /** Only when path = "input_element". Default to 0 */
  inputIndex?: number;
};

type ArtifactDebuff = ArtifactModifier & {
  index: number;
  penalties: SetPenalty;
};
