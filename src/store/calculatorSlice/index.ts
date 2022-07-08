import { createSlice } from "@reduxjs/toolkit";
import { initTarget } from "./initiators";
import { InitSessionWithCharAction } from "./reducer-types";
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
  reducers: {
    initSessionWithChar: (state, action: InitSessionWithCharAction) => {
      const { pickedChar, myWps, myArts } = action.payload;
      const [char, wp, art] = parseData(pickedChar, myWps, myArts);
      state.setups = [getSetupInfo({})];
      state.curSetupI = 0;
      state.char = char;
      state.charData = getCharacterData(char, charDataSelect);
      state.selfMCs = [initCharMCs(char.name, true)];
      state.wpRack = [wp];
      state.subWpMCs = [initSubWpMCs()];
      state.artChest = [art];
      state.parties = [initParty()];
      state.elmtMCs = [initElmtMCs()];
      state.customMCs = [initCustomMCs()];
      state.monster = initMonster();
      state.configs.sepCharInfo = false;
    }
  },
});

// export const {} = calculatorSlice.actions;

export default calculatorSlice.reducer;
