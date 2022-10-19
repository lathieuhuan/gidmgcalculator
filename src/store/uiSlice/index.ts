import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EScreen } from "@Src/constants";
import type { RootState } from "../index";
import type { ApplySettingsOnUIAction, ImportInfo, UIState } from "./types";

const initialState: UIState = {
  atScreen: EScreen.CALCULATOR,
  introOn: true,
  settingsOn: false,
  standardID: 0,
  comparedIDs: [],
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
      // state.standardIndex = 0;
      state.comparedIDs = [];
      state.settingsOn = false;
    },
    // changeStandardSetup: (state, action: PayloadAction<number>) => {
    //   state.standardIndex = action.payload;
    // },
    toggleSettings: (state, action: PayloadAction<boolean>) => {
      state.settingsOn = action.payload;
    },
    applySettingsOnUI: (state, action: ApplySettingsOnUIAction) => {
      const { comparedIDs, standardID } = action.payload;
      state.comparedIDs = comparedIDs;
      state.standardID = standardID;
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
  // changeStandardSetup,
  toggleSettings,
  applySettingsOnUI,
  updateImportInfo,
} = uiSlice.actions;

export const selectAtScreen = (state: RootState) => state.ui.atScreen;

export const selectStandardID = (state: RootState) => state.ui.standardID;

export const selectComparedIDs = (state: RootState) => state.ui.comparedIDs;

export default uiSlice.reducer;
