import type {
  CalcSetup,
  CalcSetupManageInfo,
  CalculationFinalResult,
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
  resultById: Record<
    string,
    {
      infusedElement: AttackElement;
      totalAttrs: TotalAttribute;
      rxnBonuses: ReactionBonus;
      finalResult: CalculationFinalResult;
    }
  >;
  target: Target;
};
