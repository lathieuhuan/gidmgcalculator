import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { EScreen } from "../constants";
import { UIState } from "./types";

const initialState: UIState = {
  atScreen: EScreen.CALCULATOR,
  introOn: true,
  settingsOn: false,
  standardSetup: 0,
  comparedSetups: [0],
  importType: 0,
  importInfo: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    changeScreen: (state, action: PayloadAction<EScreen>) => {
      state.atScreen = action.payload;
    },
    resetCalculatorUI: (state) => {
      state.atScreen = EScreen.CALCULATOR;
      state.standardSetup = 0;
      state.comparedSetups = [0];
      state.settingsOn = false;
    },
  },
});

export const { changeScreen, resetCalculatorUI } = uiSlice.actions;

export const selectAtScreen = (state: RootState) => state.ui.atScreen;

export const selectStandardSetup = (state: RootState) => state.ui.standardSetup;

export const selectComparedSetups = (state: RootState) => state.ui.comparedSetups;

export default uiSlice.reducer;
