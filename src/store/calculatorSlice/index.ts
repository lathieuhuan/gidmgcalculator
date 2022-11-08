import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import type {
  AttackElement,
  CalcArtPiece,
  CalcSetupManageInfo,
  CalcWeapon,
  CharInfo,
  Monster,
  PartiallyOptional,
  Resonance,
  Target,
  UsersSetup,
} from "@Src/types";
import type { CalculatorState } from "./types";
import type {
  AddTeammateAction,
  ApplySettingsAction,
  ChangeArtPieceAction,
  ChangeModCtrlInputAction,
  ChangeTeammateModCtrlInputAction,
  ImportSetupAction,
  InitSessionWithCharAction,
  RemoveCustomModCtrlAction,
  ToggleModCtrlAction,
  ToggleTeammateModCtrlAction,
  UpdateArtPieceAction,
  UpdateCalculatorAction,
  UpdateCalcSetupAction,
  UpdateCustomBuffCtrlsAction,
  UpdateCustomDebuffCtrlsAction,
  TUpdateTeammateWeaponAction,
  TUpdateTeammateArtifactAction,
} from "./reducer-types";

import { findCharacter, getCharData } from "@Data/controllers";

import { ATTACK_ELEMENTS, RESONANCE_VISION_TYPES } from "@Src/constants";
import { bareLv, countVision, deepCopy, findByCode, findById, turnArray } from "@Src/utils";
import {
  calculate,
  getArtDebuffCtrls,
  getArtifactSets,
  getMainArtBuffCtrls,
  getNewSetupName,
  getSetupManageInfo,
  getTeammateArtifactBuffCtrls,
  getWeaponBuffCtrls,
  parseAndInitData,
} from "./utils";
import {
  initCharInfo,
  initWeapon,
  initCharModCtrls,
  initElmtModCtrls,
  initMonster,
  initTarget,
  initTeammate,
} from "./initiators";
import monsters from "@Data/monsters";

const defaultChar = {
  name: "Albedo",
  ...initCharInfo({}),
};

const initialState: CalculatorState = {
  activeId: 0,
  standardId: 0,
  comparedIds: [],
  configs: {
    separateCharInfo: false,
    keepArtStatsOnSwitch: false,
  },
  charData: getCharData(defaultChar),
  setupManageInfos: [],
  setupsById: {},
  statsById: {},
  target: initTarget(),
  monster: initMonster(),
  isError: false,
};

