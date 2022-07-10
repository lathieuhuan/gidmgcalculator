import { createSlice } from "@reduxjs/toolkit";
import type { CalculatorState } from "@Src/types";
import { getCharData } from "@Data/controllers";
import type { InitSessionWithCharAction } from "./reducer-types";
import { initCharModCtrls, initElmtModCtrls, initMonster, initTarget } from "./initiators";
import { getSetupInfo, parseAndInitData } from "./utils";

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
  allSubWpComplexBuffCtrls: [{}],
  allSubWpComplexDebuffCtrls: [{}],
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
  isError: false,
};

export const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    initSessionWithChar: (state, action: InitSessionWithCharAction) => {
      const { pickedChar, myWps, myArts } = action.payload;
      const [char, weapon, art] = parseAndInitData(pickedChar, myWps, myArts);
      const [selfBuffCtrls, selfDebuffCtrls] = initCharModCtrls(char.name, true);

      state.setups = [getSetupInfo({})];
      state.currentSetup = state.setups[0].ID;
      state.char = char;
      state.charData = getCharData(char);
      state.allSelfBuffCtrls = [selfBuffCtrls];
      state.allSelfDebuffCtrls = [selfDebuffCtrls];
      state.allWps = [weapon];
      state.allSubWpComplexBuffCtrls = [{}];
      state.allArtInfo = [art];
      state.allParties = [[null, null, null]];
      state.allElmtModCtrls = [initElmtModCtrls()];
      state.allCustomBuffCtrls = [];
      state.allCustomDebuffCtrls = [];
      state.monster = initMonster();
      state.configs.separateCharInfo = false;
    },
  },
});

export const { initSessionWithChar } = calculatorSlice.actions;

export default calculatorSlice.reducer;
