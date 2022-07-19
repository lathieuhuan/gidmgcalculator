import { EModAffect } from "@Src/constants";
import type { ModifierInput, Tracker } from "./global";
import type {
  AttackElementBonus,
  AttackPatternBonus,
  CalcCharData,
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
  variants: number[];
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
  desc?: string;
  tracker?: Tracker;
};

type SetBonus = {
  desc: JSX.Element;
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
    initialValues: number[];
    renderTypes: ("stacks" | "swirl")[];
    maxs: number[];
  };
  applyBuff?: (args: ApplyArtBuffArgs) => void;
  applyFinalBuff?: (args: ApplyArtFinalBuffArgs) => void;
};

type ArtifactDebuff = {
  desc: JSX.Element;
  labels: string[];
  inputTypes: "swirl"[];
  applyDebuff: (args: {
    resistReduct: ResistanceReduction;
    inputs?: ModifierInput[];
    desc: string;
    tracker: Tracker;
  }) => void;
};
