import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import type {
  AppMessage,
  AttackElement,
  CalcArtifact,
  CalcSetupManageInfo,
  CalcWeapon,
  CharInfo,
  PartiallyOptional,
  Resonance,
  Target,
} from "@Src/types";
import type { CalculatorState } from "./types";
import type {
  AddTeammateAction,
  UpdateSetupsAction,
  ChangeArtifactAction,
  ChangeModCtrlInputAction,
  ChangeTeammateModCtrlInputAction,
  ImportSetupAction,
  InitSessionWithCharAction,
  RemoveCustomModCtrlAction,
  ToggleModCtrlAction,
  ToggleTeammateModCtrlAction,
  UpdateArtifactAction,
  UpdateCalculatorAction,
  UpdateCalcSetupAction,
  UpdateCustomBuffCtrlsAction,
  UpdateCustomDebuffCtrlsAction,
  UpdateTeammateWeaponAction,
  UpdateTeammateArtifactAction,
  InitSessionWithSetupAction,
  ApplySettingsAction,
} from "./reducer-types";
import { ATTACK_ELEMENTS, RESONANCE_VISION_TYPES } from "@Src/constants";
import monsters from "@Data/monsters";

import { findDataCharacter, getCharData, getPartyData } from "@Data/controllers";
import { bareLv, deepCopy, findById, turnArray, countVision, findByCode, getCopyName, appSettings } from "@Src/utils";
import { getArtifactSetBonuses } from "@Src/utils/calculation";
import { getSetupManageInfo } from "@Src/utils/setup";
import {
  createArtDebuffCtrls,
  createArtifactBuffCtrls,
  createCharInfo,
  createCharModCtrls,
  createElmtModCtrls,
  createTarget,
  createTeammate,
  createWeapon,
  createWeaponBuffCtrls,
} from "@Src/utils/creators";
import { calculate, parseUserCharData } from "./utils";

const defaultChar = {
  name: "Albedo",
  ...createCharInfo(),
};

