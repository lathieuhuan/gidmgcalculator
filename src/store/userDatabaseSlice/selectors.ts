import { createSelector } from "@reduxjs/toolkit";
import { WeaponType } from "@Src/types";
import { findById } from "@Src/utils";
import { RootState } from "..";

export const selectMyWps = (state: RootState) => state.database.myWps;
export const selectMyArts = (state: RootState) => state.database.myArts;
export const selectMyChars = (state: RootState) => state.database.myChars;
export const selectMySetups = (state: RootState) => state.database.mySetups;
export const selectChosenChar = (state: RootState) => state.database.chosenChar;
export const selectChosenSetupID = (state: RootState) => state.database.chosenSetupID;

export const selectFilteredWeaponIDs = createSelector(
  selectMyWps,
  (_: unknown, types: WeaponType[]) => types,
  (myWps, types) => {
    const result = types.length ? myWps.filter((wp) => types.includes(wp.type)) : myWps;
    return result.map(({ ID }) => ID);
  }
);

export const selectWeaponById = createSelector(
  selectMyWps,
  (_: unknown, ID: number) => ID,
  (myWps, ID) => findById(myWps, ID)
);

export const selectArtifactById = createSelector(
  selectMyArts,
  (_: unknown, ID: number) => ID,
  (myArts, ID) => findById(myArts, ID)
);
