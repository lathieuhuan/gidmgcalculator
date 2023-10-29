import type { SetupImportInfo } from "@Src/types";
import type { TrackerState } from "@Src/features";
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
  trackerState: TrackerState;
  importInfo: SetupImportInfo;
  loading: boolean;
  ready: boolean;
  mySetupsModalType: MySetupsModalType;
}
