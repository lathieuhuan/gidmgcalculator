import { createSelector } from "@reduxjs/toolkit";
import { getCurrentChar } from "@Src/utils";
import { type RootState } from "../index";

export const selectCharData = (state: RootState) => state.calculator.charData;

export const selectChar = createSelector(
  (state: RootState) => state.calculator.char,
  (state: RootState) => state.calculator.currentSetup,
  (char, currentIndex) => getCurrentChar(char, currentIndex)
);

export const selectTotalAttrs = (state: RootState) =>
  state.calculator.allTotalAttrs[state.calculator.currentSetup];

export const selectArtInfo = (state: RootState) =>
  state.calculator.allArtInfo[state.calculator.currentSetup];

export const selectWeapon = (state: RootState) =>
  state.calculator.allWeapons[state.calculator.currentSetup];
