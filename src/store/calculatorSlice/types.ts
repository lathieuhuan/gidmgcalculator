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
  statsById: Record<
    string,
    {
      totalAttrs: TotalAttribute;
      attPattBonus: AttackPatternBonus;
      attElmtBonus: AttackElementBonus;
      rxnBonuses: ReactionBonus;
      finalInfusion: FinalInfusion;
    }
  >;

  target: Target;
  monster: Monster;

  isError: boolean;
  touched: boolean;
};

export type CalcConfigurations = {
  separateCharInfo: boolean;
  keepArtStatsOnSwitch: boolean;
};
