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
  AttackElement,
  DataCharacter,
  StatInfo,
  Target,
  TalentBuff,
  ResistanceReduction,
  ArtifactDebuffCtrl,
  CustomDebuffCtrl,
  ActualAttackPattern,
  ActualAttackElement,
  AttributeStat,
  AttackPatternBonusKey,
  AttackPatternInfoKey,
  AttacklementInfoKey,
  Reaction,
  ReactionBonusInfoKey,
} from "@Src/types";

export type TrackerRecord = {
  desc: string;
  value: number;
};

export type TrackerDamageRecord = {
  baseValue: number;
  baseStatType?: string;
  talentMult?: number | number[];
  totalFlat?: number;
  normalMult: number;
  specialMult?: number;
  rxnMult?: number;
  defMult?: number;
  resMult?: number;
  cRate?: number;
  cDmg?: number;
  note?: string;
  talentBuff?: TalentBuff;
};

export type Tracker = {
  totalAttr: Record<AttributeStat, TrackerRecord[]>;
  attPattBonus: Record<`${AttackPatternBonusKey}.${AttackPatternInfoKey}`, TrackerRecord[]>;
  attElmtBonus: Record<`${AttackElement}.${AttacklementInfoKey}`, TrackerRecord[]>;
  rxnBonus: Record<`${Reaction}.${ReactionBonusInfoKey}`, TrackerRecord[]>;
  resistReduct: Record<AttackElement | "def", TrackerRecord[]>;
  NAs: Record<string, TrackerDamageRecord>;
  ES: Record<string, TrackerDamageRecord>;
  EB: Record<string, TrackerDamageRecord>;
  RXN: Record<string, TrackerDamageRecord>;
};

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
  tracker?: Tracker;
};

export interface CalcTalentStatArgs {
  stat: StatInfo;
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
  charData: CharData;
  dataChar: DataCharacter;
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
    isCustom: boolean;
  };
  elmtModCtrls: ElementModCtrl;
  target: Target;
  tracker?: Tracker;
}
