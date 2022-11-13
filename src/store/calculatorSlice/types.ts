import type {
  CharData,
  CalcSetup,
  CalcSetupManageInfo,
  DamageResult,
  Monster,
  ReactionBonus,
  Target,
  TotalAttribute,
  AttackElement,
} from "@Src/types";

export type CalculatorState = {
  activeId: number;
  standardId: number;
  comparedIds: number[];

  configs: CalcConfigurations;
  isError: boolean;

  charData: CharData;
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
  monster: Monster;
};

export type CalcConfigurations = {
  separateCharInfo: boolean;
  keepArtStatsOnSwitch: boolean;
};
