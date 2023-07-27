import type { ModInputConfig, Rarity } from "./global";
import type {
  AttackPatternBonus,
  BuffModifierArgsWrapper,
  ModifierInput,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  DebuffModifierArgsWrapper,
  Tracker,
} from "./calculator";
import type { AppCharacter } from "./character";
import { EModAffect } from "@Src/constants";

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
  setBonuses: [SetBonus, SetBonus];
  buffs?: ArtifactBuff[];
  debuffs?: ArtifactDebuff[];
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

type SetBonus = {
  desc: JSX.Element;
  xtraDesc?: JSX.Element[];
  applyBuff?: (args: ApplyArtPassiveBuffArgs) => void;
  applyFinalBuff?: (args: ApplyArtPassiveBuffArgs) => void;
};

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
  desc: () => JSX.Element | undefined;
  affect: EModAffect;
  inputConfigs?: ModInputConfig[];
  applyBuff?: (args: ApplyArtBuffArgs) => void;
  applyFinalBuff?: (args: ApplyArtFinalBuffArgs) => void;
};

export type ApplyArtDebuffArgs = DebuffModifierArgsWrapper & {
  inputs: ModifierInput[];
  desc: string;
  tracker?: Tracker;
};

type ArtifactDebuff = {
  index: number;
  desc: () => JSX.Element | undefined;
  inputConfigs?: ModInputConfig[];
  applyDebuff: (args: ApplyArtDebuffArgs) => void;
};
