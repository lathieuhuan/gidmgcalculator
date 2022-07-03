import { EScreen } from "../constants";

export interface UIState {
  atScreen: EScreen;
  introOn: boolean;
  settingsOn: boolean;
  standardSetup: number;
  comparedSetups: number[];
  // #todo
  importType: number;
  importInfo: any | null;
}
