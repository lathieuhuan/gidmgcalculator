import { createSelector } from "@reduxjs/toolkit";
import { WeaponType } from "@Src/types";
import { findById } from "@Src/utils";
import { RootState } from "..";

export const selectUserWps = (state: RootState) => state.database.userWps;
export const selectUserArts = (state: RootState) => state.database.userArts;
export const selectUserChars = (state: RootState) => state.database.userChars;
export const selectMySetups = (state: RootState) => state.database.userSetups;
export const selectChosenChar = (state: RootState) => state.database.chosenChar;
export const selectChosenSetupID = (state: RootState) => state.database.chosenSetupID;

export const selectFilteredWeaponIDs = createSelector(
  selectUserWps,
  (_: unknown, types: WeaponType[]) => types,
  (userWps, types) => {
    const result = types.length ? userWps.filter((wp) => types.includes(wp.type)) : userWps;
    return result.map(({ ID }) => ID);
  }
);

export const selectWeaponById = createSelector(
  selectUserWps,
  (_: unknown, ID: number) => ID,
  (userWps, ID) => findById(userWps, ID)
);

export const selectArtifactById = createSelector(
  selectUserArts,
  (_: unknown, ID: number) => ID,
  (userArts, ID) => findById(userArts, ID)
);
