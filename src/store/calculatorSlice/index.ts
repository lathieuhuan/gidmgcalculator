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
  allWeapons: [],
  allSubWpComplexBuffCtrls: [{}],
  allSubWpComplexDebuffCtrls: [{}],
  allArtInfos: [],
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
      state.currentSetup = 0;
      state.char = char;
      state.charData = getCharData(char);
      state.allSelfBuffCtrls = [selfBuffCtrls];
      state.allSelfDebuffCtrls = [selfDebuffCtrls];
      state.allWeapons = [weapon];
      state.allSubWpComplexBuffCtrls = [{}];
      state.allArtInfos = [art];
      state.allParties = [[null, null, null]];
      state.allElmtModCtrls = [initElmtModCtrls()];
      state.allCustomBuffCtrls = [[]];
      state.allCustomDebuffCtrls = [[]];
      state.monster = initMonster();
      state.configs.separateCharInfo = false;
      state.touched = true;

      calculate(state, true);
    },
    // character
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
    changeConsLevel: (state, action: PayloadAction<number>) => {
      const newCons = action.payload;
      const { char } = state;
      if (Array.isArray(char.cons)) {
        char.cons[state.currentSetup] = newCons;
        calculate(state);
      } else {
        char.cons = newCons;
        calculate(state, true);
      }
    },
    changeTalentLevel: (
      state,
      action: PayloadAction<{ type: "NAs" | "ES" | "EB"; level: number }>
    ) => {
      const { type, level } = action.payload;
      const { char } = state;
      const talentArr = char[type];

      if (Array.isArray(talentArr)) {
        talentArr[state.currentSetup] = level;
        calculate(state);
      } else {
        char[type] = level;
        calculate(state, true);
      }
    },
    // weapon
    upgradeWeapon: (state, action: PayloadAction<Level>) => {
      state.allWeapons[state.currentSetup].level = action.payload;
      calculate(state);
    },
    refineWeapon: (state, action: PayloadAction<number>) => {
      state.allWeapons[state.currentSetup].refi = action.payload;
      calculate(state);
    },
  },
});

export const {
  initSessionWithChar,
  levelCalcChar,
  changeConsLevel,
  changeTalentLevel,
  upgradeWeapon,
  refineWeapon,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
