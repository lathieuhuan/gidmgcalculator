import { EScreen } from "@Src/constants";
import { UserSetup } from "@Src/types";

export interface UIState {
  atScreen: EScreen;
  introOn: boolean;
  settingsOn: boolean;
  importInfo: ImportInfo;
}

export type ImportInfo = {
  type: "" | "EDIT_SETUP" | "IMPORT_OUTSIDE";
  data?: UserSetup;
};
