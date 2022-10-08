import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import type {
  AttackElement,
  CalcArtPiece,
  CalcSetupManageInfo,
  CalculatorState,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  CustomDebuffCtrl,
  Monster,
  ResonancePair,
  Target,
  UsersSetup,
  Vision,
} from "@Src/types";
import type {
  AddTeammateAction,
  ApplySettingsOnCalculatorAction,
  ChangeArtPieceAction,
  ChangeArtPieceSubStatAction,
  ChangeCustomModCtrlValueAction,
  ChangeElementModCtrlAction,
  ChangeModCtrlInputAction,
  ChangeSubWpModCtrlInputAction,
  ChangeTeammateModCtrlInputAction,
  CopyCustomModCtrlsAction,
  ImportSetupAction,
  InitSessionWithCharAction,
  RefineSubWeaponAction,
  RemoveCustomModCtrlAction,
  ToggleModCtrlAction,
  ToggleSubWpModCtrlAction,
  ToggleTeammateModCtrlAction,
  UpdateArtPieceAction,
} from "./reducer-types";

import { findArtifactSet, findCharacter, getCharData } from "@Data/controllers";

import { ATTACK_ELEMENTS, RESONANCE_VISION_TYPES } from "@Src/constants";
import {
  bareLv,
  countVision,
  countWeapon,
  deepCopy,
  findByCode,
  findById,
  indexByCode,
  turnArray,
} from "@Src/utils";
import {
  calculate,
  getAllSubArtBuffCtrls,
  getAllSubArtDebuffCtrls,
  getArtifactSets,
  getMainArtBuffCtrls,
  getMainWpBuffCtrls,
  getNewSetupName,
  getSetupManageInfo,
  getSubArtBuffCtrls,
  getSubWeaponBuffCtrls,
  getSubWeaponComplexBuffCtrls,
  parseAndInitData,
} from "./utils";
import {
  initCharInfo,
  initWeapon,
  initCharModCtrls,
  initElmtModCtrls,
  initMonster,
  initTarget,
} from "./initiators";
import monsters from "@Data/monsters";

const defaultChar = {
  name: "Albedo",
  ...initCharInfo({}),
};

