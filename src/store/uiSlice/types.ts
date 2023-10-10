import type { SetupImportInfo } from "@Src/types";
import { EScreen } from "@Src/constants";

export type MySetupsModalType =
  | "TIPS"
  | "FIRST_COMBINE"
  | "COMBINE_MORE"
  | "SHARE_SETUP"
  | "REMOVE_SETUP"
  | "STATS"
  | "MODIFIERS"
  | "WEAPON"
  | "ARTIFACTS"
  | "";

export interface UIState {
  atScreen: EScreen;
  appModalType: "" | "INTRO" | "GUIDES" | "SETTINGS" | "UPLOAD" | "DOWNLOAD" | "DONATE";
  highManagerWorking: boolean;
  importInfo: SetupImportInfo;
  loading: boolean;
  mySetupsModalType: MySetupsModalType;
}
