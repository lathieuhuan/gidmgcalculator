import { createSelector } from "@reduxjs/toolkit";
import { WeaponType } from "@Src/types";
import { RootState } from "..";

export const selectUserWps = (state: RootState) => state.database.userWps;

export const selectUserArts = (state: RootState) => state.database.userArts;

export const selectUserChars = (state: RootState) => state.database.userChars;

export const selectUserSetups = (state: RootState) => state.database.userSetups;

export const selectChosenChar = (state: RootState) => state.database.chosenChar;

export const selectChosenSetupID = (state: RootState) => state.database.chosenSetupID;

export const selectWeaponInventory = createSelector(
  selectUserWps,
  (_: unknown, types: WeaponType[]) => types,
  (userWps, types) => ({
    filteredWeapons: types.length ? userWps.filter((wp) => types.includes(wp.type)) : userWps,
    totalCount: userWps.length,
  })
);
