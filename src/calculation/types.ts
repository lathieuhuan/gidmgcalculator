import type {
  CalcWeapon,
  CalcArtifacts,
  CharInfo,
  CustomBuffCtrl,
  ElementModCtrl,
  ModifierCtrl,
  Party,
  PartyData,
  AttackElement,
  AppCharacter,
  Target,
  ResistanceReduction,
  ArtifactDebuffCtrl,
  CustomDebuffCtrl,
  ActualAttackPattern,
  Tracker,
  TrackerCalcItemRecord,
  NormalAttack,
  CalcItem,
  CalcItemBonus,
  BuffInfoWrap,
  Vision,
} from "@Src/types";

export type UsedMod = {
  itemCode: number;
  modIndex: number;
};

export type CalcUltilInfo = {
  char: CharInfo;
  charData: AppCharacter;
  partyData: PartyData;
};

export type GetCalculationStatsArgs = {
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

export interface CalculateItemArgs
  extends Pick<BuffInfoWrap, "char" | "totalAttr" | "attElmtBonus" | "attPattBonus"> {
  stat: CalcItem;
  attPatt: ActualAttackPattern;
  attElmt: AttackElement;
  base: number | number[];
  target: Target;
  rxnMult: number;
  calcItemBonues: CalcItemBonus[];
  absorbedElmt?: Vision;
  resistReduct: ResistanceReduction;
  record: TrackerCalcItemRecord;
}

export interface GetDamageArgs extends Omit<BuffInfoWrap, "infusedElement"> {
  selfDebuffCtrls: ModifierCtrl[];
  artDebuffCtrls: ArtifactDebuffCtrl[];
  party: Party;
  disabledNAs: boolean;
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
