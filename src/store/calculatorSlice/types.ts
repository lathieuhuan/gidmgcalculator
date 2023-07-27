import type {
  CalcSetup,
  CalcSetupManageInfo,
  DamageResult,
  ReactionBonus,
  Target,
  TotalAttribute,
  AttackElement,
  AppMessage,
} from "@Src/types";

export type CalculatorState = {
  message: AppMessage;
  activeId: number;
  standardId: number;
  comparedIds: number[];

  setupManageInfos: CalcSetupManageInfo[];
  setupsById: Record<string, CalcSetup>;
  statsById: Record<
    string,
    {
      infusedElement: AttackElement;
      totalAttrs: TotalAttribute;
      rxnBonuses: ReactionBonus;
      dmgResult: DamageResult;
    }
  >;
  target: Target;
};
