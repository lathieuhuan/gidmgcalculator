import { EModAffect } from "@Src/constants";
import type { ModInputConfig, Rarity } from "./global";
import type {
  AttackPatternBonus,
  CharData,
  BuffModifierArgsWrapper,
  ModifierInput,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  DebuffModifierArgsWrapper,
} from "./calculator";
import type { Tracker } from "@Calculators/types";

type ArtPieceData = {
  name: string;
  icon: string;
};

export type DataArtifact = {
  code: number;
  beta?: boolean;
  name: string;
  variants: Rarity[];
  flower: ArtPieceData;
  plume: ArtPieceData;
  sands: ArtPieceData;
  goblet: ArtPieceData;
  circlet: ArtPieceData;
  setBonuses: [SetBonus, SetBonus];
  buffs?: ArtifactBuff[];
  debuffs?: ArtifactDebuff[];
};

type ApplyArtPassiveBuffArgs = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  rxnBonus?: ReactionBonus;
  charData: CharData;
  partyData?: PartyData;
  desc?: string;
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
  desc: () => JSX.Element;
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
  desc: () => JSX.Element;
  inputConfigs?: ModInputConfig[];
  applyDebuff: (args: ApplyArtDebuffArgs) => void;
};
