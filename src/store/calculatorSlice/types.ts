import type {
  AttackElementBonus,
  AttackPatternBonus,
  CalcCharData,
  CalcSetup,
  CalcSetupManageInfo,
  FinalInfusion,
  Monster,
  ReactionBonus,
  Target,
  TotalAttribute,
} from "@Src/types";

export type CalculatorState = {
  activeId: number;
  configs: CalcConfigurations;

  charData: CalcCharData;
  setupManageInfos: CalcSetupManageInfo[];
  setupsById: Record<string, CalcSetup>;
  target: Target;
  monster: Monster;

  allTotalAttrs: Record<string, TotalAttribute>;
  allAttPattBonus: Record<string, AttackPatternBonus>;
  allAttElmtBonus: Record<string, AttackElementBonus>;
  allRxnBonuses: Record<string, ReactionBonus>;
  allFinalInfusion: Record<string, FinalInfusion>;

  isError: boolean;
  touched: boolean;
};

export type CalcConfigurations = {
  separateCharInfo: boolean;
  keepArtStatsOnSwitch: boolean;
};
