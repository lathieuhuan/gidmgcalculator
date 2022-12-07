import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CalcArtPiece,
  UsersArtifact,
  UsersComplexSetup,
  UsersDatabaseState,
  UsersWeapon,
  Weapon,
} from "@Src/types";
import type {
  AddUsersDatabaseAction,
  UpdateUsersArtifactSubStatAction,
  RemoveArtifactAction,
  RemoveWeaponAction,
  SaveSetupAction,
  SwitchArtifactAction,
  SwitchWeaponAction,
  UnequipArtifactAction,
  UpdateUsersArtifactAction,
  UpdateUsersCharacterAction,
  UpdateUsersWeaponAction,
  CombineSetupsAction,
  AddSetupToComplexAction,
  SwitchShownSetupInComplexAction,
} from "./reducer-types";
import { ARTIFACT_TYPES } from "@Src/constants";

import { findById, findByName, indexById, indexByName, splitLv } from "@Src/utils";
import { initCharInfo, initWeapon } from "@Store/calculatorSlice/initiators";
import { findArtifactSet, findWeapon } from "@Data/controllers";
import { isUsersSetup } from "./utils";

const initialState: UsersDatabaseState = {
  myChars: [],
  myWps: [],
  myArts: [],
  mySetups: [],
  chosenChar: "",
  chosenSetupID: 0,
};

