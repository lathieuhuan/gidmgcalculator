import type {
  AttackElementBonus,
  AttackPatternBonus,
  CalcArtInfo,
  TCharData,
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

export type BaseModifierArgsWrapper = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  attElmtBonus?: AttackElementBonus;
  rxnBonus?: ReactionBonus;
  charData: TCharData;
  partyData?: PartyData;
  tracker?: Tracker;
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
  charData: TCharData;
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
