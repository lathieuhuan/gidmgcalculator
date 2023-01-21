import type {
  CharData,
  CalcSetup,
  CalcSetupManageInfo,
  DamageResult,
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
  message: {
    type: "" | "error";
    content: string;
  };

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
};

export type CalcConfigurations = {
  separateCharInfo: boolean;
  keepArtStatsOnSwitch: boolean;
};
