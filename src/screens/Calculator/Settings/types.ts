import type { CalcSetup } from "@Src/types";

export type TemporarySetup = CalcSetup & {
  index: number | null;
  checked: boolean;
  isStandard: boolean;
  isCurrent: boolean;
};

export type SettingsModalType =
  | "CONFIG_TIPS"
  | "SAVE_SETUP"
  | "SHARE_SETUP"
  | "UPDATE_USERS_DATA"
  | "";

export type SettingsModalInfo = {
  type: SettingsModalType;
  index: number | null;
};