const initialState: CalculatorState = {
  activeId: 0,
  standardId: 0,
  comparedIds: [],
  charData: getCharData(defaultChar),
  setupManageInfos: [],
  setupsById: {},
  statsById: {},
  target: createTarget(),
  message: {
    active: false,
  },
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
    updateMessage: (state, action: PayloadAction<NonNullable<Pick<AppMessage, "type" | "content">> | null>) => {
      state.message = action.payload
        ? {
            ...action.payload,
            active: true,
          }
        : { active: false };
    },
    initSessionWithChar: (state, action: InitSessionWithCharAction) => {
      const { pickedChar, userWps, userArts } = action.payload;
      const setupManageInfo = getSetupManageInfo({});
      const { ID: setupID } = setupManageInfo;
      const charData = getCharData(pickedChar);
      const data = parseUserCharData({
        pickedChar,
        userWps,
        userArts,
        weaponType: charData.weaponType,
        seedID: setupID + 1,
      });
      const [selfBuffCtrls, selfDebuffCtrls] = createCharModCtrls(true, data.char.name);

      state.activeId = setupID;
      state.comparedIds = [];
      state.standardId = 0;
      appSettings.set({ charInfoIsSeparated: false });

      state.charData = charData;
      state.setupManageInfos = [setupManageInfo];
      state.setupsById = {
        [setupID]: {
          char: data.char,
          selfBuffCtrls: selfBuffCtrls,
          selfDebuffCtrls: selfDebuffCtrls,
          weapon: data.weapon,
          wpBuffCtrls: data.wpBuffCtrls,
          artifacts: data.artifacts,
          artBuffCtrls: data.artBuffCtrls,
          artDebuffCtrls: createArtDebuffCtrls(),
          party: [null, null, null],
          elmtModCtrls: createElmtModCtrls(),
          customBuffCtrls: [],
          customDebuffCtrls: [],
          customInfusion: { element: "phys" },
        },
      };
      // calculate will repopulate statsById
      state.statsById = {};

      calculate(state);
    },
    initSessionWithSetup: (state, action: InitSessionWithSetupAction) => {
      const { ID = Date.now(), name, type, calcSetup, target } = action.payload;

      state.charData = getCharData(calcSetup.char);
      state.setupManageInfos = [getSetupManageInfo({ ID, name, type })];
      state.setupsById = {
        [ID]: calcSetup,
      };
      // calculate will repopulate statsById
      state.statsById = {};
      state.target = target;
      state.activeId = ID;
      state.standardId = 0;
      state.comparedIds = [];
      appSettings.set({ charInfoIsSeparated: false });

      calculate(state);
    },
    importSetup: (state, action: ImportSetupAction) => {
      const { importInfo, shouldOverwriteChar, shouldOverwriteTarget } = action.payload;
      const { ID = Date.now(), type, name = "New setup", target, calcSetup } = importInfo;
      const { setupsById } = state;

      if (shouldOverwriteChar && appSettings.get().charInfoIsSeparated) {
        for (const setup of Object.values(setupsById)) {
          setup.char = calcSetup.char;
        }
      }
      if (shouldOverwriteTarget) {
        state.target = target;
      }

      state.setupManageInfos.push(getSetupManageInfo({ name, ID, type }));
      state.setupsById[ID] = calcSetup;
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

      if (setupsById[sourceId]) {
        const setupID = Date.now();
        let setupName = findById(setupManageInfos, sourceId)?.name;

        if (setupName) {
          setupName = getCopyName(
            setupName,
            setupManageInfos.map(({ name }) => name)
          );
        }

        setupManageInfos.push({
          ID: setupID,
          name: setupName || "New Setup",
          type: "original",
        });
        setupsById[setupID] = setupsById[sourceId];

        if (comparedIds.includes(sourceId)) {
          state.comparedIds.push(setupID);
        }
        calculate(state, true);
      }
    },
    removeCalcSetup: (state, action: PayloadAction<number>) => {
      const setupId = action.payload;

      if (state.setupManageInfos.length > 1) {
        //
        state.setupManageInfos = state.setupManageInfos.filter((info) => info.ID !== setupId);
        delete state.setupsById[setupId];

        if (setupId === state.activeId) {
          state.activeId = state.setupManageInfos[0].ID;
        }

        state.comparedIds = state.comparedIds.filter((ID) => ID !== setupId);

        if (state.comparedIds.length === 1) {
          state.comparedIds = [];
        }
        if (setupId === state.standardId && state.comparedIds.length) {
          state.standardId = state.comparedIds[0];
        }
      }
    },
    // CHARACTER
    updateCharacter: (state, action: PayloadAction<Partial<CharInfo>>) => {
      const { setupsById, target } = state;
      const { charInfoIsSeparated } = appSettings.get();
      const { level } = action.payload;

      if (level && target.level === 1) {
        target.level = bareLv(level);
      }
      if (charInfoIsSeparated) {
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
      calculate(state, !charInfoIsSeparated);
    },
    // PARTY
    addTeammate: (state, action: AddTeammateAction) => {
      const { name, vision, weaponType, teammateIndex } = action.payload;
      const setup = state.setupsById[state.activeId];
      const { party, elmtModCtrls } = setup;

      const oldVisionCount = countVision(getPartyData(party), state.charData);
      const oldTeammate = party[teammateIndex];
      // assign to party
      party[teammateIndex] = createTeammate({ name, weaponType });

      const newVisionCount = countVision(getPartyData(party), state.charData);
      // cannot use RESONANCE_VISION_TYPES.includes(oldVision/vision) - ts error
      const resonanceVisionTypes = RESONANCE_VISION_TYPES.map((r) => r.toString());

      if (oldTeammate) {
        const { vision: oldVision } = findDataCharacter(oldTeammate) || {};
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
      if (resonanceVisionTypes.includes(vision) && oldVisionCount[vision] === 1 && newVisionCount[vision] === 2) {
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
      const { party, elmtModCtrls } = state.setupsById[state.activeId];
      const teammate = party[teammateIndex];

      if (teammate) {
        const { vision } = findDataCharacter(teammate)!;
        party[teammateIndex] = null;
        const newVisionCount = countVision(getPartyData(party), state.charData);

        if (newVisionCount[vision] === 1) {
          elmtModCtrls.resonances = elmtModCtrls.resonances.filter((resonance) => {
            return resonance.vision !== vision;
          });
        }
        calculate(state);
      }
    },
    updateTeammateWeapon: (state, action: UpdateTeammateWeaponAction) => {
      const { teammateIndex, ...newWeaponInfo } = action.payload;
      const teammate = state.setupsById[state.activeId].party[teammateIndex];

      if (teammate) {
        teammate.weapon = {
          ...teammate.weapon,
          ...newWeaponInfo,
        };
        if (newWeaponInfo.code) {
          teammate.weapon.buffCtrls = createWeaponBuffCtrls(false, teammate.weapon);
        }
        calculate(state);
      }
    },
    updateTeammateArtifact: (state, action: UpdateTeammateArtifactAction) => {
      const { teammateIndex, ...newArtifactInfo } = action.payload;
      const teammate = state.setupsById[state.activeId].party[teammateIndex];

      if (teammate) {
        teammate.artifact = {
          ...teammate.artifact,
          ...newArtifactInfo,
        };
        if (newArtifactInfo.code) {
          teammate.artifact.buffCtrls = createArtifactBuffCtrls(false, newArtifactInfo);
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
      setup.wpBuffCtrls = createWeaponBuffCtrls(true, weapon);

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
    changeArtifact: (state, action: ChangeArtifactAction) => {
      const { pieceIndex, newPiece, noKeepingStats } = action.payload;
      const setup = state.setupsById[state.activeId];
      const piece = setup.artifacts[pieceIndex];
      const oldSetBonuses = getArtifactSetBonuses(setup.artifacts);
      const oldBonusLevel = oldSetBonuses[0]?.bonusLv;

      if (piece && newPiece && noKeepingStats && appSettings.get().doKeepArtStatsOnSwitch) {
        piece.code = newPiece.code;
        piece.rarity = newPiece.rarity;
      } else {
        setup.artifacts[pieceIndex] = newPiece;
      }

      const newSetBonus = getArtifactSetBonuses(setup.artifacts)[0];

      if (newSetBonus) {
        if (oldBonusLevel === 0 && newSetBonus.bonusLv) {
          setup.artBuffCtrls = createArtifactBuffCtrls(true, newSetBonus);
        } //
        else if (oldBonusLevel && !newSetBonus.bonusLv) {
          setup.artBuffCtrls = [];
        }
      }
      calculate(state);
    },
    updateArtifact: (state, action: UpdateArtifactAction) => {
      const { pieceIndex, level, mainStatType, subStat } = action.payload;
      const piece = state.setupsById[state.activeId].artifacts[pieceIndex];

      if (piece) {
        piece.level = level ?? piece.level;
        piece.mainStatType = mainStatType ?? piece.mainStatType;

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
    updateAllArtifact: (state, action: PayloadAction<(CalcArtifact | null)[]>) => {
      const pieces = action.payload;
      const setBonuses = getArtifactSetBonuses(pieces);
      const setup = state.setupsById[state.activeId];
      setup.artifacts = pieces;
      setup.artBuffCtrls = setBonuses[0]?.bonusLv ? createArtifactBuffCtrls(true, setBonuses[0]) : [];

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
          activeSetup.customBuffCtrls.push(...turnArray(ctrls));
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

      const { target } = state;
      const { code, variantType, inputs = [] } = target;
      const dataMonster = findByCode(monsters, code);

      // not update target if monster code === 0 (custom target)
      if (dataMonster?.code) {
        const { resistance, variant } = dataMonster;
        const { base, ...otherResistances } = resistance;
        const inputConfigs = dataMonster.inputConfigs ? turnArray(dataMonster.inputConfigs) : [];

        for (const atkElmt of ATTACK_ELEMENTS) {
          target.resistances[atkElmt] = base;
        }
        for (const [key, value] of Object.entries(otherResistances)) {
          target.resistances[key as AttackElement] = value;
        }

        if (variantType && variant?.change) {
          target.resistances[variantType] += variant.change;
        }

        const updateResistances = ([key, value]: [string, number]) => {
          switch (key) {
            case "base":
              for (const attElmt of ATTACK_ELEMENTS) {
                target.resistances[attElmt] += value;
              }
              break;
            case "variant":
              if (target.variantType) {
                target.resistances[target.variantType] += value;
              }
              break;
            default:
              target.resistances[key as AttackElement] += value;
          }
        };

        inputs.forEach((input, index) => {
          const config = inputConfigs[index];
          if (!config) return;
          const { type = "check" } = config;

          switch (type) {
            case "check":
              if (input && config.changes) {
                Object.entries(config.changes).forEach(updateResistances);
              }
              break;
            case "select":
              if (input !== -1 && config.options) {
                const option = config.options[input];

                if (typeof option === "string") {
                  if (config.optionChange) {
                    target.resistances[option] += config.optionChange;
                  }
                } else {
                  Object.entries(option.changes).forEach(updateResistances);
                }
              }
              break;
          }
        });
      }

      calculate(state, true);
    },
    updateSetups: (state, action: UpdateSetupsAction) => {
      const { newSetupManageInfos, newStandardId } = action.payload;
      const { setupManageInfos, setupsById, charData, activeId } = state;
      const removedIds = [];
      // Reset comparedIds before repopulate with newSetupManageInfos
      state.comparedIds = [];

      const [selfBuffCtrls, selfDebuffCtrls] = createCharModCtrls(true, charData.name);
      const newWeapon = createWeapon({ type: charData.weaponType });
      const wpBuffCtrls = createWeaponBuffCtrls(true, newWeapon);
      const elmtModCtrls = createElmtModCtrls();
      const tempManageInfos: CalcSetupManageInfo[] = [];

      for (const { ID, name, type, status, originId, isCompared } of newSetupManageInfos) {
        isCompared && state.comparedIds.push(ID);
        const newSetupName = name.trim();

        switch (status) {
          case "REMOVED": {
            // Store to delete later coz they can be used for ref of DUPLICATE case
            removedIds.push(ID);
            break;
          }
          case "OLD": {
            const oldInfo = findById(setupManageInfos, ID);
            if (oldInfo) {
              tempManageInfos.push({
                ...oldInfo,
                name: newSetupName,
              });
            }
            break;
          }
          case "DUPLICATE": {
            if (originId && setupsById[originId]) {
              tempManageInfos.push({
                ID,
                name: newSetupName,
                type: "original",
              });
              setupsById[ID] = deepCopy(setupsById[originId]);
            }
            break;
          }
          case "NEW": {
            tempManageInfos.push({
              ID,
              name: newSetupName,
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
              artifacts: [null, null, null, null, null],
              artBuffCtrls: [],
              artDebuffCtrls: createArtDebuffCtrls(),
              party: [null, null, null],
              elmtModCtrls,
              customBuffCtrls: [],
              customDebuffCtrls: [],
              customInfusion: { element: "phys" },
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

      // if (state.configs.charInfoIsSeparated && !newConfigs.charInfoIsSeparated) {
      //   const activeChar = setupsById[newActiveId].char;

      //   for (const setup of Object.values(setupsById)) {
      //     setup.char = activeChar;
      //   }
      // }

      state.activeId = newActiveId;
      state.comparedIds = state.comparedIds.length === 1 ? [] : state.comparedIds;
      state.standardId = state.comparedIds.length ? newStandardId : 0;
      state.setupManageInfos = tempManageInfos;
      // state.configs = newConfigs;

      calculate(state, true);
    },
    applySettings: (state, action: ApplySettingsAction) => {
      const { doMergeCharInfo } = action.payload;
      const activeChar = state.setupsById[state.activeId]?.char;

      if (doMergeCharInfo && activeChar) {
        for (const setup of Object.values(state.setupsById)) {
          setup.char = activeChar;
        }
        calculate(state, true);
      }
    },
  },
});

export const {
  updateCalculator,
  updateMessage,
  initSessionWithChar,
  initSessionWithSetup,
  importSetup,
  updateCalcSetup,
  duplicateCalcSetup,
  removeCalcSetup,
  updateCharacter,
  addTeammate,
  removeTeammate,
  updateTeammateWeapon,
  updateTeammateArtifact,
  changeWeapon,
  updateWeapon,
  updateArtifact,
  changeArtifact,
  updateAllArtifact,
  updateResonance,
  toggleModCtrl,
  changeModCtrlInput,
  toggleTeammateModCtrl,
  changeTeammateModCtrlInput,
  updateCustomBuffCtrls,
  updateCustomDebuffCtrls,
  removeCustomModCtrl,
  updateTarget,
  updateSetups,
  applySettings,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
