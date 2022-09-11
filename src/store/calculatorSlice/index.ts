import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import type {
  CalcArtPiece,
  CalcArtPieceMainStat,
  CalcSetup,
  CalculatorState,
  CalcWeapon,
  CustomBuffCtrl,
  CustomDebuffCtrl,
  Level,
  ResonancePair,
  UsersSetup,
  Vision,
} from "@Src/types";
import { findArtifactSet, findCharacter, getCharData } from "@Data/controllers";
import type {
  AddTeammateAction,
  ApplySettingsOnCalculatorAction,
  ChangeArtPieceSubStatAction,
  ChangeCustomModCtrlValueAction,
  ChangeElementModCtrlAction,
  ChangeModCtrlInputAction,
  ChangeMonsterConfigAction,
  ChangeSubWpModCtrlInputAction,
  ChangeTeammateModCtrlInputAction,
  CopyCustomModCtrlsAction,
  ImportSetupAction,
  InitSessionWithCharAction,
  ModifyTargetAction,
  RefineSubWeaponAction,
  RemoveCustomModCtrlAction,
  ToggleModCtrlAction,
  ToggleSubWpModCtrlAction,
  ToggleTeammateModCtrlAction,
  UpdateArtPieceAction,
} from "./reducer-types";
import {
  initCharInfo,
  initWeapon,
  initCharModCtrls,
  initElmtModCtrls,
  initMonster,
  initTarget,
} from "./initiators";
import {
  autoModifyTarget,
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
import monsters from "@Data/monsters";
import { MonsterConfig } from "@Data/monsters/types";
import { bareLv, countVision, countWeapon, indexByCode } from "@Src/utils";
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
  charData: getCharData(defaultChar),
  setupManageInfos: [],
  setups: [],
  target: initTarget(),
  monster: initMonster(),
  allTotalAttrs: [],
  allartAttr: [],
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

      state.currentIndex = 0;
      state.configs.separateCharInfo = false;
      state.touched = true;

      state.charData = getCharData(result.char);
      state.setupManageInfos = [getSetupManageInfo({})];
      state.setups = [
        {
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
      ];
      state.monster = initMonster();

      calculate(state, true);
    },
    initSessionWithSetup: (state, action: PayloadAction<UsersSetup>) => {
      const { ID, type, target, ...setupInfo } = action.payload;

      state.charData = getCharData(setupInfo.char);
      state.setupManageInfos = [getSetupManageInfo({ ID, type })];
      state.setups = [setupInfo];
      state.target = target;
      state.monster = initMonster();

      state.configs.separateCharInfo = false;
      state.currentIndex = 0;

      calculate(state);
    },
    changeCurrentSetup: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    importSetup: (state, action: ImportSetupAction) => {
      const { data, shouldOverwriteChar, shouldOverwriteTarget } = action.payload;
      const { ID, type, name, target, ...importedsetup } = data;
      const { setupManageInfos, setups } = state;
      const { separateCharInfo } = state.configs;

      if (shouldOverwriteChar && separateCharInfo) {
        for (const setup of setups) {
          setup.char = importedsetup.char;
        }
      }
      if (shouldOverwriteTarget) {
        state.target = target;
      }

      state.setupManageInfos.push(
        getSetupManageInfo({ name: getNewSetupName(setupManageInfos), ID, type })
      );
      state.setups.push(importedsetup);

      state.currentIndex = state.setups.length - 1;
      calculate(state, shouldOverwriteChar || shouldOverwriteTarget);
    },
    closeError: (state) => {
      state.isError = false;
    },
    // CHARACTER
    levelCalcChar: (state, action: PayloadAction<Level>) => {
      const level = action.payload;
      const { currentIndex, configs } = state;

      if (state.target.level === 1) {
        state.target.level = bareLv(level);
      }
      if (configs.separateCharInfo) {
        state.setups[currentIndex].char.level = level;
      } else {
        for (const setup of state.setups) {
          setup.char.level = level;
        }
      }
      calculate(state, configs.separateCharInfo);
    },
    changeConsLevel: (state, action: PayloadAction<number>) => {
      const newCons = action.payload;
      const { configs, setups } = state;

      if (configs.separateCharInfo) {
        setups[state.currentIndex].char.cons = newCons;
      } else {
        for (const setup of setups) {
          setup.char.cons = newCons;
        }
      }
      calculate(state, configs.separateCharInfo);
    },
    changeTalentLevel: (
      state,
      action: PayloadAction<{ type: "NAs" | "ES" | "EB"; level: number }>
    ) => {
      const { type, level } = action.payload;
      const { configs, setups } = state;

      if (configs.separateCharInfo) {
        setups[state.currentIndex].char[type] = level;
      } else {
        for (const setup of setups) {
          setup.char[type] = level;
        }
      }
      calculate(state, configs.separateCharInfo);
    },
    // PARTY
    addTeammate: (state, action: AddTeammateAction) => {
      const { name, vision, weapon: weaponType, tmIndex } = action.payload;
      const setup = state.setups[state.currentIndex];
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
      const setup = state.setups[state.currentIndex];
      const { char, party, elmtModCtrls, subWpComplexBuffCtrls } = setup;
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
      const sourceIndex = action.payload;
      const { currentIndex, setups } = state;

      setups[currentIndex].party = setups[sourceIndex].party;
      setups[currentIndex].elmtModCtrls = setups[sourceIndex].elmtModCtrls;
      setups[currentIndex].subWpComplexBuffCtrls = setups[sourceIndex].subWpComplexBuffCtrls;

      calculate(state);
    },
    // WEAPON
    pickWeaponInUserDatabase: (state, action: PayloadAction<CalcWeapon>) => {
      const wpInfo = action.payload;
      const setup = state.setups[state.currentIndex];
      setup.weapon = wpInfo;
      setup.wpBuffCtrls = getMainWpBuffCtrls(wpInfo);

      calculate(state);
    },
    changeWeapon: (state, action: PayloadAction<CalcWeapon>) => {
      const setup = state.setups[state.currentIndex];
      const weapon = action.payload;
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
    upgradeWeapon: (state, action: PayloadAction<Level>) => {
      state.setups[state.currentIndex].weapon.level = action.payload;
      calculate(state);
    },
    refineWeapon: (state, action: PayloadAction<number>) => {
      state.setups[state.currentIndex].weapon.refi = action.payload;
      calculate(state);
    },
    // ARTIFACTS
    enhanceArtPiece: (state, action: PayloadAction<{ pieceIndex: number; level: number }>) => {
      const { pieceIndex, level } = action.payload;
      const pieceInfo = state.setups[state.currentIndex].artInfo.pieces[pieceIndex];

      if (pieceInfo) {
        pieceInfo.level = level;
      }
      calculate(state);
    },
    changeArtPieceMainStatType: (
      state,
      action: PayloadAction<{ pieceIndex: number; type: CalcArtPieceMainStat }>
    ) => {
      const { pieceIndex, type } = action.payload;
      const pieceInfo = state.setups[state.currentIndex].artInfo.pieces[pieceIndex];

      if (pieceInfo) {
        pieceInfo.mainStatType = type;
      }
      calculate(state);
    },
    changeArtPieceSubStat: (state, action: ChangeArtPieceSubStatAction) => {
      const { pieceIndex, subStatIndex, ...changeInfo } = action.payload;
      const pieceInfo = state.setups[state.currentIndex].artInfo.pieces[pieceIndex];

      if (pieceInfo) {
        pieceInfo.subStats[subStatIndex] = {
          ...pieceInfo.subStats[subStatIndex],
          ...changeInfo,
        };
        calculate(state);
      }
    },
    updateArtPiece: (state, action: UpdateArtPieceAction) => {
      const { pieceIndex, newPiece, isFresh } = action.payload;
      const setup = state.setups[state.currentIndex];
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
      const setup = state.setups[state.currentIndex];

      if (bonusLv) {
        setup.subArtBuffCtrls = setup.subArtBuffCtrls.filter((ctrl) => ctrl.code !== sets[0].code);
      }
      setup.artInfo = { pieces, sets };
      setup.artBuffCtrls = bonusLv ? getMainArtBuffCtrls(sets[0].code) : [];

      calculate(state);
    },
    copyAllArtifacts: (state, action: PayloadAction<number>) => {
      const { setups, currentIndex } = state;

      setups[currentIndex].artInfo = setups[action.payload].artInfo;
      setups[currentIndex].artBuffCtrls = setups[action.payload].artBuffCtrls;
      setups[currentIndex].subArtBuffCtrls = setups[action.payload].subArtBuffCtrls;
      setups[currentIndex].subArtDebuffCtrls = setups[action.payload].subArtDebuffCtrls;

      calculate(state);
    },
    // MOD CTRLS
    toggleResonance: (state, action: PayloadAction<Vision>) => {
      const rsn = state.setups[state.currentIndex].elmtModCtrls.resonance.find(({ vision }) => {
        return vision === action.payload;
      });

      if (rsn) {
        rsn.activated = !rsn.activated;
        calculate(state);
      }
    },
    changeResonanceInput: (state, action: PayloadAction<number>) => {
      // for now only dendro has inputs
      const rsn = state.setups[state.currentIndex].elmtModCtrls.resonance.find(({ vision }) => {
        return vision === "dendro";
      });

      if (rsn && rsn.inputs) {
        rsn.inputs[action.payload] = !rsn.inputs[action.payload];
        calculate(state);
      }
    },
    toggleElementModCtrl: (
      state,
      action: PayloadAction<"superconduct" | "aggravate" | "spread">
    ) => {
      const key = action.payload;
      const { elmtModCtrls } = state.setups[state.currentIndex];

      elmtModCtrls[key] = !elmtModCtrls[key];
      calculate(state);
    },
    changeElementModCtrl: (state, action: ChangeElementModCtrlAction) => {
      const { field, value } = action.payload;

      state.setups[state.currentIndex].elmtModCtrls[field] = value;
      calculate(state);
    },
    toggleModCtrl: (state, action: ToggleModCtrlAction) => {
      const { modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state.setups[state.currentIndex][modCtrlName][ctrlIndex];

      ctrl.activated = !ctrl.activated;
      calculate(state);
    },
    changeModCtrlInput: (state, action: ChangeModCtrlInputAction) => {
      const { modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const { inputs } = state.setups[state.currentIndex][modCtrlName][ctrlIndex];

      if (inputs) {
        inputs[inputIndex] = value;
        calculate(state);
      }
    },
    toggleTeammateModCtrl: (state, action: ToggleTeammateModCtrlAction) => {
      const { teammateIndex, modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state.setups[state.currentIndex].party[teammateIndex]?.[modCtrlName][ctrlIndex];

      if (ctrl) {
        ctrl.activated = !ctrl.activated;
        calculate(state);
      }
    },
    changeTeammateModCtrlInput: (state, action: ChangeTeammateModCtrlInputAction) => {
      const { teammateIndex, modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const ctrl = state.setups[state.currentIndex].party[teammateIndex]?.[modCtrlName][ctrlIndex];

      if (ctrl && ctrl.inputs) {
        ctrl.inputs[inputIndex] = value;
        calculate(state);
      }
    },
    toggleSubWpModCtrl: (state, action: ToggleSubWpModCtrlAction) => {
      const { weaponType, ctrlIndex } = action.payload;
      const ctrls = state.setups[state.currentIndex].subWpComplexBuffCtrls[weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        ctrls[ctrlIndex].activated = !ctrls[ctrlIndex].activated;
        calculate(state);
      }
    },
    refineSubWeapon: (state, action: RefineSubWeaponAction) => {
      const { weaponType, ctrlIndex, value } = action.payload;
      const ctrls = state.setups[state.currentIndex].subWpComplexBuffCtrls[weaponType];

      if (ctrls && ctrls[ctrlIndex]) {
        ctrls[ctrlIndex].refi = value;
        calculate(state);
      }
    },
    changeSubWpModCtrlInput: (state, action: ChangeSubWpModCtrlInputAction) => {
      const { weaponType, ctrlIndex, inputIndex, value } = action.payload;
      const ctrls = state.setups[state.currentIndex].subWpComplexBuffCtrls[weaponType];

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
      state.setups[state.currentIndex].customBuffCtrls.unshift(action.payload);
      calculate(state);
    },
    createCustomDebuffCtrl: (state, action: PayloadAction<CustomDebuffCtrl>) => {
      state.setups[state.currentIndex].customDebuffCtrls.unshift(action.payload);
      calculate(state);
    },
    clearCustomModCtrls: (state, action: PayloadAction<boolean>) => {
      const modCtrlName = action.payload ? "customBuffCtrls" : "customDebuffCtrls";

      state.setups[state.currentIndex][modCtrlName] = [];
      calculate(state);
    },
    copyCustomModCtrls: (state, action: CopyCustomModCtrlsAction) => {
      const { isBuffs, sourceIndex } = action.payload;
      const { setups, currentIndex } = state;

      if (isBuffs) {
        setups[currentIndex].customBuffCtrls = setups[sourceIndex].customBuffCtrls;
      } else {
        setups[currentIndex].customDebuffCtrls = setups[sourceIndex].customDebuffCtrls;
      }

      calculate(state);
    },
    removeCustomModCtrl: (state, action: RemoveCustomModCtrlAction) => {
      const { isBuffs, ctrlIndex } = action.payload;
      const modCtrlName = isBuffs ? "customBuffCtrls" : "customDebuffCtrls";

      state.setups[state.currentIndex][modCtrlName].splice(ctrlIndex, 1);
      calculate(state);
    },
    changeCustomModCtrlValue: (state, action: ChangeCustomModCtrlValueAction) => {
      const { isBuffs, ctrlIndex, value } = action.payload;
      const modCtrlName = isBuffs ? "customBuffCtrls" : "customDebuffCtrls";

      state.setups[state.currentIndex][modCtrlName][ctrlIndex].value = value;
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
    //
    applySettingsOnCalculator: (state, action: ApplySettingsOnCalculatorAction) => {
      const { setupManageInfos, tempoConfigs, standardIndex, currentIndex } = action.payload;
      const { charData, setups } = state;

      let ID = Date.now();
      const [selfBuffCtrls, selfDebuffCtrls] = initCharModCtrls(charData.name, true);
      const newWeapon = initWeapon({ type: charData.weapon });
      const wpBuffCtrls = getMainWpBuffCtrls(newWeapon);
      const subArtBuffCtrls = getAllSubArtBuffCtrls(null);
      const subArtDebuffCtrls = getAllSubArtDebuffCtrls();
      const elmtModCtrls = initElmtModCtrls();
      const newSetups: CalcSetup[] = [];

      action.payload.indexes.forEach((index, i) => {
        if (index === null) {
          newSetups[i] = {
            char: setups[standardIndex].char,
            selfBuffCtrls,
            selfDebuffCtrls,
            weapon: {
              ID: ++ID,
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
        } else {
          const char =
            state.configs.separateCharInfo && !tempoConfigs.separateCharInfo
              ? setups[standardIndex].char
              : setups[index].char;

          newSetups[i] = {
            ...setups[index],
            char,
          };
        }
      });

      state.currentIndex = currentIndex > -1 ? currentIndex : standardIndex;
      state.configs = tempoConfigs;
      state.setupManageInfos = setupManageInfos;
      state.setups = newSetups;

      calculate(state, true);
    },
  },
});

export const {
  initSessionWithChar,
  initSessionWithSetup,
  changeCurrentSetup,
  importSetup,
  closeError,
  levelCalcChar,
  changeConsLevel,
  changeTalentLevel,
  addTeammate,
  removeTeammate,
  copyParty,
  pickWeaponInUserDatabase,
  changeWeapon,
  upgradeWeapon,
  refineWeapon,
  enhanceArtPiece,
  changeArtPieceMainStatType,
  changeArtPieceSubStat,
  updateArtPiece,
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
  modifyTarget,
  changeMonster,
  changeMonsterConfig,
  applySettingsOnCalculator,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
