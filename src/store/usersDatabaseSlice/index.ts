import { findArtifactSet, findWeapon } from "@Data/controllers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ARTIFACT_TYPES } from "@Src/constants";
import type {
  Artifact,
  CalcArtPiece,
  CalcArtPieceMainStat,
  CalcArtPieceSubStatInfo,
  Level,
  UsersArtifact,
  UsersDatabaseState,
  UsersWeapon,
  Weapon,
} from "@Src/types";
import { findById, findByName, indexById, indexByName, splitLv } from "@Src/utils";
import { initCharInfo, initWeapon } from "@Store/calculatorSlice/initiators";
import {
  ChangeUsersArtifactSubStatAction,
  ChangeUsersCharTalentLevelAction,
  RemoveArtifactAction,
  RemoveWeaponAction,
  SwitchArtifactAction,
  SwitchWeaponAction,
  UnequipArtifactAction,
} from "./reducer-types";

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
    addCharacter: (state, action: PayloadAction<{ name: string; weapon: Weapon }>) => {
      const { name, weapon } = action.payload;
      const weaponID = Date.now();

      state.chosenChar = name;
      state.myChars.unshift({
        name,
        ...initCharInfo({}),
        weaponID,
        artifactIDs: [null, null, null, null, null],
      });
      state.myWps.unshift({
        ID: weaponID,
        owner: name,
        ...initWeapon({ type: weapon }),
      });
    },
    chooseCharacter: (state, action: PayloadAction<string>) => {
      state.chosenChar = action.payload;
    },
    sortCharacters: (state, action: PayloadAction<number[]>) => {
      state.myChars = action.payload.map((index) => state.myChars[index]);
    },
    levelUsersChar: (state, action: PayloadAction<{ name: string; level: Level }>) => {
      const { name, level } = action.payload;
      const char = findByName(state.myChars, name);
      if (char) {
        char.level = level;
      }
    },
    changeUsersCharConsLevel: (
      state,
      action: PayloadAction<{ name: string; consIndex: number }>
    ) => {
      const { name, consIndex } = action.payload;
      const char = findByName(state.myChars, name);
      if (char) {
        char.cons = char.cons === consIndex + 1 ? consIndex : consIndex + 1;
      }
    },
    changeUsersCharTalentLevel: (state, action: ChangeUsersCharTalentLevelAction) => {
      const { name, type, level } = action.payload;
      const char = findByName(state.myChars, name);
      if (char) {
        char[type] = level;
      }
    },
    removeUsersChar: (state, action: PayloadAction<string>) => {
      const { myChars, myWps, myArts } = state;
      const name = action.payload;
      let charIndex = indexByName(myChars, name);
      const char = myChars[charIndex];

      if (char) {
        const { weaponID, artifactIDs } = char;
        const wpInfo = findById(myWps, weaponID);
        if (wpInfo) {
          wpInfo.owner = null;
        }
        for (const id of artifactIDs) {
          if (id) {
            const artInfo = findById(myArts, id);
            if (artInfo) {
              artInfo.owner = null;
            }
          }
        }
        myChars.splice(charIndex, 1);
        if (charIndex === myChars.length) {
          charIndex--;
        }
        state.chosenChar = myChars[charIndex]?.name || "";
      }
    },
    switchWeapon: ({ myWps, myChars }, action: SwitchWeaponAction) => {
      const { newOwner, newID, oldOwner, oldID } = action.payload;
      const newWeaponInfo = findById(myWps, newID);
      const oldWeaponInfo = findById(myWps, oldID);
      const newOwnerInfo = newOwner ? findByName(myChars, newOwner) : undefined;
      const oldOwnerInfo = findByName(myChars, oldOwner);

      if (newWeaponInfo && oldWeaponInfo && oldOwnerInfo && newOwnerInfo) {
        newWeaponInfo.owner = oldOwner;
        oldWeaponInfo.owner = newOwner;
        oldOwnerInfo.weaponID = newID;
        newOwnerInfo.weaponID = oldID;
      }
    },
    switchArtifact: ({ myArts, myChars }, action: SwitchArtifactAction) => {
      const { newOwner, newID, oldOwner, oldID, artifactIndex } = action.payload;
      const newArtInfo = findById(myArts, newID);
      const oldArtInfo = oldID ? findById(myArts, oldID) : undefined;
      const newOwnerInfo = newOwner ? findByName(myChars, newOwner) : undefined;
      const oldOwnerInfo = oldOwner ? findByName(myChars, oldOwner) : undefined;

      if (newArtInfo && oldArtInfo && newOwnerInfo && oldOwnerInfo) {
        newArtInfo.owner = oldOwner;
        oldArtInfo.owner = newOwner;
        newOwnerInfo.artifactIDs[artifactIndex] = oldID;
        oldOwnerInfo.artifactIDs[artifactIndex] = newID;
      }
    },
    unequipArtifact: (state, action: UnequipArtifactAction) => {
      const { owner, artifactID, artifactIndex } = action.payload;
      const ownerInfo = owner ? findByName(state.myChars, owner) : undefined;
      const artifactInfo = findById(state.myArts, artifactID);

      if (ownerInfo && artifactInfo) {
        ownerInfo.artifactIDs[artifactIndex] = null;
        artifactInfo.owner = null;
      }
    },
    // WEAPON
    addWeapon: (state, action: PayloadAction<UsersWeapon>) => {
      state.myWps.unshift(action.payload);
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
      action: PayloadAction<{ newOwner: string; weaponID: number }>
    ) => {
      const { newOwner, weaponID } = action.payload;
      const weaponInfo = findById(myWps, weaponID);

      if (weaponInfo) {
        const oldOwner = weaponInfo.owner;
        weaponInfo.owner = newOwner;

        const newOwnerInfo = findByName(myChars, newOwner);
        if (newOwnerInfo) {
          const newOwnerWeaponInfo = findById(myWps, newOwnerInfo.weaponID);
          if (newOwnerWeaponInfo) {
            newOwnerWeaponInfo.owner = oldOwner;
          }
        }
        if (oldOwner) {
          const oldOwnerInfo = findByName(myChars, oldOwner);
          if (oldOwnerInfo) {
            oldOwnerInfo.weaponID = weaponID;
          }
        }
        if (newOwnerInfo) {
          newOwnerInfo.weaponID = weaponID;
        }
      }
    },
    sortWeapons: (state) => {
      state.myWps.sort((a, b) => {
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
    removeWeapon: ({ myWps, myChars }, action: RemoveWeaponAction) => {
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
    enhanceUsersArtifact: (state, action: PayloadAction<{ ID: number; level: number }>) => {
      const { ID, level } = action.payload;
      const artifact = findById(state.myArts, ID);
      if (artifact) {
        artifact.level = level;
      }
    },
    changeUsersArtifactMainStatType: (
      state,
      action: PayloadAction<{ ID: number; type: CalcArtPieceMainStat }>
    ) => {
      const { ID, type } = action.payload;
      const artifact = findById(state.myArts, ID);
      if (artifact) {
        artifact.mainStatType = type;
      }
    },
    changeUsersArtifactSubStat: (state, action: ChangeUsersArtifactSubStatAction) => {
      const { ID, subStatIndex, ...changeInfo } = action.payload;
      const artifact = findById(state.myArts, ID);
      if (artifact) {
        artifact.subStats[subStatIndex] = {
          ...artifact.subStats[subStatIndex],
          ...changeInfo,
        };
      }
    },
    swapArtifactOwner: (
      { myChars, myArts },
      action: PayloadAction<{ newOwner: string; artifactID: number }>
    ) => {
      const { newOwner, artifactID } = action.payload;
      const artifactInfo = findById(myArts, artifactID);

      if (artifactInfo) {
        const oldOwner = artifactInfo.owner;
        artifactInfo.owner = newOwner;

        const newOwnerInfo = findByName(myChars, newOwner);
        if (newOwnerInfo) {
          const { artifactIDs } = newOwnerInfo;
          const index = ARTIFACT_TYPES.indexOf(artifactInfo.type);

          if (artifactIDs[index]) {
            const newOwnerArtifactInfo = findById(myArts, artifactIDs[index]);
            if (newOwnerArtifactInfo) {
              newOwnerArtifactInfo.owner = oldOwner;
            }
          }

          if (oldOwner) {
            const oldOwnerInfo = findByName(myChars, oldOwner);
            if (oldOwnerInfo) {
              oldOwnerInfo.artifactIDs[index] = artifactIDs[index];
            }
          }
          artifactIDs[index] = artifactID;
        }
      }
    },
    overwriteArtifact: ({ myArts }, action: PayloadAction<CalcArtPiece>) => {
      const { ID, ...info } = action.payload;
      const index = indexById(myArts, ID);

      if (myArts[index]) {
        myArts[index] = { ...myArts[index], ...info };
      }
    },
    sortArtifacts: (state) => {
      state.myArts.sort((a, b) => {
        if (a.level !== b.level) {
          return b.level - a.level;
        }
        if (a.type !== b.type) {
          const type = {
            flower: 5,
            plume: 4,
            sands: 3,
            goblet: 2,
            circlet: 1,
          };
          return type[b.type] - type[a.type];
        }
        const aName = findArtifactSet({ code: a.code })?.name || "";
        const bName = findArtifactSet({ code: b.code })?.name || "";
        return bName.localeCompare(aName);
      });
    },
    removeArtifact: ({ myArts, myChars }, action: RemoveArtifactAction) => {
      const { ID, owner, type } = action.payload;
      myArts.splice(indexById(myArts, ID), 1);

      if (owner) {
        const index = ARTIFACT_TYPES.indexOf(type);

        const ownerInfo = findByName(myChars, owner);
        if (ownerInfo) {
          ownerInfo.artifactIDs[index] = null;
        }
      }
    },
  },
});

export const {
  addCharacter,
  chooseCharacter,
  sortCharacters,
  levelUsersChar,
  changeUsersCharConsLevel,
  changeUsersCharTalentLevel,
  removeUsersChar,
  switchWeapon,
  switchArtifact,
  unequipArtifact,
  addWeapon,
  refineUsersWeapon,
  swapWeaponOwner,
  upgradeUsersWeapon,
  sortWeapons,
  removeWeapon,
  addArtifact,
  enhanceUsersArtifact,
  changeUsersArtifactMainStatType,
  changeUsersArtifactSubStat,
  swapArtifactOwner,
  overwriteArtifact,
  sortArtifacts,
  removeArtifact,
} = usersDatabaseSlice.actions;

export default usersDatabaseSlice.reducer;
