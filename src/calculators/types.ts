import type {
  AttackElementBonus,
  AttackPatternBonus,
  CalcCharData,
  CharInfo,
  FinalInfusion,
  ModifierCtrl,
  Party,
  ReactionBonus,
  ResistanceReduction,
  TotalAttribute,
  Tracker,
} from "@Src/types";

export type Wrapper1 = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  attElmtBonus?: AttackElementBonus;
  rxnBonus?: ReactionBonus;
  charData: CalcCharData;
  tracker?: Tracker;
};

export type Wrapper2 = {
  char: CharInfo;
  charBuffCtrls: ModifierCtrl[];
  infusion: FinalInfusion;
  party: Party;
};

export type Wrapper3 = {
  resistReduct: ResistanceReduction,
  attPattBonus: AttackPatternBonus;
}

export type TrackerDamageRecord = {
  baseValue: number;
  baseStatType: "base_atk" | "hp" | "atk" | "def";
  finalMult: number | number[];
  finalFlat: number;
  normalMult: number;
  specialMult?: number;
  rxnMult?: number;
  defMult?: number;
  resMult?: number;
  cRate?: number;
  cDmg?: number;
  note?: string;
};
