import { createSelector } from "@reduxjs/toolkit";
import { getCurrentChar } from "@Src/utils";
import { type RootState } from "../index";

export const selectCharData = (state: RootState) => state.calculator.charData;

export const selectChar = createSelector(
  (state: RootState) => state.calculator.char,
  (state: RootState) => state.calculator.currentSetup,
  (char, currentIndex) => getCurrentChar(char, currentIndex)
);

export const selectTotalAttr = (state: RootState) =>
  state.calculator.allTotalAttrs[state.calculator.currentSetup];

export const selectArtInfo = (state: RootState) =>
  state.calculator.allArtInfos[state.calculator.currentSetup];

export const selectWeapon = (state: RootState) =>
  state.calculator.allWeapons[state.calculator.currentSetup];

export const selectParty = (state: RootState) =>
  state.calculator.allParties[state.calculator.currentSetup];

export const selectElmtModCtrls = (state: RootState) =>
  state.calculator.allElmtModCtrls[state.calculator.currentSetup];

export const selectFinalInfusion = (state: RootState) =>
  state.calculator.allFinalInfusion[state.calculator.currentSetup];
