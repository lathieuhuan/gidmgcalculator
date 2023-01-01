import type { SetupImportInfo } from "@Src/types";
import { EScreen } from "@Src/constants";

export interface UIState {
  atScreen: EScreen;
  introOn: boolean;
  settingsOn: boolean;
  importInfo: SetupImportInfo;
}
