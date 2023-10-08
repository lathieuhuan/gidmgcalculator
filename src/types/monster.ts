import type { AttackElement, Vision } from "@Src/types";

type MonsterResistance = Partial<Record<AttackElement, number>> & {
  base: number;
};

type MonsterVariant = {
  types: Vision[] | Array<{ label: string; value: Vision }>;
  change?: number;
};

type MonsterInputChanges = Partial<Record<"base" | "variant" | AttackElement, number>>;

type MonsterInputConfig = {
  label: string;
  type?: "check" | "select";
  changes?: MonsterInputChanges;
  options?:
    | Vision[]
    | Array<{
        label: string;
        changes: MonsterInputChanges;
      }>;
  optionChange?: number;
};

export type AppMonster = {
  code: number;
  title: string;
  subtitle?: string;
  names?: string[];
  resistance: MonsterResistance;
  variant?: MonsterVariant;
  inputConfigs?: MonsterInputConfig | MonsterInputConfig[];
};
