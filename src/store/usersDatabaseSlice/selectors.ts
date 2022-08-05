import { createSelector } from "@reduxjs/toolkit";
import { Weapon } from "@Src/types";
import { findById } from "@Src/utils";
import { RootState } from "..";

export const selectMyWps = (state: RootState) => state.database.myWps;
export const selectMyArts = (state: RootState) => state.database.myArts;
export const selectMyChars = (state: RootState) => state.database.myChars;

export const selectFilteredWeaponIDs = createSelector(
  selectMyWps,
  (_: unknown, types: Weapon[]) => types,
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
