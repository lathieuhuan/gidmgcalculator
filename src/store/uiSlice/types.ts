import { PayloadAction } from "@reduxjs/toolkit";
import { EScreen } from "@Src/constants";
import { UsersSetup } from "@Src/types";

export interface UIState {
  atScreen: EScreen;
  introOn: boolean;
  settingsOn: boolean;
  standardIndex: number;
  comparedIndexes: number[];
  // #todo
  importInfo: ImportInfo | null;
}

export type ImportInfo = {
  type: "" | "EDIT_SETUP" | "IMPORT_OUTSIDE";
  data: UsersSetup | null;
};

export type ApplySettingsOnUIAction = PayloadAction<{
  comparedIndexes: number[];
  standardIndex: number;
}>;
