import type { Target, TargetResistance } from "@Src/types";

type ChangeResistanceArgs = {
  target: Target;
  variant?: string;
  configs: (string | boolean)[];
};

type MonsterResistance = Partial<Record<TargetResistance, number>> & {
  phys_res: number;
  elmt_res: number;
};

export type DataMonster = {
  name: string;
  resistance: MonsterResistance;
  variant?: {
    labelIndex?: 0 | 1 | 2 | 3 | 4; // length of MONSTER_VARIANT_LABELS ./constants
    options: string[];
  };
  config?: {
    labels: string[];
    // #to-do
    renderTypes: ("check" | "")[];
  };
  changeResistance?: (args: ChangeResistanceArgs) => void;
};
