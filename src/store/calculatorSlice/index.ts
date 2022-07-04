import { createSlice } from "@reduxjs/toolkit";
import { CalculatorState } from "./types";

const initialState: CalculatorState = {
  configs: {
    separateCharInfo: false,
    keepArtStatsWhenSwitching: false,
  },
  currentSetup: 0,
  setups: [],
  char: null,
  charData: null,
  allSelfModCtrls: [],
  allWps: [],
  allSubWpModCtrl: [],
  allArts: [],
  allParties: [],
  allElmtModCtrls: [],
  allCustomMCs: [],
  target: {},
  monster: null
};

export const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {},
});

// export const {} = calculatorSlice.actions;

export default calculatorSlice.reducer;