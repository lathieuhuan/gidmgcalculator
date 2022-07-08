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
  applyBuff?: (args: ApplyBuffArgs) => void;
}

interface ApplyBuffArgs {
  skillBonuses: SkillBonus;
  charData: CalcCharData;
  desc: string;
  tracker: Tracker;
}
