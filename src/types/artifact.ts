import type { ModifierInput, Tracker } from "./global";
import type { CalcCharData, SkillBonus, TotalAttribute } from "./calculator";
import { EModAffect } from "@Src/constants";

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
};

type ApplyArtSetBuff = (args: {
  skillBonuses?: SkillBonus;
  charData: CalcCharData;
  desc?: string;
  tracker?: Tracker;
}) => void;

type ApplyArtSetFinalBuff = (args: {
  totalAttrs: TotalAttribute;
  skillBonuses?: SkillBonus;
  desc?: string;
  tracker?: Tracker;
}) => void;

type SetBonus = {
  desc: JSX.Element;
  applyBuff?: ApplyArtSetBuff;
  applyFinalBuff?: ApplyArtSetFinalBuff;
};

type ApplyArtBuff = (args: {
  totalAttrs: TotalAttribute;
  skillBonuses: SkillBonus;
  inputs?: ModifierInput[];
  desc: string;
  tracker?: Tracker;
}) => void;

type ArtifactBuff = {
  desc: () => JSX.Element;
  affect: EModAffect;
  inputConfig?: {
    labels: string[];
    initialValues: number[];
    renderTypes: ("stacks" | "")[];
    maxs: number[];
  };
  applyBuff?: ApplyArtBuff;
  applyFinalBuff?: ApplyArtBuff;
};
