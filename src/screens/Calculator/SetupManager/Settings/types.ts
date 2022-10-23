import { CalcConfigurations } from "@Store/calculatorSlice/types";

export type ConfigOption = {
  field: keyof CalcConfigurations;
  desc: string;
};
