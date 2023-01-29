import type {
  CharData,
  CalcSetup,
  CalcSetupManageInfo,
  DamageResult,
  ReactionBonus,
  Target,
  TotalAttribute,
  AttackElement,
  Level,
} from "@Src/types";

export type CalculatorState = {
  activeId: number;
  standardId: number;
  comparedIds: number[];

  settings: CalculatorSettings;
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

export type CalculatorSettings = {
  separateCharInfo: boolean;
  keepArtStatsOnSwitch: boolean;
  charLevel: Level;
  charCons: number;
  charNAs: number;
  charES: number;
  charEB: number;
  wpLevel: Level;
  wpRefi: number;
  artLevel: number;
};
