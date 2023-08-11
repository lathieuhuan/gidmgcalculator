import type { AttributeStat, ModInputConfig, Rarity, WeaponType } from "./global";
import type {
  AttackPatternBonus,
  BuffModifierArgsWrapper,
  ModifierInput,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  DebuffModifierArgsWrapper,
  Tracker,
  ResistanceReductionKey,
} from "./calculator";
import type { AppCharacter } from "./character";
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
  bonuses?: ArtifactBonus | ArtifactBonus[];
};

type ApplyArtPassiveBuffArgs = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  rxnBonus?: ReactionBonus;
  charData: AppCharacter;
  partyData?: PartyData;
  desc: string;
  tracker?: Tracker;
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
  convertRate?: number;
  // minus?: number;
};

type VisionStack = {
  type: "vision";
  element: "same_excluded" | "different";
  max?: number;
};

type SetBonusCommon = {
  /** Only on Vermillion Hereafter */
  initialValue?: number;
  value: number;
  stacks?: InputStack | AttributeStack | VisionStack;
  checkInput?: {
    /** Default to 0 */
    index?: number;
    value: number;
    /** Default to 'equal' */
    type?: "equal";
  };
  max?: number;
};

type AttributeSetBonus = SetBonusCommon & {
  target: "totalAttr";
  path: TargetAttribute;
  /** Only when path = "input_element" Default to 0 */
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

type ArtifactBonus = AttributeSetBonus | AttPattSetBonus | RxnBonusSetBonus;

type ApplyArtBuffArgs = BuffModifierArgsWrapper & {
  inputs: ModifierInput[];
  desc?: string;
};

type ApplyArtFinalBuffArgs = BuffModifierArgsWrapper & {
  desc?: string;
  tracker?: Tracker;
};

export type ArtifactBuff = {
  index: number;
  // desc: () => JSX.Element | undefined;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  // applyBuff?: (args: ApplyArtBuffArgs) => void;
  // applyFinalBuff?: (args: ApplyArtFinalBuffArgs) => void;
  description: string | number;
  bonuses: ArtifactBonus | ArtifactBonus[];
};

export type ApplyArtDebuffArgs = DebuffModifierArgsWrapper & {
  inputs: ModifierInput[];
  desc: string;
  tracker?: Tracker;
};

type SetPenalty = {
  value: number;
  path: "input_element" | ResistanceReductionKey;
  /** Only when path = "input_element" Default to 0 */
  inputIndex?: number;
};

type ArtifactDebuff = {
  index: number;
  // desc: () => JSX.Element | undefined;
  inputConfigs?: ModInputConfig[];
  // applyDebuff: (args: ApplyArtDebuffArgs) => void;
  description: string | number;
  penalties: SetPenalty;
};
