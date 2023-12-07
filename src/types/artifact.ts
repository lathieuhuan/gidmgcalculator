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
  /** This is id */
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

type TargetAttribute = "inp_elmt" | AttributeStat | AttributeStat[];

/** Only on code 42 */
type InputIndex = {
  /** Default to 0 */
  value?: number;
  convertRate: number;
};

type InputStack = {
  type: "input";
  /** If number, default to 0 */
  index?: number | InputIndex;
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

type AttributeSetBonus = {
  // totalAttr
  target: "ATTR";
  path: TargetAttribute;
  /** Only when path = "inp_elmt". Default to 0 */
  inputIndex?: number;
};

type AttPattSetBonus = {
  // attPattBonus
  target: "PATT";
  path: AttackPatternPath | AttackPatternPath[];
  weaponTypes?: WeaponType[];
};

type RxnBonusSetBonus = {
  // rxnBonus
  target: "RXN";
  path: ReactionBonusPath | ReactionBonusPath[];
};

export type ArtifactBonus = (AttributeSetBonus | AttPattSetBonus | RxnBonusSetBonus) & {
  /** Only on Vermillion Hereafter */
  initialValue?: number;
  value: number | number[];
  stacks?: InputStack | AttributeStack | VisionStack;
  /** For this buff to available, the input at index 0 must equal to checkInput */
  checkInput?: number;
  max?: number;
};

export type ArtifactModifier = {
  /** This is id */
  index: number;
  inputConfigs?: ModInputConfig[];
  description: string | number | number[];
};

type ArtifactBuff = ArtifactModifier & {
  affect: EModAffect;
  artBonuses: ArtifactBonus | ArtifactBonus[];
};

type SetPenalty = {
  value: number;
  path: "inp_elmt" | ResistanceReductionKey;
  /** Only when path = "inp_elmt". Default to 0 */
  inputIndex?: number;
};

type ArtifactDebuff = ArtifactModifier & {
  effects: SetPenalty;
};
