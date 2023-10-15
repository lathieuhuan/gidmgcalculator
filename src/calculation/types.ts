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
  TrackerDamageRecord,
  NormalAttack,
  CalcItem,
  CalcItemBonus,
  BuffModifierArgsWrapper,
  Vision,
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

export interface CalculateItemArgs
  extends Pick<BuffModifierArgsWrapper, "char" | "totalAttr" | "attElmtBonus" | "attPattBonus"> {
  stat: CalcItem;
  attPatt: ActualAttackPattern;
  attElmt: AttackElement;
  base: number | number[];
  target: Target;
  rxnMult: number;
  calcItemBonues: CalcItemBonus[];
  absorbedElmt?: Vision;
  resistReduct: ResistanceReduction;
  record: TrackerDamageRecord;
}

export interface GetDamageArgs extends Omit<BuffModifierArgsWrapper, "infusedElement"> {
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
