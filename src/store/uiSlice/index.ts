import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EScreen } from "@Src/constants";
import type { RootState } from "../index";
import type { ApplySettingsOnUIAction, ImportInfo, UIState } from "./types";

const initialState: UIState = {
  atScreen: EScreen.CALCULATOR,
  introOn: true,
  settingsOn: false,
  standardIndex: 0,
  comparedIndexes: [0],
  importInfo: {
    type: "",
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleIntro: (state, action: PayloadAction<boolean>) => {
      state.introOn = action.payload;
    },
    changeScreen: (state, action: PayloadAction<EScreen>) => {
      state.atScreen = action.payload;
    },
    resetCalculatorUI: (state) => {
      state.atScreen = EScreen.CALCULATOR;
      state.standardIndex = 0;
      state.comparedIndexes = [0];
      state.settingsOn = false;
    },
    changeStandardSetup: (state, action: PayloadAction<number>) => {
      state.standardIndex = action.payload;
    },
    toggleSettings: (state, action: PayloadAction<boolean>) => {
      state.settingsOn = action.payload;
    },
    applySettingsOnUI: (state, action: ApplySettingsOnUIAction) => {
      const { comparedIndexes, standardIndex } = action.payload;
      state.comparedIndexes = comparedIndexes;
      state.standardIndex = standardIndex;
      state.settingsOn = false;
    },
    updateImportInfo: (state, action: PayloadAction<ImportInfo>) => {
      state.importInfo = action.payload;
    },
  },
});

export const {
  toggleIntro,
  changeScreen,
  resetCalculatorUI,
  changeStandardSetup,
  toggleSettings,
  applySettingsOnUI,
  updateImportInfo,
} = uiSlice.actions;

export const selectAtScreen = (state: RootState) => state.ui.atScreen;

export const selectStandardIndex = (state: RootState) => state.ui.standardIndex;

export const selectComparedIndexes = (state: RootState) => state.ui.comparedIndexes;

export default uiSlice.reducer;
