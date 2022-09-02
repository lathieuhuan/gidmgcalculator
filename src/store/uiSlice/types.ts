import { EScreen } from "@Src/constants";

export interface UIState {
  atScreen: EScreen;
  introOn: boolean;
  settingsOn: boolean;
  standardIndex: number;
  comparedIndexes: number[];
  // #todo
  importType: number;
  importInfo: any | null;
}
