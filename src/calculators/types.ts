import type {
  AttackElementBonus,
  AttackPatternBonus,
  CalcArtInfo,
  CalcCharData,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  SubArtModCtrl,
  SubWeaponComplexBuffCtrl,
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

export type GetBuffedStatsArgs = {
  char: CharInfo;
  charData: CalcCharData;
  selfBuffCtrls: ModifierCtrl[];
  weapon: CalcWeapon;
  wpBuffCtrls: ModifierCtrl[];
  subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl;
  artInfo: CalcArtInfo;
  artBuffCtrls: ModifierCtrl[];
  subArtBuffCtrls: SubArtModCtrl[];
  elmtModCtrls: ElementModCtrl;
  party: Party;
  partyData: PartyData;
  customBuffCtrls: CustomBuffCtrl[];
  infusion: FinalInfusion;
  tracker: Tracker;
};
