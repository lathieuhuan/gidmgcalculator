import type {
  AttackElementBonus,
  AttackPatternBonus,
  CalcWeapon,
  CalcArtifacts,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  TotalAttribute,
  AttackElement,
  AppCharacter,
  Target,
  TalentBuff,
  ResistanceReduction,
  ArtifactDebuffCtrl,
  CustomDebuffCtrl,
  ActualAttackPattern,
  ActualAttackElement,
  Tracker,
  TrackerDamageRecord,
  NormalAttack,
  PatternStat,
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
  charData: AppCharacter;
  partyData?: PartyData;
  tracker?: Tracker;
};

export type GetBuffedStatsArgs = {
  char: CharInfo;
  charData: AppCharacter;
  selfBuffCtrls: ModifierCtrl[];
  weapon: CalcWeapon;
  wpBuffCtrls: ModifierCtrl[];
  artifacts: CalcArtifacts;
  artBuffCtrls: ModifierCtrl[];
  elmtModCtrls: ElementModCtrl;
  party: Party;
  partyData: PartyData;
  customBuffCtrls: CustomBuffCtrl[];
  infusedElement: AttackElement;
  tracker?: Tracker;
};

export interface CalcPatternStatArgs {
  stat: PatternStat;
  attPatt: ActualAttackPattern;
  attElmt: ActualAttackElement;
  base: number | number[];
  char: CharInfo;
  target: Target;
  rxnMult: number;
  talentBuff: TalentBuff;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  resistReduct: ResistanceReduction;
  record: TrackerDamageRecord;
}

export interface GetDamageArgs {
  char: CharInfo;
  charData: AppCharacter;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
  artDebuffCtrls: ArtifactDebuffCtrl[];
  party: Party;
  partyData: PartyData;
  disabledNAs: boolean;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  rxnBonus: ReactionBonus;
  customDebuffCtrls: CustomDebuffCtrl[];
  infusion: {
    element: AttackElement;
    range: NormalAttack[];
    isCustom: boolean;
  };
  elmtModCtrls: ElementModCtrl;
  target: Target;
  tracker?: Tracker;
}
