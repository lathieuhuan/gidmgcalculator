import type { RootState } from "../index";

export const selectCalcSetupsById = (state: RootState) => state.calculator.setupsById;

export const selectActiveId = (state: RootState) => state.calculator.activeId;

export const selectStandardId = (state: RootState) => state.calculator.standardId;

export const selectComparedIds = (state: RootState) => state.calculator.comparedIds;

export const selectCharData = (state: RootState) => state.calculator.charData;

export const selectCalcConfigs = (state: RootState) => state.calculator.configs;

export const selectSetupManageInfos = (state: RootState) => state.calculator.setupManageInfos;

export const selectChar = (state: RootState) =>
  state.calculator.setupsById[state.calculator.activeId]?.char;

export const selectArtInfo = (state: RootState) =>
  state.calculator.setupsById[state.calculator.activeId]?.artInfo;

export const selectWeapon = (state: RootState) =>
  state.calculator.setupsById[state.calculator.activeId]?.weapon;

export const selectParty = (state: RootState) =>
  state.calculator.setupsById[state.calculator.activeId]?.party;

export const selectElmtModCtrls = (state: RootState) =>
  state.calculator.setupsById[state.calculator.activeId]?.elmtModCtrls;

export const selectTarget = (state: RootState) => state.calculator.target;

export const selectTotalAttr = (state: RootState) =>
  state.calculator.statsById[state.calculator.activeId].totalAttrs;

export const selectFinalInfusion = (state: RootState) =>
  state.calculator.statsById[state.calculator.activeId].finalInfusion;

export const selectRxnBonus = (state: RootState) =>
  state.calculator.statsById[state.calculator.activeId].rxnBonuses;

export const selectDmgResult = (state: RootState) =>
  state.calculator.statsById[state.calculator.activeId].dmgResult;
