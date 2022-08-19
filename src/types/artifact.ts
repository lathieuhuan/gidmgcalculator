import { EModAffect } from "@Src/constants";
import type { Rarity, Tracker } from "./global";
import type {
  AttackPatternBonus,
  CalcCharData,
  ModifierInput,
  PartyData,
  ReactionBonus,
  ResistanceReduction,
  TotalAttribute,
} from "./calculator";

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
  charData: CalcCharData;
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

type ApplyArtBuffArgs = {
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  rxnBonus: ReactionBonus;
  charData: CalcCharData;
  inputs?: ModifierInput[];
  desc?: string;
  tracker?: Tracker;
};

type ApplyArtFinalBuffArgs = {
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  desc?: string;
  tracker?: Tracker;
};

export type ArtifactBuff = {
  desc: () => JSX.Element;
  affect: EModAffect;
  inputConfig?: {
    labels: string[];
    renderTypes: ("stacks" | "anemoable")[];
    initialValues: ModifierInput[];
    maxValues?: number[];
  };
  applyBuff?: (args: ApplyArtBuffArgs) => void;
  applyFinalBuff?: (args: ApplyArtFinalBuffArgs) => void;
};

type ArtifactDebuff = {
  desc: () => JSX.Element;
  inputConfig?: {
    labels: string[];
    renderTypes: "anemoable"[];
  };
  applyDebuff: (args: {
    resistReduct: ResistanceReduction;
    inputs?: ModifierInput[];
    desc: string;
    tracker: Tracker;
  }) => void;
};
