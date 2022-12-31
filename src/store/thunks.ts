import { batch } from "react-redux";

import type { AppThunk } from "./index";
import type { PickedChar } from "./calculatorSlice/reducer-types";

import { initSessionWithChar, updateAllArtifact } from "./calculatorSlice";
import { updateUI } from "./uiSlice";
import {
  addUserArtifact,
  addUserWeapon,
  saveSetup,
  updateUserArtifact,
  updateUserWeapon,
} from "./userDatabaseSlice";

import { EScreen } from "@Src/constants";
import { calcItemToUserItem, findById, indexById, userItemToCalcItem } from "@Src/utils";
import { cleanupCalcSetup } from "@Src/utils/setup";
import isEqual from "react-fast-compare";

export const startCalculation =
  (pickedChar: PickedChar): AppThunk =>
  (dispatch, getState) => {
    const { myWps, myArts } = getState().database;

    batch(() => {
      dispatch(initSessionWithChar({ pickedChar, myWps, myArts }));
      dispatch(updateUI({ atScreen: EScreen.CALCULATOR }));
    });
  };

export const pickEquippedArtSet =
  (artifactIDs: (number | null)[]): AppThunk =>
  (dispatch, getState) => {
    const { myArts } = getState().database;
    const artifacts = artifactIDs.map((id) => {
      const artifact = id ? findById(myArts, id) : undefined;
      return artifact ? userItemToCalcItem(artifact) : null;
    });

    dispatch(updateAllArtifact(artifacts));
  };

export const saveSetupThunk = (setuppID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const {
      calculator,
      database: { myWps, myArts },
    } = getState();
    const { weapon, artifacts } = calculator.setupsById[setuppID];
    let seedID = Date.now();
    let weaponID = weapon.ID;
    const foundWpIndex = indexById(myWps, weapon.ID);

    if (foundWpIndex !== -1) {
      // weapon existed and nothing changes
      if (isEqual(weapon, userItemToCalcItem(myWps[foundWpIndex]))) {
        let newSetupIDs = myWps[foundWpIndex].setupIDs || [];

        if (!newSetupIDs.includes(setuppID)) {
          dispatch(
            updateUserWeapon({
              index: foundWpIndex,
              ...myWps[foundWpIndex],
              setupIDs: newSetupIDs.concat(setuppID),
            })
          );
        }
      } else {
        weaponID = seedID++;

        dispatch(
          addUserWeapon(
            calcItemToUserItem(
              {
                ...weapon,
                ID: weaponID,
              },
              { setupIDs: [setuppID] }
            )
          )
        );
      }
    } else {
      dispatch(addUserWeapon(calcItemToUserItem(weapon, { setupIDs: [setuppID] })));
    }

    artifacts.forEach((artifact, artifactIndex) => {
      if (artifact) {
        const foundIndex = indexById(myArts, artifact.ID);

        if (foundIndex !== -1) {
          let newSetupIDs = myArts[foundIndex].setupIDs;

          if (newSetupIDs && !newSetupIDs.includes(setuppID)) {
            dispatch(
              updateUserArtifact({
                index: foundIndex,
                ...myArts[foundIndex],
                setupIDs: newSetupIDs.concat(setuppID),
              })
            );
          }
        } else {
          dispatch(
            addUserArtifact({
              ...artifact,
              owner: null,
              setupIDs: [setuppID],
            })
          );
        }
      }
    });

    batch(() => {
      dispatch(
        saveSetup({
          ID: setuppID,
          name,
          data: cleanupCalcSetup(calculator, setuppID, { weaponID }),
        })
      );
      dispatch(
        updateUI({
          atScreen: EScreen.MY_SETUPS,
          settingsOn: false,
        })
      );
    });
  };
};
