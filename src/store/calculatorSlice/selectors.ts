import type { RootState } from "../index";

export const selectCurrentIndex = (state: RootState) => state.calculator.currentIndex;

export const selectCharData = (state: RootState) => state.calculator.charData;

export const selectCalcConfigs = (state: RootState) => state.calculator.configs;

export const selectSetupManageInfos = (state: RootState) => state.calculator.setupManageInfos;

export const selectSetupManageInfo = (state: RootState) =>
  state.calculator.setupManageInfos[state.calculator.currentIndex];

export const selectCalcSetups = (state: RootState) => state.calculator.setups;

export const selectCalcSetup = (state: RootState) =>
  state.calculator.setups[state.calculator.currentIndex];

export const selectChar = (state: RootState) =>
  state.calculator.setups[state.calculator.currentIndex].char;

export const selectArtInfo = (state: RootState) =>
  state.calculator.setups[state.calculator.currentIndex].artInfo;

export const selectWeapon = (state: RootState) =>
  state.calculator.setups[state.calculator.currentIndex].weapon;

export const selectParty = (state: RootState) =>
  state.calculator.setups[state.calculator.currentIndex].party;

export const selectElmtModCtrls = (state: RootState) =>
  state.calculator.setups[state.calculator.currentIndex].elmtModCtrls;

export const selectTotalAttr = (state: RootState) =>
  state.calculator.allTotalAttrs[state.calculator.currentIndex];

export const selectFinalInfusion = (state: RootState) =>
  state.calculator.allFinalInfusion[state.calculator.currentIndex];

export const selectRxnBonus = (state: RootState) =>
  state.calculator.allRxnBonuses[state.calculator.currentIndex];

export const selectDamageResult = (state: RootState) =>
  state.calculator.allDmgResult[state.calculator.currentIndex];

export const selectTarget = (state: RootState) => state.calculator.target;
