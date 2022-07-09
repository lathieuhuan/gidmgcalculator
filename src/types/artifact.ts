import type { Tracker } from "./global";
import type { CalcCharData, SkillBonus } from "./calculator";

type ArtPieceData = {
  name: string;
  icon: string;
}

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
