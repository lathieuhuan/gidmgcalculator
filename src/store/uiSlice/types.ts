import type { AppCharacter, SetupImportInfo } from "@Src/types";
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
  appModalType: "" | "INTRO" | "GUIDES" | "SETTINGS" | "UPLOAD" | "DOWNLOAD";
  highManagerWorking: boolean;
  importInfo: SetupImportInfo;
  loadingCharacter: Pick<AppCharacter, "name" | "icon" | "vision" | "rarity" | "beta"> | null;
  mySetupsModalType: MySetupsModalType;
}
