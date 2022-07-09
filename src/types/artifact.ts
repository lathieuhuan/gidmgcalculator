import type { Tracker } from "./global";
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

type SetBonus = {
  desc: JSX.Element;
  applyBuff?: (args: {
    skillBonuses: SkillBonus;
    charData: CalcCharData;
    desc: string;
    tracker: Tracker;
  }) => void;
};

type ArtifactBuff = {
  desc: () => JSX.Element;
  affect: EModAffect;
  inputConfig?: {
    labels: string[];
    initialValues: number[];
    renderTypes: ("stacks" | "")[];
    maxs: number[];
  };
  applyBuff: (args: {
    totalAttrs: TotalAttribute;
    skillBonuses: SkillBonus;
    desc: string;
    tracker: Tracker;
  }) => void;
};
