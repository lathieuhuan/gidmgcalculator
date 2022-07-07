import { createSlice } from "@reduxjs/toolkit";
import { initTarget } from "./initiators";
import type { CalculatorState } from "./types";

const initialState: CalculatorState = {
  currentSetup: 0,
  configs: {
    separateCharInfo: false,
    keepArtStatsOnSwitch: false,
  },
  setups: [],
  char: null,
  charData: null,
  allSelfBuffCtrls: [],
  allSelfDebuffCtrls: [],
  allWps: [],
  allSubWpBuffCtrls: {},
  allSubWpDebuffCtrls: {},
  allArtInfo: [],
  allParties: [],
  allElmtModCtrls: [],
  allCustomBuffCtrls: [],
  allCustomDebuffCtrls: [],
  target: initTarget(),
  monster: null,
  allTotalAttrs: [],
  allArtAttrs: [],
  allRxnBonuses: [],
  allFinalInfusion: [],
  allDmgResult: [],
};

export const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {},
});

// export const {} = calculatorSlice.actions;

export default calculatorSlice.reducer;
