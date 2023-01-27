import type { SetupImportInfo } from "@Src/types";
import { EScreen } from "@Src/constants";

export type TrackerModalState = "HIDDEN" | "CLOSE" | "OPEN";

export interface UIState {
  atScreen: EScreen;
  settingsOn: boolean;
  resultsEnlarged: boolean;
  trackerModalState: TrackerModalState;
  importInfo: SetupImportInfo;
}