export const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    updateCalculator: (state, action: UpdateCalculatorAction) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    initSessionWithChar: (state, action: InitSessionWithCharAction) => {
      const { pickedChar, myWps, myArts } = action.payload;
      const result = parseAndInitData(pickedChar, myWps, myArts);
      const [selfBuffCtrls, selfDebuffCtrls] = initCharModCtrls(result.char.name, true);
      const setupManageInfo = getSetupManageInfo({});
      const { ID } = setupManageInfo;

      state.activeId = ID;
      state.comparedIds = [];
      state.standardId = 0;
      state.configs.separateCharInfo = false;

      state.charData = getCharData(result.char);
      state.setupManageInfos = [setupManageInfo];
      state.setupsById = {
        [ID]: {
          char: result.char,
          selfBuffCtrls: selfBuffCtrls,
          selfDebuffCtrls: selfDebuffCtrls,
          weapon: result.weapon,
          wpBuffCtrls: result.wpBuffCtrls,
          artInfo: result.artInfo,
          artBuffCtrls: result.artBuffCtrls,
          artDebuffCtrls: getArtDebuffCtrls(),
          party: [null, null, null],
          elmtModCtrls: initElmtModCtrls(),
          customBuffCtrls: [],
          customDebuffCtrls: [],
        },
      };
      // calculate will repopulate statsById
      state.statsById = {};
      state.monster = initMonster();

      calculate(state);
    },
    initSessionWithSetup: (state, action: PayloadAction<UsersSetup>) => {
      const { ID, type, target, ...setupInfo } = action.payload;

      state.charData = getCharData(setupInfo.char);
      state.setupManageInfos = [getSetupManageInfo({ ID, type })];
      state.setupsById = {
        [ID]: setupInfo,
      };
      // calculate will repopulate statsById
      state.statsById = {};
      state.target = target;
      state.monster = initMonster();
      state.configs.separateCharInfo = false;
      state.activeId = ID;
      // #to-do: add to compare when comparing setups of the same character
      state.standardId = 0;
      state.comparedIds = [];

      calculate(state);
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
    updateCalcSetup: (state, action: UpdateCalcSetupAction) => {
      const { setupId = state.activeId, ...newInfo } = action.payload;

      state.setupsById[setupId] = {
        ...state.setupsById[setupId],
        ...newInfo,
      };

      calculate(state, setupId !== state.activeId);
    },
    duplicateCalcSetup: (state, action: PayloadAction<number>) => {
      const sourceId = action.payload;
      const { comparedIds, setupManageInfos, setupsById } = state;
      const ID = Date.now();

      if (setupsById[sourceId]) {
        setupManageInfos.push({
          ID,
          name: getNewSetupName(setupManageInfos),
          type: "original",
        });

        setupsById[ID] = setupsById[sourceId];

        if (comparedIds.includes(sourceId)) {
          state.comparedIds.push(ID);
        }

        calculate(state, true);
      }
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
      const { name, vision, weapon: weaponType, teammateIndex } = action.payload;
      const setup = state.setupsById[state.activeId];
      const { char, party, elmtModCtrls } = setup;

      const oldVisionCount = countVision(char, party);
      const oldTeammate = party[teammateIndex];

      // assign to party
      party[teammateIndex] = initTeammate({ name, weapon: weaponType });

      const newVisionCount = countVision(char, party);
      // cannot use RESONANCE_VISION_TYPES.includes(oldVision/vision) - ts error
      const resonanceVisionTypes = RESONANCE_VISION_TYPES.map((r) => r.toString());

      if (oldTeammate) {
        const { vision: oldVision } = findCharacter(oldTeammate) || {};

        // lose a resonance
        if (
          oldVision &&
          resonanceVisionTypes.includes(oldVision) &&
          oldVisionCount[oldVision] === 2 &&
          newVisionCount[oldVision] === 1
        ) {
          elmtModCtrls.resonances = elmtModCtrls.resonances.filter((resonance) => {
            return resonance.vision !== oldVision;
          });
        }
      }
      // new teammate form new resonance
      if (
        resonanceVisionTypes.includes(vision) &&
        oldVisionCount[vision] === 1 &&
        newVisionCount[vision] === 2
      ) {
        const newResonance = {
          vision,
          activated: ["pyro", "hydro", "dendro"].includes(vision),
        } as Resonance;

        if (vision === "dendro") {
          newResonance.inputs = [0, 0];
        }
        elmtModCtrls.resonances.push(newResonance);
      }

      calculate(state);
    },
    removeTeammate: (state, action: PayloadAction<number>) => {
      const teammateIndex = action.payload;
      const { char, party, elmtModCtrls } = state.setupsById[state.activeId];
      const teammate = party[teammateIndex];

      if (teammate) {
        const { vision } = findCharacter(teammate)!;
        party[teammateIndex] = null;
        const newVisionCount = countVision(char, party);

        if (newVisionCount[vision] === 1) {
          elmtModCtrls.resonances = elmtModCtrls.resonances.filter((resonance) => {
            return resonance.vision !== vision;
          });

          calculate(state);
        }
      }
    },
    updateTeammateWeapon: (state, action: TUpdateTeammateWeaponAction) => {
      const { teammateIndex, ...newWeaponInfo } = action.payload;
      const teammate = state.setupsById[state.activeId].party[teammateIndex];

      if (teammate) {
        teammate.weapon = {
          ...teammate.weapon,
          ...newWeaponInfo,
        };
        if (newWeaponInfo.code) {
          teammate.weapon.buffCtrls = getWeaponBuffCtrls(false, teammate.weapon);
        }
        calculate(state);
      }
    },
    updateTeammateArtifact: (state, action: TUpdateTeammateArtifactAction) => {
      const { teammateIndex, ...newArtifactInfo } = action.payload;
      const teammate = state.setupsById[state.activeId].party[teammateIndex];

      if (teammate) {
        teammate.artifact = {
          ...teammate.artifact,
          ...newArtifactInfo,
        };
        if (newArtifactInfo.code) {
          teammate.artifact.buffCtrls = getTeammateArtifactBuffCtrls(teammate.artifact);
        }
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
    // WEAPON
    changeWeapon: (state, action: PayloadAction<CalcWeapon>) => {
      const weapon = action.payload;
      const setup = state.setupsById[state.activeId];
      setup.weapon = weapon;
      setup.wpBuffCtrls = getWeaponBuffCtrls(true, weapon);

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
    changeArtPiece: (state, action: ChangeArtPieceAction) => {
      const { pieceIndex, newPiece, isFresh } = action.payload;
      const setup = state.setupsById[state.activeId];
      const { artInfo } = setup;

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
        } //
        else if (oldBonusLevel && !newSetBonus.bonusLv) {
          setup.artBuffCtrls = [];
        }
      }
      calculate(state);
    },
    updateArtPiece: (state, action: UpdateArtPieceAction) => {
      const { pieceIndex, level, mainStatType, subStat } = action.payload;
      const piece = state.setupsById[state.activeId].artInfo.pieces[pieceIndex];

      if (piece) {
        if (level !== undefined) {
          piece.level = level;
        }
        if (mainStatType) {
          piece.mainStatType = mainStatType;
        }
        if (subStat) {
          const { index, newInfo } = subStat;
          piece.subStats[index] = {
            ...piece.subStats[index],
            ...newInfo,
          };
        }
      }
      calculate(state);
    },
    updateAllArtPieces: (state, action: PayloadAction<(CalcArtPiece | null)[]>) => {
      const pieces = action.payload;
      const sets = getArtifactSets(pieces);
      const bonusLv = sets[0]?.bonusLv;
      const setup = state.setupsById[state.activeId];

      setup.artInfo = { pieces, sets };
      setup.artBuffCtrls = bonusLv ? getMainArtBuffCtrls(sets[0].code) : [];

      calculate(state);
    },
    // MOD CTRLS
    updateResonance: (state, action: PayloadAction<PartiallyOptional<Resonance, "activated">>) => {
      const { vision, ...newInfo } = action.payload;
      const { resonances } = state.setupsById[state.activeId].elmtModCtrls;
      const targetIndex = resonances.findIndex((resonance) => resonance.vision === vision);

      if (targetIndex >= 0) {
        resonances[targetIndex] = {
          ...resonances[targetIndex],
          ...newInfo,
        };

        calculate(state);
      }
    },
    toggleModCtrl: (state, action: ToggleModCtrlAction) => {
      const { modCtrlName, ctrlIndex } = action.payload;
      const ctrl = state.setupsById[state.activeId][modCtrlName][ctrlIndex];

      if (ctrl) {
        ctrl.activated = !ctrl.activated;
        calculate(state);
      }
    },
    changeModCtrlInput: (state, action: ChangeModCtrlInputAction) => {
      const { modCtrlName, ctrlIndex, inputIndex, value } = action.payload;
      const { inputs } = state.setupsById[state.activeId][modCtrlName][ctrlIndex];

      if (inputs) {
        inputs[inputIndex] = value;
        calculate(state);
      }
    },
    // CUSTOM MOD CTRLS
    updateCustomBuffCtrls: (state, action: UpdateCustomBuffCtrlsAction) => {
      const { actionType, ctrls } = action.payload;
      const activeSetup = state.setupsById[state.activeId];

      switch (actionType) {
        case "add":
          activeSetup.customBuffCtrls.unshift(...turnArray(ctrls));
          break;
        case "edit":
          for (const { index, ...newInfo } of turnArray(ctrls)) {
            activeSetup.customBuffCtrls[index] = {
              ...activeSetup.customBuffCtrls[index],
              ...newInfo,
            };
          }
          break;
        case "replace":
          activeSetup.customBuffCtrls = turnArray(ctrls);
          break;
      }

      calculate(state);
    },
    updateCustomDebuffCtrls: (state, action: UpdateCustomDebuffCtrlsAction) => {
      const { actionType, ctrls } = action.payload;
      const activeSetup = state.setupsById[state.activeId];

      switch (actionType) {
        case "add":
          activeSetup.customDebuffCtrls.unshift(...turnArray(ctrls));
          break;
        case "edit":
          for (const { index, ...newInfo } of turnArray(ctrls)) {
            activeSetup.customDebuffCtrls[index] = {
              ...activeSetup.customDebuffCtrls[index],
              ...newInfo,
            };
          }
          break;
        case "replace":
          activeSetup.customDebuffCtrls = turnArray(ctrls);
          break;
      }

      calculate(state);
    },
    removeCustomModCtrl: (state, action: RemoveCustomModCtrlAction) => {
      const { isBuffs, ctrlIndex } = action.payload;
      const modCtrlName = isBuffs ? "customBuffCtrls" : "customDebuffCtrls";

      state.setupsById[state.activeId][modCtrlName].splice(ctrlIndex, 1);
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
    applySettings: (state, action: ApplySettingsAction) => {
      const { newSetupManageInfos, newConfigs, newStandardId } = action.payload;
      const { setupManageInfos, setupsById, charData, activeId } = state;
      const removedIds = [];
      // Reset comparedIds before repopulate with newSetupManageInfos
      state.comparedIds = [];

      const [selfBuffCtrls, selfDebuffCtrls] = initCharModCtrls(charData.name, true);
      const newWeapon = initWeapon({ type: charData.weapon });
      const wpBuffCtrls = getWeaponBuffCtrls(true, newWeapon);
      const elmtModCtrls = initElmtModCtrls();
      const tempManageInfos: CalcSetupManageInfo[] = [];

      for (const { ID, name, type, status, originId, isCompared } of newSetupManageInfos) {
        isCompared && state.comparedIds.push(ID);

        switch (status) {
          case "REMOVED": {
            // Delete later coz they can be used for ref of duplicate setups
            removedIds.push(ID);
            break;
          }
          case "OLD": {
            const oldInfo = findById(setupManageInfos, ID);
            if (oldInfo) {
              tempManageInfos.push({
                ...oldInfo,
                name: name,
              });
            }
            break;
          }
          case "DUPLICATE": {
            if (originId && setupsById[originId]) {
              tempManageInfos.push({
                ID,
                name,
                type: "original",
              });
              setupsById[ID] = deepCopy(setupsById[originId]);
            }
            break;
          }
          case "NEW": {
            tempManageInfos.push({
              ID,
              name,
              type: "original",
            });
            setupsById[ID] = {
              char: setupsById[activeId].char,
              selfBuffCtrls,
              selfDebuffCtrls,
              weapon: {
                ID: Date.now(),
                ...newWeapon,
              },
              wpBuffCtrls,
              artInfo: {
                pieces: [null, null, null, null, null],
                sets: [],
              },
              artBuffCtrls: [],
              artDebuffCtrls: getArtDebuffCtrls(),
              party: [null, null, null],
              elmtModCtrls,
              customBuffCtrls: [],
              customDebuffCtrls: [],
            };
            break;
          }
        }
      }

      for (const ID of removedIds) {
        delete setupsById[ID];
        delete state.statsById[ID];
      }

      const activeSetup = findById(tempManageInfos, activeId);
      const newActiveId = activeSetup ? activeSetup.ID : tempManageInfos[0].ID;

      if (state.configs.separateCharInfo && !newConfigs.separateCharInfo) {
        const activeChar = setupsById[newActiveId].char;

        for (const setup of Object.values(setupsById)) {
          setup.char = activeChar;
        }
      }

      state.activeId = newActiveId;
      state.comparedIds = state.comparedIds.length === 1 ? [] : state.comparedIds;
      state.standardId = state.comparedIds.length ? newStandardId : 0;
      state.setupManageInfos = tempManageInfos;
      state.configs = newConfigs;
      calculate(state, true);
    },
  },
});

export const {
  updateCalculator,
  initSessionWithChar,
  initSessionWithSetup,
  importSetup,
  updateCalcSetup,
  updateCharacter,
  addTeammate,
  removeTeammate,
  updateTeammateWeapon,
  updateTeammateArtifact,
  changeWeapon,
  updateWeapon,
  updateArtPiece,
  changeArtPiece,
  updateAllArtPieces,
  updateResonance,
  toggleModCtrl,
  changeModCtrlInput,
  toggleTeammateModCtrl,
  changeTeammateModCtrlInput,
  updateCustomBuffCtrls,
  updateCustomDebuffCtrls,
  removeCustomModCtrl,
  updateTarget,
  updateMonster,
  duplicateCalcSetup,
  applySettings,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
