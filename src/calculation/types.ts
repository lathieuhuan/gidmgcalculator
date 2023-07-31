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
  ResistanceReduction,
  ArtifactDebuffCtrl,
  CustomDebuffCtrl,
  ActualAttackPattern,
  ActualAttackElement,
  Tracker,
  TrackerDamageRecord,
  NormalAttack,
  CalcItem,
  CalcItemBuff,
  CalcItemBonus,
} from "@Src/types";

export type UsedCode = {
  itemCode: number;
  modIndex: number;
};

export type GetStatsArgs = {
  char: CharInfo;
  charData: AppCharacter;
  weapon: CalcWeapon;
  artifacts: CalcArtifacts;

  selfBuffCtrls?: ModifierCtrl[];
  wpBuffCtrls?: ModifierCtrl[];
  artBuffCtrls?: ModifierCtrl[];
  elmtModCtrls?: ElementModCtrl;
  party?: Party;
  partyData?: PartyData;
  customBuffCtrls?: CustomBuffCtrl[];
  infusedElement?: AttackElement;
  tracker?: Tracker;
};

export interface CalculateItemArgs {
  stat: CalcItem;
  attPatt: ActualAttackPattern;
  attElmt: ActualAttackElement;
  base: number | number[];
  char: CharInfo;
  target: Target;
  rxnMult: number;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  calcItemBonues: CalcItemBonus[];
  resistReduct: ResistanceReduction;
  record: TrackerDamageRecord;
}

export interface GetDamageArgs extends Pick<CalculateItemArgs, "totalAttr" | "attPattBonus" | "attElmtBonus"> {
  calcItemBuffs: CalcItemBuff[];
  char: CharInfo;
  charData: AppCharacter;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
  artDebuffCtrls: ArtifactDebuffCtrl[];
  party: Party;
  partyData: PartyData;
  disabledNAs: boolean;
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
