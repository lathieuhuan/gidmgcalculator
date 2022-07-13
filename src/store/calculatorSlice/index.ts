import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CalculatorState, Level } from "@Src/types";
import { getCharData } from "@Data/controllers";
import type { InitSessionWithCharAction } from "./reducer-types";
import {
  initCharInfo,
  initCharModCtrls,
  initElmtModCtrls,
  initMonster,
  initTarget,
} from "./initiators";
import { calculate, getSetupInfo, parseAndInitData } from "./utils";

const defaultChar = {
  name: "Albedo",
  ...initCharInfo({}),
};

const initialState: CalculatorState = {
  currentSetup: 0,
  configs: {
    separateCharInfo: false,
    keepArtStatsOnSwitch: false,
  },
  setups: [],
  char: defaultChar,
  charData: getCharData(defaultChar),
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
  monster: initMonster(),
  allTotalAttrs: [],
  allArtAttrs: [],
  allRxnBonuses: [],
  allFinalInfusion: [],
  allDmgResult: [],
  isError: false,
  touched: false,
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
      state.touched = true;

      calculate(state, true);
    },
    levelCalcChar: (state, action: PayloadAction<Level>) => {
      const level = action.payload;
      const { char, currentSetup } = state;

      if (Array.isArray(char.level)) {
        char.level[currentSetup] = level;
        calculate(state);
      } else {
        char.level = level;
        calculate(state, true);
      }
    },
  },
});

export const { initSessionWithChar, levelCalcChar } = calculatorSlice.actions;

export default calculatorSlice.reducer;