const initialState: CalculatorState = {
  activeId: 0,
  configs: {
    separateCharInfo: false,
    keepArtStatsOnSwitch: false,
  },
  charData: getCharData(defaultChar),
  setupManageInfos: [],
  setupsById: {},
  target: initTarget(),
  monster: initMonster(),
  allTotalAttrs: {},
  allArtAttr: {},
  allRxnBonuses: {},
  allFinalInfusion: {},
  allDmgResult: {},
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
      const setupManageInfo = getSetupManageInfo({});

      state.activeId = setupManageInfo.ID;
      state.configs.separateCharInfo = false;
      state.touched = true;

      state.charData = getCharData(result.char);
      state.setupManageInfos = [setupManageInfo];
      state.setupsById = {
        [setupManageInfo.ID]: {
          char: result.char,
          selfBuffCtrls: selfBuffCtrls,
          selfDebuffCtrls: selfDebuffCtrls,
          weapon: result.weapon,
          wpBuffCtrls: result.wpBuffCtrls,
          subWpComplexBuffCtrls: {},
          artInfo: result.artInfo,
          artBuffCtrls: result.artBuffCtrls,
          subArtBuffCtrls: result.subArtBuffCtrls,
          subArtDebuffCtrls: result.subArtDebuffCtrls,
          party: [null, null, null],
          elmtModCtrls: initElmtModCtrls(),
          customBuffCtrls: [],
          customDebuffCtrls: [],
        },
      };
      state.monster = initMonster();

      calculate(state, true);
    },
    initSessionWithSetup: (state, action: PayloadAction<UsersSetup>) => {
      const { ID, type, target, ...setupInfo } = action.payload;

      state.charData = getCharData(setupInfo.char);
      state.setupManageInfos = [getSetupManageInfo({ ID, type })];
      state.setupsById = {
        [ID]: setupInfo,
      };
      state.target = target;
      state.monster = initMonster();
      state.configs.separateCharInfo = false;
      state.activeId = ID;

      calculate(state);
    },
    changeActiveSetup: (state, action: PayloadAction<number>) => {
      state.activeId = action.payload;
    },
    importSetup: (state, action: ImportSetupAction) => {
      const { data, shouldOverwriteChar, shouldOverwriteTarget } = action.payload;
      const { ID, type, name, target, ...importedsetup } = data;
      const { setupManageInfos, setupsById } = state;
      const { separateCharInfo } = state.configs;

      if (shouldOverwriteChar && separateCharInfo) {
        for (const setup of Object.values(setupsById)) {
          setup.char = importedsetup.char;
        }
      }
      if (shouldOverwriteTarget) {
        state.target = target;
      }

      state.setupManageInfos.push(
        getSetupManageInfo({ name: getNewSetupName(setupManageInfos), ID, type })
      );
      state.setupsById[ID] = importedsetup;
      state.activeId = ID;

      calculate(state, shouldOverwriteChar || shouldOverwriteTarget);
    },
    closeError: (state) => {
      state.isError = false;
    },
    // CHARACTER
    updateCharacter: (state, action: PayloadAction<Partial<CharInfo>>) => {
      const { configs, setupsById, target } = state;
      const { level } = action.payload;

      if (level && target.level === 1) {
        target.level = bareLv(level);
      }
      if (configs.separateCharInfo) {
        const currentSetup = setupsById[state.activeId];
        currentSetup.char = {
          ...currentSetup.char,
          ...action.payload,
        };
      } else {
        for (const setup of Object.values(setupsById)) {
          setup.char = {
            ...setup.char,
            ...action.payload,
          };
        }
      }
      calculate(state, configs.separateCharInfo);
    },
    // PARTY
    addTeammate: (state, action: AddTeammateAction) => {
      const { name, vision, weapon: weaponType, tmIndex } = action.payload;
      const setup = state.setupsById[state.activeId];
      const { char, weapon, party, elmtModCtrls, subWpComplexBuffCtrls } = setup;

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
          activated: ["pyro", "hydro", "dendro"].includes(vision),
        } as ResonancePair;

        if (vision === "dendro") {
          newResonancePair.inputs = [false, false];
        }
        elmtModCtrls.resonance.push(newResonancePair);
      }
      // add a weapon type in subWpBuffCtrl
      if (!oldWeaponCount[weaponType]) {
        subWpComplexBuffCtrls[weaponType] = getSubWeaponComplexBuffCtrls(weaponType, weapon.code);
      }
      calculate(state);
    },
    removeTeammate: (state, action: PayloadAction<number>) => {
      const tmIndex = action.payload;
      const { char, party, elmtModCtrls, subWpComplexBuffCtrls } = state.setupsById[state.activeId];
      const teammate = party[tmIndex];

      if (teammate) {
        const { weapon, vision } = findCharacter(teammate)!;
        party[tmIndex] = null;

        const newVisionCount = countVision(char, party);
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
          delete subWpComplexBuffCtrls[weapon];
        }
        calculate(state);
      }
    },
    copyParty: (state, action: PayloadAction<number>) => {
      const activeSetup = state.setupsById[state.activeId];
      const sourceSetup = state.setupsById[action.payload];
      activeSetup.party = sourceSetup.party;
      activeSetup.elmtModCtrls = sourceSetup.elmtModCtrls;
      activeSetup.subWpComplexBuffCtrls = sourceSetup.subWpComplexBuffCtrls;

      calculate(state);
    },
    // WEAPON
    pickWeaponInUsersDatabase: (state, action: PayloadAction<CalcWeapon>) => {
      const wpInfo = action.payload;
      const setup = state.setupsById[state.activeId];
      setup.weapon = wpInfo;
      setup.wpBuffCtrls = getMainWpBuffCtrls(wpInfo);

      calculate(state);
    },
    changeWeapon: (state, action: PayloadAction<CalcWeapon>) => {
      const weapon = action.payload;
      const setup = state.setupsById[state.activeId];
      const subWpBuffCtrls = setup.subWpComplexBuffCtrls[weapon.type];

      const oldWeapon = { ...setup.weapon };
      setup.weapon = weapon;
      setup.wpBuffCtrls = getMainWpBuffCtrls(weapon);

      if (subWpBuffCtrls) {
        const existIndex = indexByCode(subWpBuffCtrls, weapon.code);

        if (existIndex !== -1) {
          subWpBuffCtrls.splice(existIndex, 1);
        }
        subWpBuffCtrls.push(...getSubWeaponBuffCtrls(oldWeapon));
      }
      calculate(state);
    },
    updateWeapon: (state, action: PayloadAction<Partial<CalcWeapon>>) => {
      const currentSetup = state.setupsById[state.activeId];
      currentSetup.weapon = {
        ...currentSetup.weapon,
        ...action.payload,
      };
      calculate(state);
    },
    // ARTIFACTS
    updateArtPiece: (state, action: UpdateArtPieceAction) => {
      const { pieceIndex, level, mainStatType } = action.payload;
      const piece = state.setupsById[state.activeId].artInfo.pieces[pieceIndex];

      if (piece) {
        if (level !== undefined) {
          piece.level = level;
        }
        if (mainStatType) {
          piece.mainStatType = mainStatType;
        }
      }
      calculate(state);
    },
    updateArtPieceSubStat: (state, action: ChangeArtPieceSubStatAction) => {
      const { pieceIndex, subStatIndex, ...changeInfo } = action.payload;
      const pieceInfo = state.setupsById[state.activeId].artInfo.pieces[pieceIndex];

      if (pieceInfo) {
        pieceInfo.subStats[subStatIndex] = {
          ...pieceInfo.subStats[subStatIndex],
          ...changeInfo,
        };
        calculate(state);
      }
    },
    changeArtPiece: (state, action: ChangeArtPieceAction) => {
      const { pieceIndex, newPiece, isFresh } = action.payload;
      const setup = state.setupsById[state.activeId];
      const { artInfo, subArtBuffCtrls } = setup;

      const piece = artInfo.pieces[pieceIndex];

      if (piece && newPiece && isFresh && state.configs.keepArtStatsOnSwitch) {
        piece.code = newPiece.code;
        piece.rarity = newPiece.rarity;
      } else {
        artInfo.pieces[pieceIndex] = newPiece;
      }

      const oldSets = artInfo.sets;
      artInfo.sets = getArtifactSets(artInfo.pieces);

      const oldBonusLevel = oldSets[0]?.bonusLv;
      const newSetBonus = artInfo.sets[0];

      if (newSetBonus) {
        if (oldBonusLevel === 0 && newSetBonus.bonusLv) {
          setup.artBuffCtrls = getMainArtBuffCtrls(newSetBonus.code);

          // find ctrl of the same buff in subArtBuffCtrls
          const position = indexByCode(subArtBuffCtrls, newSetBonus.code);

          // remove if found, coz no duplicate
          if (position !== -1) {
            subArtBuffCtrls.splice(position, 1);
          }
        } else if (oldBonusLevel && !newSetBonus.bonusLv) {
          setup.artBuffCtrls = [];

          const oldSetCode = oldSets[0].code;
          const { buffs } = findArtifactSet({ code: oldSetCode }) || {};

          if (buffs) {
            subArtBuffCtrls.push(...getSubArtBuffCtrls(oldSetCode));
          }
        }
      }
      calculate(state);
    },
    updateAllArtPieces: (state, action: PayloadAction<(CalcArtPiece | null)[]>) => {
      const pieces = action.payload;
      const sets = getArtifactSets(pieces);
      const bonusLv = sets[0]?.bonusLv;
      const setup = state.setupsById[state.activeId];

      if (bonusLv) {
        setup.subArtBuffCtrls = setup.subArtBuffCtrls.filter((ctrl) => ctrl.code !== sets[0].code);
      }
      setup.artInfo = { pieces, sets };
      setup.artBuffCtrls = bonusLv ? getMainArtBuffCtrls(sets[0].code) : [];

      calculate(state);
    },
    copyAllArtifacts: (state, action: PayloadAction<number>) => {
      const activeSetup = state.setupsById[state.activeId];
      const sourceSetup = state.setupsById[action.payload];
      activeSetup.artInfo = sourceSetup.artInfo;
      activeSetup.artBuffCtrls = sourceSetup.artBuffCtrls;
      activeSetup.subArtBuffCtrls = sourceSetup.subArtBuffCtrls;
      activeSetup.subArtDebuffCtrls = sourceSetup.subArtDebuffCtrls;

      calculate(state);
    },
    // MOD CTRLS
    toggleResonance: (state, action: PayloadAction<Vision>) => {
      const rsn = state.setupsById[state.activeId].elmtModCtrls.resonance.find(({ vision }) => {
        return vision === action.payload;
      });

      if (rsn) {
        rsn.activated = !rsn.activated;
        calculate(state);
      }
    },
    changeResonanceInput: (state, action: PayloadAction<number>) => {
      // for now only dendro has inputs
      const dendroRsn = state.setupsById[state.activeId].elmtModCtrls.resonance.find(
        ({ vision }) => {
          return vision === "dendro";
        }
      );

      if (dendroRsn && dendroRsn.inputs) {
        dendroRsn.inputs[action.payload] = !dendroRsn.inputs[action.payload];
        calculate(state);
      }
    },
    toggleElementModCtrl: (
      state,
      action: PayloadAction<"superconduct" | "aggravate" | "spread">
    ) => {
      const key = action.payload;
      const { elmtModCtrls } = state.setupsById[state.activeId];

      elmtModCtrls[key] = !elmtModCtrls[key];
      calculate(state);
    },
    changeElementModCtrl: (state, action: ChangeElementModCtrlAction) => {
      const { field, value } = action.payload;

      state.setupsById[state.activeId].elmtModCtrls[field] = value;
      calculate(state);
    },
    toggleModCtrl: (state, action: ToggleModCtrlAction) => {
      const { modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state.setupsById[state.activeId][modCtrlName][ctrlIndex];

      ctrl.activated = !ctrl.activated;
      calculate(state);
    },
    changeModCtrlInput: (state, action: ChangeModCtrlInputAction) => {
      const { modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const { inputs } = state.setupsById[state.activeId][modCtrlName][ctrlIndex];

      if (inputs) {
        inputs[inputIndex] = value;
        calculate(state);
      }
    },
    toggleTeammateModCtrl: (state, action: ToggleTeammateModCtrlAction) => {
      const { teammateIndex, modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state.setupsById[state.activeId].party[teammateIndex]?.[modCtrlName][ctrlIndex];

      if (ctrl) {
        ctrl.activated = !ctrl.activated;
        calculate(state);
      }
    },
    changeTeammateModCtrlInput: (state, action: ChangeTeammateModCtrlInputAction) => {
      const { teammateIndex, modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const ctrl = state.setupsById[state.activeId].party[teammateIndex]?.[modCtrlName][ctrlIndex];

      if (ctrl && ctrl.inputs) {
        ctrl.inputs[inputIndex] = value;
        calculate(state);
      }
    },
    toggleSubWpModCtrl: (state, action: ToggleSubWpModCtrlAction) => {
      const { weaponType, ctrlIndex } = action.payload;
      const ctrls = state.setupsById[state.activeId].subWpComplexBuffCtrls[weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        ctrls[ctrlIndex].activated = !ctrls[ctrlIndex].activated;
        calculate(state);
      }
    },
    refineSubWeapon: (state, action: RefineSubWeaponAction) => {
      const { weaponType, ctrlIndex, value } = action.payload;
      const ctrls = state.setupsById[state.activeId].subWpComplexBuffCtrls[weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        ctrls[ctrlIndex].refi = value;
        calculate(state);
      }
    },
    changeSubWpModCtrlInput: (state, action: ChangeSubWpModCtrlInputAction) => {
      const { weaponType, ctrlIndex, inputIndex, value } = action.payload;
      const ctrls = state.setupsById[state.activeId].subWpComplexBuffCtrls[weaponType];

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
      state.setupsById[state.activeId].customBuffCtrls.unshift(action.payload);
      calculate(state);
    },
    createCustomDebuffCtrl: (state, action: PayloadAction<CustomDebuffCtrl>) => {
      state.setupsById[state.activeId].customDebuffCtrls.unshift(action.payload);
      calculate(state);
    },
    clearCustomModCtrls: (state, action: PayloadAction<boolean>) => {
      const modCtrlName = action.payload ? "customBuffCtrls" : "customDebuffCtrls";

      state.setupsById[state.activeId][modCtrlName] = [];
      calculate(state);
    },
    copyCustomModCtrls: (state, action: CopyCustomModCtrlsAction) => {
      const { isBuffs, sourceID } = action.payload;
      const activeSetup = state.setupsById[state.activeId];
      const sourceSetup = state.setupsById[sourceID];

      if (isBuffs) {
        activeSetup.customBuffCtrls = sourceSetup.customBuffCtrls;
      } else {
        activeSetup.customDebuffCtrls = sourceSetup.customDebuffCtrls;
      }
      calculate(state);
    },
    removeCustomModCtrl: (state, action: RemoveCustomModCtrlAction) => {
      const { isBuffs, ctrlIndex } = action.payload;
      const modCtrlName = isBuffs ? "customBuffCtrls" : "customDebuffCtrls";

      state.setupsById[state.activeId][modCtrlName].splice(ctrlIndex, 1);
      calculate(state);
    },
    changeCustomModCtrlValue: (state, action: ChangeCustomModCtrlValueAction) => {
      const { isBuffs, ctrlIndex, value } = action.payload;
      const modCtrlName = isBuffs ? "customBuffCtrls" : "customDebuffCtrls";

      state.setupsById[state.activeId][modCtrlName][ctrlIndex].value = value;
      calculate(state);
    },
    // TARGET
    updateTarget: (state, action: PayloadAction<Partial<Target>>) => {
      state.target = {
        ...state.target,
        ...action.payload,
      };
      calculate(state);
    },
    updateMonster: (state, action: PayloadAction<Partial<Monster>>) => {
      state.monster = {
        ...state.monster,
        ...action.payload,
      };
      const { code, variantType } = state.monster;
      const monsterData = findByCode(monsters, code);

      // not update target if monster code === 0 (custom monster)
      if (monsterData && state.monster.code) {
        const { resistance, variant } = monsterData;
        const { base, ...otherResist } = resistance;

        for (const atkElmt of ATTACK_ELEMENTS) {
          state.target[atkElmt] = base;
        }
        for (const [key, value] of Object.entries(otherResist)) {
          state.target[key as AttackElement] = value;
        }

        if (variantType && variant) {
          state.target[variantType] += variant.change;
        }

        calculate(state, true);
      }
    },
    //
    duplicateCalcSetup: (state, action: PayloadAction<number>) => {
      const sourceId = action.payload;
      const { setupManageInfos, setupsById } = state;
      const ID = Date.now();

      if (setupsById[sourceId]) {
        setupManageInfos.push({
          ID,
          name: getNewSetupName(setupManageInfos),
          type: "original",
        });

        setupsById[ID] = setupsById[sourceId];
        calculate(state, true);
      }
    },
    applySettingsOnCalculator: (state, action: ApplySettingsOnCalculatorAction) => {
      const { newSetupManageInfos, newConfigs, removedSetupIDs } = action.payload;
      const { setupManageInfos, setupsById, charData, activeId } = state;

      let rootID = Date.now();
      const [selfBuffCtrls, selfDebuffCtrls] = initCharModCtrls(charData.name, true);
      const newWeapon = initWeapon({ type: charData.weapon });
      const wpBuffCtrls = getMainWpBuffCtrls(newWeapon);
      const subArtBuffCtrls = getAllSubArtBuffCtrls(null);
      const subArtDebuffCtrls = getAllSubArtDebuffCtrls();
      const elmtModCtrls = initElmtModCtrls();
      const tempoManageInfos: CalcSetupManageInfo[] = [];

      newSetupManageInfos.forEach(({ ID, name, type, status }) => {
        switch (status) {
          case "OLD": {
            const oldInfo = findById(setupManageInfos, ID);
            if (oldInfo) {
              tempoManageInfos.push({
                ...oldInfo,
                name: name,
              });
            }
            break;
          }
          case "DUPLICATE": {
            const oldInfo = findById(setupManageInfos, ID);
            if (oldInfo) {
              const setupID = rootID++;

              tempoManageInfos.push({
                ID: setupID,
                name,
                type: "original",
              });
              setupsById[setupID] = deepCopy(setupsById[ID]);
            }
            break;
          }
          case "NEW": {
            tempoManageInfos.push({
              ID,
              name,
              type: "original",
            });
            setupsById[ID] = {
              char: setupsById[activeId].char,
              selfBuffCtrls,
              selfDebuffCtrls,
              weapon: {
                ID: rootID++,
                ...newWeapon,
              },
              wpBuffCtrls,
              subWpComplexBuffCtrls: {},
              artInfo: {
                pieces: [null, null, null, null, null],
                sets: [],
              },
              artBuffCtrls: [],
              subArtBuffCtrls,
              subArtDebuffCtrls,
              party: [null, null, null],
              elmtModCtrls,
              customBuffCtrls: [],
              customDebuffCtrls: [],
            };
            break;
          }
        }
      });

      removedSetupIDs.forEach((ID) => {
        delete setupsById[ID];
      });

      const activeSetup = findById(newSetupManageInfos, activeId);
      const newActiveID = activeSetup ? activeSetup.ID : tempoManageInfos[0].ID;

      if (state.configs.separateCharInfo && !newConfigs.separateCharInfo) {
        const activeChar = setupsById[newActiveID].char;

        for (const setup of Object.values(setupsById)) {
          setup.char = activeChar;
        }
      }

      state.activeId = newActiveID;
      state.setupManageInfos = tempoManageInfos;
      state.configs = newConfigs;
      calculate(state, true);
    },
  },
});

export const {
  initSessionWithChar,
  initSessionWithSetup,
  changeActiveSetup,
  importSetup,
  closeError,
  updateCharacter,
  addTeammate,
  removeTeammate,
  copyParty,
  pickWeaponInUsersDatabase,
  changeWeapon,
  updateWeapon,
  updateArtPiece,
  updateArtPieceSubStat,
  changeArtPiece,
  updateAllArtPieces,
  copyAllArtifacts,
  toggleResonance,
  changeResonanceInput,
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
  updateTarget,
  updateMonster,
  duplicateCalcSetup,
  applySettingsOnCalculator,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
