import { NewSetupManageInfo } from "@Store/calculatorSlice/reducer-types";
import { CalcConfigurations } from "@Store/calculatorSlice/types";

export type ConfigOption = {
  field: keyof CalcConfigurations;
  desc: string;
};

export type TemporarySetupInfo = NewSetupManageInfo & {
  uid: string;
  isCompared: boolean;
};
