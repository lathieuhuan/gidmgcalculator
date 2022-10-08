import type { AttackElement, Vision } from "@Src/types";

type MonsterResistance = Partial<Record<AttackElement, number>> & {
  base: number;
};

type MonsterVariant = {
  types: Array<Vision | { label: string; value: Vision }>;
  change: number;
};

type MonsterState = {
  label: string;
  changes: Partial<Record<"base" | "variant" | AttackElement, number>>;
};

export type DataMonster = {
  code: number;
  title: string;
  subtitle?: string;
  names?: string[];
  resistance: MonsterResistance;
  variant?: MonsterVariant;
  states?: MonsterState | MonsterState[];
};
