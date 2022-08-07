import { findWeapon } from "@Data/controllers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CalcArtPiece,
  CalcWeapon,
  Level,
  UsersArtifact,
  UsersDatabaseState,
  UsersWeapon,
  Weapon,
} from "@Src/types";
import { findById, findByName, indexById, splitLv } from "@Src/utils";
import { initWeapon } from "@Store/calculatorSlice/initiators";

const initialState: UsersDatabaseState = {
  myChars: [],
  myWps: [],
  myArts: [],
  chosenChar: "",
};

export const usersDatabaseSlice = createSlice({
  name: "users-database",
  initialState,
  reducers: {
    addWeapon: (state, action: PayloadAction<CalcWeapon>) => {
      state.myWps.unshift({ owner: null, ...action.payload });
    },
    upgradeUsersWeapon: (state, action: PayloadAction<{ ID: number; level: Level }>) => {
      const { ID, level } = action.payload;
      const weapon = findById(state.myWps, ID);
      if (weapon) {
        weapon.level = level;
      }
    },
    refineUsersWeapon: (state, action: PayloadAction<{ ID: number; refi: number }>) => {
      const { ID, refi } = action.payload;
      const weapon = findById(state.myWps, ID);
      if (weapon) {
        weapon.refi = refi;
      }
    },
    swapWeaponOwner: (
      { myChars, myWps },
      action: PayloadAction<{ newOwner: string; targetWeaponID: number; oldOwner: string | null }>
    ) => {
      const { newOwner, targetWeaponID, oldOwner } = action.payload;
      const targetWeaponInfo = findById(myWps, targetWeaponID);

      if (targetWeaponInfo) {
        targetWeaponInfo.owner = newOwner;
      }

      const newOwnerInfo = findByName(myChars, newOwner);

      if (newOwnerInfo) {
        const newWeaponInfo = findById(myWps, newOwnerInfo.weaponID);

        if (newWeaponInfo) {
          newWeaponInfo.owner = oldOwner;
        }
      }

      if (oldOwner) {
        const oldOwnerInfo = findByName(myChars, oldOwner);

        if (oldOwnerInfo) {
          oldOwnerInfo.weaponID = targetWeaponID;
        }
      }

      if (newOwnerInfo) {
        newOwnerInfo.weaponID = targetWeaponID;
      }
    },
    sortWeapons: (state) => {
      state.myWps.sort((a: UsersWeapon, b: UsersWeapon) => {
        const rA = findWeapon(a)?.rarity || 4;
        const rB = findWeapon(b)?.rarity || 4;
        if (rA !== rB) {
          return rB - rA;
        }

        const [fA, sA] = splitLv(a);
        const [fB, sB] = splitLv(b);
        if (fA !== fB) {
          return fB - fA;
        }

        if (a.type !== b.type) {
          const type = {
            bow: 5,
            catalyst: 4,
            polearm: 3,
            claymore: 2,
            sword: 1,
          };
          return type[b.type] - type[a.type];
        }
        return sB - sA;
      });
    },
    removeWeapon: (
      { myWps, myChars },
      action: PayloadAction<{ ID: number; owner: string | null; type: Weapon }>
    ) => {
      const { ID, owner, type } = action.payload;
      myWps.splice(indexById(myWps, ID), 1);

      if (owner) {
        const newWpID = Date.now();
        myWps.unshift({
          ID: newWpID,
          owner,
          ...initWeapon({ type }),
        });

        const ownerInfo = findByName(myChars, owner);
        if (ownerInfo) {
          ownerInfo.weaponID = newWpID;
        }
      }
    },
    // ARTIFACT
    addArtifact: (state, action: PayloadAction<UsersArtifact>) => {
      state.myArts.unshift(action.payload);
    },
    overwriteArtifact: ({ myArts }, action: PayloadAction<CalcArtPiece>) => {
      const { ID, ...info } = action.payload;
      const index = indexById(myArts, ID);

      if (myArts[index]) {
        myArts[index] = { ...myArts[index], ...info };
      }
    },
  },
});

export const {
  addWeapon,
  refineUsersWeapon,
  swapWeaponOwner,
  upgradeUsersWeapon,
  sortWeapons,
  removeWeapon,
  addArtifact,
  overwriteArtifact,
} = usersDatabaseSlice.actions;

export default usersDatabaseSlice.reducer;
