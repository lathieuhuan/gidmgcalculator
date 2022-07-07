import type { Tracker } from "@Src/types";
import type { CalcCharData, SkillBonus } from "@Store/calculatorSlice/types";

interface PieceInfo {
  name: string;
  icon: string;
}

export interface IArtifact {
  code: number;
  beta?: boolean;
  name: string;
  variants: number[];
  flower: PieceInfo;
  plume: PieceInfo;
  sands: PieceInfo;
  goblet: PieceInfo;
  circlet: PieceInfo;
  setBonuses: [SetBonus, SetBonus];
}

interface SetBonus {
  desc: JSX.Element;
  addBuff?: (args: AddBuffArgs) => void;
}

interface AddBuffArgs {
  skillBonuses: SkillBonus;
  charData: CalcCharData;
  tkDesc: string;
  tracker: Tracker;
}
