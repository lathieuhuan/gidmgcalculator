import type {
  AttackElementBonus,
  AttackPatternBonus,
  CalcArtInfo,
  CharData,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  Tracker,
  AttackElement,
  DataCharacter,
  StatInfo,
  Vision,
  Target,
  TalentBuff,
  ResistanceReduction,
  ArtifactDebuffCtrl,
  CustomDebuffCtrl,
  AttackPattern,
} from "@Src/types";

export type UsedCode = {
  itemCode: number;
  modIndex: number;
};

export type BaseModifierArgsWrapper = {
  totalAttr: TotalAttribute;
  attPattBonus?: AttackPatternBonus;
  attElmtBonus?: AttackElementBonus;
  rxnBonus?: ReactionBonus;
  charData: CharData;
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
  charData: CharData;
  dataChar: DataCharacter;
  selfBuffCtrls: ModifierCtrl[];
  weapon: CalcWeapon;
  wpBuffCtrls: ModifierCtrl[];
  artInfo: CalcArtInfo;
  artBuffCtrls: ModifierCtrl[];
  elmtModCtrls: ElementModCtrl;
  party: Party;
  partyData: PartyData;
  customBuffCtrls: CustomBuffCtrl[];
  infusedElement: AttackElement;
  tracker: Tracker;
};

export interface CalcTalentStatArgs {
  stat: StatInfo;
  attPatt: AttackPattern | null;
  attElmt: AttackElement | "various";
  base: number | number[];
  char: CharInfo;
  vision: Vision;
  target: Target;
  elmtModCtrls: ElementModCtrl;
  talentBuff: TalentBuff;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  rxnBonus: ReactionBonus;
  resistReduct: ResistanceReduction;
  infusedElement: AttackElement;
}

export interface GetDamageArgs {
  char: CharInfo;
  charData: CharData;
  dataChar: DataCharacter;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
  artDebuffCtrls: ArtifactDebuffCtrl[];
  party: Party;
  partyData: PartyData;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  rxnBonus: ReactionBonus;
  customDebuffCtrls: CustomDebuffCtrl[];
  infusedElement: AttackElement;
  elmtModCtrls: ElementModCtrl;
  target: Target;
  tracker: Tracker;
}
