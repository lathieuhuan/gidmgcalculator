import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CalculatorState, Level, Vision } from "@Src/types";
import { getCharData } from "@Data/controllers";
import type {
  ChangeCustomModCtrlValueAction,
  ChangeElementModCtrlAction,
  ChangeModCtrlInputAction,
  ChangeSubWpModCtrlInputAction,
  ChangeTeammateModCtrlInputAction,
  CopyCustomModCtrlsAction,
  InitSessionWithCharAction,
  RefineSubWeaponAction,
  RemoveCustomModCtrlAction,
  ToggleModCtrlAction,
  ToggleSubWpModCtrlAction,
  ToggleTeammateModCtrlAction,
} from "./reducer-types";
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
  allWpBuffCtrls: [],
  allSubWpComplexBuffCtrls: [{}],
  allArtInfos: [],
  allArtBuffCtrls: [],
  allSubArtBuffCtrls: [],
  allSubArtDebuffCtrls: [],
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
      const result = parseAndInitData(pickedChar, myWps, myArts);

      const [selfBuffCtrls, selfDebuffCtrls] = initCharModCtrls(result.char.name, true);

      state.setups = [getSetupInfo({})];
      state.currentSetup = 0;
      state.char = result.char;
      state.charData = getCharData(result.char);
      state.allSelfBuffCtrls = [selfBuffCtrls];
      state.allSelfDebuffCtrls = [selfDebuffCtrls];
      state.allWeapons = [result.weapon];
      state.allWpBuffCtrls = [result.wpBuffCtrls];
      state.allSubWpComplexBuffCtrls = [{}];
      state.allArtInfos = [result.artInfo];
      state.allArtBuffCtrls = [result.artBuffCtrls];
      state.allSubArtBuffCtrls = [result.subArtBuffCtrls];
      state.allSubArtDebuffCtrls = [result.subArtDebuffCtrls];
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
    //
    toggleResonance: (state, action: PayloadAction<Vision>) => {
      const resonance = state.allElmtModCtrls[state.currentSetup].resonance.find(
        ({ vision }) => vision === action.payload
      );
      if (resonance) {
        resonance.activated = !resonance.activated;
        calculate(state);
      }
    },
    toggleElementModCtrl: (state) => {
      const currentElmtModCtrls = state.allElmtModCtrls[state.currentSetup];
      currentElmtModCtrls.superconduct = !currentElmtModCtrls.superconduct;
      calculate(state);
    },
    changeElementModCtrl: (state, action: ChangeElementModCtrlAction) => {
      const { field, value } = action.payload;
      state.allElmtModCtrls[state.currentSetup][field] = value;
      calculate(state);
    },
    toggleModCtrl: (state, action: ToggleModCtrlAction) => {
      const { modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state[modCtrlName][state.currentSetup][ctrlIndex];
      ctrl.activated = !ctrl.activated;
      calculate(state);
    },
    changeModCtrlInput: (state, action: ChangeModCtrlInputAction) => {
      const { modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const { inputs } = state[modCtrlName][state.currentSetup][ctrlIndex];

      if (inputs) {
        inputs[inputIndex] = value;
        calculate(state);
      }
    },
    toggleTeammateModCtrl: (state, action: ToggleTeammateModCtrlAction) => {
      const { teammateIndex, modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state.allParties[state.currentSetup][teammateIndex]?.[modCtrlName][ctrlIndex];

      if (ctrl) {
        ctrl.activated = !ctrl.activated;
        calculate(state);
      }
    },
    changeTeammateModCtrlInput: (state, action: ChangeTeammateModCtrlInputAction) => {
      const { teammateIndex, modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const ctrl = state.allParties[state.currentSetup][teammateIndex]?.[modCtrlName][ctrlIndex];

      if (ctrl && ctrl.inputs) {
        ctrl.inputs[inputIndex] = value;
        calculate(state);
      }
    },
    toggleSubWpModCtrl: (state, action: ToggleSubWpModCtrlAction) => {
      const { weaponType, ctrlIndex } = action.payload;
      const ctrls = state.allSubWpComplexBuffCtrls[state.currentSetup][weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        ctrls[ctrlIndex].activated = !ctrls[ctrlIndex].activated;
        calculate(state);
      }
    },
    refineSubWeapon: (state, action: RefineSubWeaponAction) => {
      const { weaponType, ctrlIndex, value } = action.payload;
      const ctrls = state.allSubWpComplexBuffCtrls[state.currentSetup][weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        ctrls[ctrlIndex].refi = value;
        calculate(state);
      }
    },
    changeSubWpModCtrlInput: (state, action: ChangeSubWpModCtrlInputAction) => {
      const { weaponType, ctrlIndex, inputIndex, value } = action.payload;
      const ctrls = state.allSubWpComplexBuffCtrls[state.currentSetup][weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        const { inputs } = ctrls[ctrlIndex];

        if (inputs) {
          inputs[inputIndex] = value;
          calculate(state);
        }
      }
    },
    clearCustomModCtrls: (state, action: PayloadAction<boolean>) => {
      const modCtrlName = action.payload ? "allCustomBuffCtrls" : "allCustomDebuffCtrls";
      state[modCtrlName][state.currentSetup] = [];
      calculate(state);
    },
    copyCustomModCtrls: (state, action: CopyCustomModCtrlsAction) => {
      const { isBuffs, sourceIndex } = action.payload;
      const modCtrlName = isBuffs ? "allCustomBuffCtrls" : "allCustomDebuffCtrls";
      state[modCtrlName][state.currentSetup] = state[modCtrlName][sourceIndex];
      calculate(state);
    },
    removeCustomModCtrl: (state, action: RemoveCustomModCtrlAction) => {
      const { isBuffs, ctrlIndex } = action.payload;
      const modCtrlName = isBuffs ? "allCustomBuffCtrls" : "allCustomDebuffCtrls";
      state[modCtrlName][state.currentSetup].slice(ctrlIndex, 1);
      calculate(state);
    },
    changeCustomModCtrlValue: (state, action: ChangeCustomModCtrlValueAction) => {
      const { isBuffs, ctrlIndex, value } = action.payload;
      const modCtrlName = isBuffs ? "allCustomBuffCtrls" : "allCustomDebuffCtrls";
      state[modCtrlName][state.currentSetup][ctrlIndex].value = value;
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
  toggleResonance,
  toggleElementModCtrl,
  changeElementModCtrl,
  toggleModCtrl,
  changeModCtrlInput,
  toggleTeammateModCtrl,
  changeTeammateModCtrlInput,
  toggleSubWpModCtrl,
  refineSubWeapon,
  changeSubWpModCtrlInput,
  clearCustomModCtrls,
  copyCustomModCtrls,
  removeCustomModCtrl,
  changeCustomModCtrlValue,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
