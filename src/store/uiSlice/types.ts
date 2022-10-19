import { PayloadAction } from "@reduxjs/toolkit";
import { EScreen } from "@Src/constants";
import { UsersSetup } from "@Src/types";

export interface UIState {
  atScreen: EScreen;
  introOn: boolean;
  settingsOn: boolean;
  standardID: number;
  comparedIDs: number[];
  importInfo: ImportInfo;
}

export type ImportInfo = {
  type: "" | "EDIT_SETUP" | "IMPORT_OUTSIDE";
  data?: UsersSetup;
};

export type ApplySettingsOnUIAction = PayloadAction<{
  standardID: number;
  comparedIDs: number[];
}>;
