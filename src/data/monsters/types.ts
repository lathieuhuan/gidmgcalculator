import type { AttackElement, Target } from "@Src/types";

export type MonsterConfig = string | boolean;

type ChangeResistanceArgs = {
  target: Target;
  variant?: string;
  configs: MonsterConfig[];
};

type MonsterResistance = Partial<Record<AttackElement, number>> & {
  base: number;
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
    renderTypes: "check"[];
  };
  changeResistance?: (args: ChangeResistanceArgs) => void;
};
