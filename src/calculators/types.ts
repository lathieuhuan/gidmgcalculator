import type {
  AttackElement,
  AttackPattern,
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

export type TrackerDamageRecord = {
  baseValue: number,
  baseStatType: "base_atk" | "hp" | "atk" | "def",
  finalMult: number | number[],
  finalFlat: number
}

export type DamageTypes = [AttackPattern, AttackElement];