export const usersDatabaseSlice = createSlice({
  name: "users-database",
  initialState,
  reducers: {
    addUsersDatabase: (state, action: AddUsersDatabaseAction) => {
      const { Characters, Weapons, Artifacts, Setups } = action.payload;
      state.myChars = Characters;
      state.myWps = Weapons;
      state.myArts = Artifacts;
      state.mySetups = Setups;

      if (Characters.length) {
        state.chosenChar = Characters[0].name;
      }
      if (Setups.length) {
        const firstSetup = Setups.find((setup) => setup.type !== "combined");

        if (firstSetup) {
          if (firstSetup.type === "original") {
            state.chosenSetupID = firstSetup.ID;
          } else if (firstSetup.type === "complex") {
            state.chosenSetupID = firstSetup.shownID;
          }
        }
      }
    },
    // CHARACTER
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
    updateUsersCharacter: (state, action: UpdateUsersCharacterAction) => {
      const { name, ...newInfo } = action.payload;
      const charIndex = indexByName(state.myChars, name);

      if (charIndex !== -1) {
        state.myChars[charIndex] = {
          ...state.myChars[charIndex],
          ...newInfo,
        };
      }
    },
    removeUsersCharacter: (state, action: PayloadAction<string>) => {
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
      if (newWeaponInfo) {
        newWeaponInfo.owner = oldOwner;
      }

      const oldWeaponInfo = findById(myWps, oldID);
      if (oldWeaponInfo) {
        oldWeaponInfo.owner = newOwner;
      }

      const oldOwnerInfo = findByName(myChars, oldOwner);
      if (oldOwnerInfo) {
        oldOwnerInfo.weaponID = newID;
      }

      const newOwnerInfo = newOwner ? findByName(myChars, newOwner) : undefined;
      if (newOwnerInfo) {
        newOwnerInfo.weaponID = oldID;
      }
    },
    switchArtifact: ({ myArts, myChars }, action: SwitchArtifactAction) => {
      const { newOwner, newID, oldOwner, oldID, artifactIndex } = action.payload;

      const newArtInfo = findById(myArts, newID);
      if (newArtInfo) {
        newArtInfo.owner = oldOwner;
      }

      const oldArtInfo = findById(myArts, oldID);
      if (oldArtInfo) {
        oldArtInfo.owner = newOwner;
      }

      const oldOwnerInfo = findByName(myChars, oldOwner);
      if (oldOwnerInfo) {
        oldOwnerInfo.artifactIDs[artifactIndex] = newID;
      }

      const newOwnerInfo = newOwner ? findByName(myChars, newOwner) : undefined;
      if (newOwnerInfo) {
        newOwnerInfo.artifactIDs[artifactIndex] = oldID;
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
    updateUsersWeapon: (state, action: UpdateUsersWeaponAction) => {
      const { ID, index, ...newInfo } = action.payload;
      const weaponIndex = index ?? indexById(state.myWps, ID);

      if (weaponIndex !== -1) {
        state.myWps[weaponIndex] = {
          ...state.myWps[weaponIndex],
          ...newInfo,
        };
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
    updateUsersArtifact: (state, action: UpdateUsersArtifactAction) => {
      const { ID, index, ...newInfo } = action.payload;
      const artifactIndex = index ?? indexById(state.myArts, ID);

      if (artifactIndex !== -1) {
        state.myArts[artifactIndex] = {
          ...state.myArts[artifactIndex],
          ...newInfo,
        };
      }
    },
    updateUsersArtifactSubStat: (state, action: UpdateUsersArtifactSubStatAction) => {
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
    // SETUP
    chooseUsersSetup: (state, action: PayloadAction<number>) => {
      state.chosenSetupID = action.payload;
    },
    saveSetup: (state, action: SaveSetupAction) => {
      const { mySetups } = state;
      const { ID, name, data } = action.payload;
      const existed = findById(mySetups, ID);
      let newChosenID;

      if (existed?.type === "combined") {
        for (const setup of mySetups) {
          if (setup.type === "complex" && setup.allIDs[existed.char.name] === ID) {
            newChosenID = setup.ID;
            setup.shownID = ID;
            break;
          }
        }
      }

      const newSetup = {
        ID,
        type: existed ? (existed.type as "original" | "combined") : "original",
        name,
        ...data,
      };

      if (existed) {
        mySetups[indexById(mySetups, ID)] = newSetup;
      } else {
        mySetups.unshift(newSetup);
      }

      state.chosenSetupID = newChosenID || ID;
    },
    removeSetup: (state, action: PayloadAction<number>) => {
      const removedID = action.payload;
      const { mySetups } = state;

      const visibleIDs = mySetups.reduce((result, setup) => {
        if (setup.type !== "combined") {
          result.push(setup.ID);
        }
        return result;
      }, [] as number[]);

      mySetups.splice(indexById(mySetups, removedID), 1);

      const removedIndexInVisible = visibleIDs.indexOf(removedID);
      const lastIndex = visibleIDs.length - 1;
      const newID =
        removedIndexInVisible === lastIndex
          ? visibleIDs[lastIndex - 1] || 0
          : visibleIDs[removedIndexInVisible + 1];
      state.chosenSetupID = newID;
    },
    combineSetups: (state, action: CombineSetupsAction) => {
      const { pickedIDs, name } = action.payload;
      const { mySetups } = state;
      const allIDs: Record<string, number> = {};
      const ID = Date.now();

      for (const ID of pickedIDs) {
        const setup = findById(mySetups, ID);

        if (setup) {
          setup.type = "combined";

          if (isUsersSetup(setup)) {
            allIDs[setup.char.name] = ID;
          }
        }
      }

      mySetups.unshift({
        name,
        ID,
        type: "complex",
        shownID: pickedIDs[0],
        allIDs,
      });
      state.chosenSetupID = ID;
    },
    switchShownSetupInComplex: (state, action: SwitchShownSetupInComplexAction) => {
      const { complexID, shownID } = action.payload;
      const complexSetup = findById(state.mySetups, complexID);

      if (complexSetup && !isUsersSetup(complexSetup)) {
        complexSetup.shownID = shownID;
      }
    },
    addSetupToComplex: ({ mySetups }, action: AddSetupToComplexAction) => {
      const { complexID, pickedIDs } = action.payload;
      const complexSetup = mySetups.find(
        (setup) => setup.ID === complexID && setup.type === "complex"
      ) as UsersComplexSetup;

      if (complexSetup) {
        pickedIDs.forEach((ID) => {
          const setup = findById(mySetups, ID);

          if (setup && isUsersSetup(setup)) {
            setup.type = "combined";
            complexSetup.allIDs[setup.char.name] = ID;
          }
        });
      }
    },
    uncombineSetups: ({ mySetups }, action: PayloadAction<number>) => {
      const index = indexById(mySetups, action.payload);
      const targetSetup = mySetups[index];

      if (targetSetup && !isUsersSetup(targetSetup)) {
        for (const ID of Object.values(targetSetup.allIDs)) {
          const combinedSetup = findById(mySetups, ID);

          if (combinedSetup) {
            combinedSetup.type = "original";
          }
        }
        mySetups.splice(index, 1);
      }
    },
  },
});

export const {
  addUsersDatabase,
  addCharacter,
  chooseCharacter,
  sortCharacters,
  updateUsersCharacter,
  removeUsersCharacter,
  switchWeapon,
  switchArtifact,
  unequipArtifact,
  addWeapon,
  swapWeaponOwner,
  updateUsersWeapon,
  sortWeapons,
  removeWeapon,
  addArtifact,
  updateUsersArtifact,
  updateUsersArtifactSubStat,
  swapArtifactOwner,
  overwriteArtifact,
  sortArtifacts,
  removeArtifact,
  chooseUsersSetup,
  saveSetup,
  removeSetup,
  combineSetups,
  switchShownSetupInComplex,
  addSetupToComplex,
  uncombineSetups,
} = usersDatabaseSlice.actions;

export default usersDatabaseSlice.reducer;
