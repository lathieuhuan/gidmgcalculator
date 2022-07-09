import type {
  CalcCharData,
  CharInfo,
  FinalInfusion,
  ModifierCtrl,
  Party,
  ReactionBonus,
  SkillBonus,
  TotalAttribute,
  Tracker,
} from "@Src/types";

export type Wrapper1 = {
  totalAttrs: TotalAttribute;
  skillBonuses?: SkillBonus;
  rxnBonuses?: ReactionBonus;
  charData: CalcCharData;
  tracker?: Tracker;
};

export type Wrapper2 = {
  char: CharInfo;
  charBuffCtrls: ModifierCtrl[];
  infusion: FinalInfusion;
  party: Party;
};
