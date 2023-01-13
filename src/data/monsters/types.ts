import type { AttackElement, Vision } from "@Src/types";

type MonsterResistance = Partial<Record<AttackElement, number>> & {
  base: number;
};

type MonsterVariant = {
  types: Array<Vision | { label: string; value: Vision }>;
  change?: number;
};

export type MonsterState = {
  label: string;
  changes: MonsterInputChanges;
};

type MonsterInputChanges = Partial<Record<"base" | "variant" | AttackElement, number>>;

type MonsterInputCheckConfig = {
  label: string;
  type: "check";
  changes: MonsterInputChanges;
};

type MonsterInputSelectConfig = {
  label: string;
  type: "select";
  options: Array<{
    label: string;
    changes: MonsterInputChanges;
  }>;
};

export type DataMonster = {
  code: number;
  title: string;
  subtitle?: string;
  names?: string[];
  resistance: MonsterResistance;
  variant?: MonsterVariant;
  inputConfigs?:
    | MonsterInputCheckConfig
    | MonsterInputSelectConfig
    | (MonsterInputCheckConfig | MonsterInputSelectConfig)[];
  states?: MonsterState | MonsterState[];
};
