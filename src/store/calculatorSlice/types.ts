import type {
  CalcCharData,
  CalcSetup,
  CalcSetupManageInfo,
  DamageResult,
  FinalInfusion,
  Monster,
  ReactionBonus,
  Target,
  TotalAttribute,
} from "@Src/types";

export type CalculatorState = {
  activeId: number;
  standardId: number;
  comparedIds: number[];

  configs: CalcConfigurations;
  isError: boolean;

  charData: CalcCharData;
  setupManageInfos: CalcSetupManageInfo[];
  setupsById: Record<string, CalcSetup>;
  statsById: Record<
    string,
    {
      totalAttrs: TotalAttribute;
      rxnBonuses: ReactionBonus;
      dmgResult: DamageResult;
      finalInfusion: FinalInfusion;
    }
  >;

  target: Target;
  monster: Monster;
};

export type CalcConfigurations = {
  separateCharInfo: boolean;
  keepArtStatsOnSwitch: boolean;
};
