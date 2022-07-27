import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import type {
  CalculatorState,
  CalcWeapon,
  CustomBuffCtrl,
  CustomDebuffCtrl,
  Level,
  ResonancePair,
  Vision,
} from "@Src/types";
import { findCharacter, getCharData } from "@Data/controllers";
import type {
  AddTeammateAction,
  ChangeCustomModCtrlValueAction,
  ChangeElementModCtrlAction,
  ChangeModCtrlInputAction,
  ChangeMonsterConfigAction,
  ChangeSubWpModCtrlInputAction,
  ChangeTeammateModCtrlInputAction,
  CopyCustomModCtrlsAction,
  InitSessionWithCharAction,
  ModifyTargetAction,
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
import {
  autoModifyTarget,
  calculate,
  getMainWpBuffCtrls,
  getSetupInfo,
  getSubWeaponBuffCtrls,
  getSubWeaponComplexBuffCtrls,
  parseAndInitData,
} from "./utils";
import monsters from "@Data/monsters";
import { MonsterConfig } from "@Data/monsters/types";
import { countVision, countWeapon, indexByCode, indexByName } from "@Src/utils";
import { RESONANCE_VISION_TYPES } from "@Src/constants";

const defaultChar = {
  name: "Albedo",
  ...initCharInfo({}),
};

const initialState: CalculatorState = {
  currentIndex: 0,
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
      state.currentIndex = 0;
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
    changeCurrentSetup: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    // CHARACTER
    levelCalcChar: (state, action: PayloadAction<Level>) => {
      const level = action.payload;
      const { char, currentIndex } = state;

      if (Array.isArray(char.level)) {
        char.level[currentIndex] = level;
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
        char.cons[state.currentIndex] = newCons;
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
        talentArr[state.currentIndex] = level;
        calculate(state);
      } else {
        char[type] = level;
        calculate(state, true);
      }
    },
    // PARTY
    addTeammate: (state, action: AddTeammateAction) => {
      const { name, vision, weapon, tmIndex } = action.payload;
      const { char, currentIndex } = state;
      const party = state.allParties[currentIndex];
      const elmtModCtrls = state.allElmtModCtrls[currentIndex];
      const subWpComplexBuffCtrls = state.allSubWpComplexBuffCtrls[currentIndex];

      const oldVisionCount = countVision(char, party);
      const oldWeaponCount = countWeapon(party);
      const oldTeammate = party[tmIndex];

      const [buffCtrls, debuffCtrls] = initCharModCtrls(name, false);

      // assign to party
      party[tmIndex] = { name, buffCtrls, debuffCtrls };

      const newVisionCount = countVision(char, party);
      const newWeaponCount = countWeapon(party);

      // cannot use RESONANCE_VISION_TYPES.includes(oldVision/vision) - ts error
      const resonanceVisionTypes = RESONANCE_VISION_TYPES.map((r) => r.toString());

      if (oldTeammate) {
        const oldTeammateData = findCharacter(oldTeammate);

        // there was an old teammate
        if (oldTeammateData) {
          const { vision: oldVision, weapon: oldWeapon } = oldTeammateData;

          // lose a resonance pair
          if (
            resonanceVisionTypes.includes(oldVision) &&
            oldVisionCount[oldVision] === 2 &&
            newVisionCount[oldVision] === 1
          ) {
            const resonanceIndex = elmtModCtrls.resonance.findIndex(
              (resonance) => resonance.vision === oldVision
            );
            elmtModCtrls.resonance.splice(resonanceIndex, 1);
          }
          // lose a weapon type in subWpBuffCtrl
          if (!newWeaponCount[oldWeapon]) {
            delete subWpComplexBuffCtrls[oldWeapon];
          }
        }
      }
      // new teammate form new resonance pair
      if (
        resonanceVisionTypes.includes(vision) &&
        oldVisionCount[vision] === 1 &&
        newVisionCount[vision] === 2
      ) {
        const newResonancePair = {
          vision,
          activated: ["pyro", "dendro"].includes(vision),
        } as ResonancePair;

        if (vision === "dendro") {
          newResonancePair.inputs = [false, false];
        }
        elmtModCtrls.resonance.push(newResonancePair);
      }
      // add a weapon type in subWpBuffCtrl
      if (!oldWeaponCount[weapon]) {
        subWpComplexBuffCtrls[weapon] = getSubWeaponComplexBuffCtrls(
          weapon,
          state.allWeapons[currentIndex].code
        );
      }
      calculate(state);
    },
    removeTeammate: (state, action: PayloadAction<number>) => {
      const tmIndex = action.payload;
      const { currentIndex } = state;
      const party = state.allParties[currentIndex];
      const elmtModCtrls = state.allElmtModCtrls[currentIndex];
      const teammate = party[tmIndex];

      if (teammate) {
        const { weapon, vision } = findCharacter(teammate)!;
        party[tmIndex] = null;

        const newVisionCount = countVision(state.char, party);
        const newWeaponCount = countWeapon(party);

        if (newVisionCount[vision] === 1) {
          const resonanceIndex = elmtModCtrls.resonance.findIndex(
            (resonance) => resonance.vision === vision
          );

          if (resonanceIndex >= 0) {
            elmtModCtrls.resonance.splice(resonanceIndex, 1);
          }
        }
        if (!newWeaponCount[weapon]) {
          delete state.allSubWpComplexBuffCtrls[currentIndex][weapon];
        }
        calculate(state);
      }
    },
    copyParty: (state, action: PayloadAction<number>) => {
      const targetIndex = action.payload;
      const { allParties, allElmtModCtrls, allSubWpComplexBuffCtrls, currentIndex } = state;

      allParties[currentIndex] = allParties[targetIndex];
      allElmtModCtrls[currentIndex] = allElmtModCtrls[targetIndex];
      allSubWpComplexBuffCtrls[currentIndex] = allSubWpComplexBuffCtrls[targetIndex];

      calculate(state);
    },
    // WEAPON
    changeWeapon: (state, action: PayloadAction<CalcWeapon>) => {
      const weapon = action.payload;
      const subWpBuffCtrls = state.allSubWpComplexBuffCtrls[state.currentIndex][weapon.type];

      state.allWeapons[state.currentIndex] = weapon;

      if (subWpBuffCtrls) {
        subWpBuffCtrls.splice(indexByCode(subWpBuffCtrls, weapon.code), 1);
        subWpBuffCtrls.push(...getSubWeaponBuffCtrls(weapon));
      }
      calculate(state);
    },
    upgradeWeapon: (state, action: PayloadAction<Level>) => {
      state.allWeapons[state.currentIndex].level = action.payload;
      calculate(state);
    },
    refineWeapon: (state, action: PayloadAction<number>) => {
      state.allWeapons[state.currentIndex].refi = action.payload;
      calculate(state);
    },
    // MOD CTRLS
    toggleResonance: (state, action: PayloadAction<Vision>) => {
      const resonance = state.allElmtModCtrls[state.currentIndex].resonance.find(
        ({ vision }) => vision === action.payload
      );
      if (resonance) {
        resonance.activated = !resonance.activated;
        calculate(state);
      }
    },
    toggleElementModCtrl: (state) => {
      const currentElmtModCtrls = state.allElmtModCtrls[state.currentIndex];

      currentElmtModCtrls.superconduct = !currentElmtModCtrls.superconduct;
      calculate(state);
    },
    changeElementModCtrl: (state, action: ChangeElementModCtrlAction) => {
      const { field, value } = action.payload;

      state.allElmtModCtrls[state.currentIndex][field] = value;
      calculate(state);
    },
    toggleModCtrl: (state, action: ToggleModCtrlAction) => {
      const { modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state[modCtrlName][state.currentIndex][ctrlIndex];

      ctrl.activated = !ctrl.activated;
      calculate(state);
    },
    changeModCtrlInput: (state, action: ChangeModCtrlInputAction) => {
      const { modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const { inputs } = state[modCtrlName][state.currentIndex][ctrlIndex];

      if (inputs) {
        inputs[inputIndex] = value;
        calculate(state);
      }
    },
    toggleTeammateModCtrl: (state, action: ToggleTeammateModCtrlAction) => {
      const { teammateIndex, modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state.allParties[state.currentIndex][teammateIndex]?.[modCtrlName][ctrlIndex];

      if (ctrl) {
        ctrl.activated = !ctrl.activated;
        calculate(state);
      }
    },
    changeTeammateModCtrlInput: (state, action: ChangeTeammateModCtrlInputAction) => {
      const { teammateIndex, modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const ctrl = state.allParties[state.currentIndex][teammateIndex]?.[modCtrlName][ctrlIndex];

      if (ctrl && ctrl.inputs) {
        ctrl.inputs[inputIndex] = value;
        calculate(state);
      }
    },
    toggleSubWpModCtrl: (state, action: ToggleSubWpModCtrlAction) => {
      const { weaponType, ctrlIndex } = action.payload;
      const ctrls = state.allSubWpComplexBuffCtrls[state.currentIndex][weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        ctrls[ctrlIndex].activated = !ctrls[ctrlIndex].activated;
        calculate(state);
      }
    },
    refineSubWeapon: (state, action: RefineSubWeaponAction) => {
      const { weaponType, ctrlIndex, value } = action.payload;
      const ctrls = state.allSubWpComplexBuffCtrls[state.currentIndex][weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        ctrls[ctrlIndex].refi = value;
        calculate(state);
      }
    },
    changeSubWpModCtrlInput: (state, action: ChangeSubWpModCtrlInputAction) => {
      const { weaponType, ctrlIndex, inputIndex, value } = action.payload;
      const ctrls = state.allSubWpComplexBuffCtrls[state.currentIndex][weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        const { inputs } = ctrls[ctrlIndex];

        if (inputs) {
          inputs[inputIndex] = value;
          calculate(state);
        }
      }
    },
    // CUSTOM MOD CTRLS
    createCustomBuffCtrl: (state, action: PayloadAction<CustomBuffCtrl>) => {
      state.allCustomBuffCtrls[state.currentIndex].unshift(action.payload);
      calculate(state);
    },
    createCustomDebuffCtrl: (state, action: PayloadAction<CustomDebuffCtrl>) => {
      state.allCustomDebuffCtrls[state.currentIndex].unshift(action.payload);
      calculate(state);
    },
    clearCustomModCtrls: (state, action: PayloadAction<boolean>) => {
      const modCtrlName = action.payload ? "allCustomBuffCtrls" : "allCustomDebuffCtrls";

      state[modCtrlName][state.currentIndex] = [];
      calculate(state);
    },
    copyCustomModCtrls: (state, action: CopyCustomModCtrlsAction) => {
      const { isBuffs, sourceIndex } = action.payload;
      const modCtrlName = isBuffs ? "allCustomBuffCtrls" : "allCustomDebuffCtrls";

      state[modCtrlName][state.currentIndex] = state[modCtrlName][sourceIndex];
      calculate(state);
    },
    removeCustomModCtrl: (state, action: RemoveCustomModCtrlAction) => {
      const { isBuffs, ctrlIndex } = action.payload;
      const modCtrlName = isBuffs ? "allCustomBuffCtrls" : "allCustomDebuffCtrls";

      state[modCtrlName][state.currentIndex].splice(ctrlIndex, 1);
      calculate(state);
    },
    changeCustomModCtrlValue: (state, action: ChangeCustomModCtrlValueAction) => {
      const { isBuffs, ctrlIndex, value } = action.payload;
      const modCtrlName = isBuffs ? "allCustomBuffCtrls" : "allCustomDebuffCtrls";

      state[modCtrlName][state.currentIndex][ctrlIndex].value = value;
      calculate(state);
    },
    // TARGET
    modifyTarget: (state, action: ModifyTargetAction) => {
      const { key, value } = action.payload;

      state.target[key] = value;
      calculate(state);
    },
    changeMonster: (state, action: PayloadAction<number>) => {
      const monsterData = monsters[action.payload];
      if (!monsterData) return;

      const { variant, config } = monsterData;
      const inputs: MonsterConfig[] = [];

      if (config) {
        for (const type of config.renderTypes) {
          if (type === "check") {
            inputs.push(false);
          }
        }
      }
      state.monster = {
        index: action.payload,
        variantIndex: variant ? 0 : null,
        configs: inputs,
      };
      autoModifyTarget(state.target, state.monster);
      calculate(state, true);
    },
    changeMonsterConfig: (state, action: ChangeMonsterConfigAction) => {
      const { inputIndex, value } = action.payload;

      state.monster.configs[inputIndex] = value;
      autoModifyTarget(state.target, state.monster);
      calculate(state, true);
    },
  },
});

export const {
  initSessionWithChar,
  changeCurrentSetup,
  levelCalcChar,
  changeConsLevel,
  changeTalentLevel,
  addTeammate,
  removeTeammate,
  copyParty,
  changeWeapon,
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
  createCustomBuffCtrl,
  createCustomDebuffCtrl,
  clearCustomModCtrls,
  copyCustomModCtrls,
  removeCustomModCtrl,
  changeCustomModCtrlValue,
  modifyTarget,
  changeMonster,
  changeMonsterConfig,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
