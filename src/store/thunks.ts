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
import { findById, indexById, calcItemToUserItem, userItemToCalcItem } from "@Src/utils";
import { cleanupCalcSetup } from "@Src/utils/setup";
import isEqual from "react-fast-compare";

export const startCalculation =
  (pickedChar: PickedChar): AppThunk =>
  (dispatch, getState) => {
    const { myWps, myArts } = getState().database;

    dispatch(initSessionWithChar({ pickedChar, myWps, myArts }));
    // batch(() => {
    //   dispatch(updateUI({ atScreen: EScreen.CALCULATOR }));
    // });
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

export const saveSetupThunk = (setupID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const {
      calculator,
      database: { myWps, myArts },
    } = getState();
    const { weapon, artifacts } = calculator.setupsById[setupID];
    let seedID = Date.now();
    let weaponID = weapon.ID;
    const foundWpIndex = indexById(myWps, weapon.ID);

    if (foundWpIndex === -1) {
      dispatch(
        addUserWeapon(
          calcItemToUserItem(weapon, {
            setupIDs: [setupID],
          })
        )
      );
    } else {
      // weapon existed and nothing changes
      if (isEqual(weapon, userItemToCalcItem(myWps[foundWpIndex]))) {
        let newSetupIDs = myWps[foundWpIndex].setupIDs || [];

        if (!newSetupIDs.includes(setupID)) {
          dispatch(
            updateUserWeapon({
              index: foundWpIndex,
              ID: weapon.ID,
              setupIDs: newSetupIDs.concat(setupID),
            })
          );
        }
      } else {
        // remove setupID from existed weapon
        dispatch(
          updateUserWeapon({
            index: foundWpIndex,
            ID: weapon.ID,
            setupIDs: myWps[foundWpIndex].setupIDs?.filter((ID) => ID !== setupID),
          })
        );

        weaponID = seedID++;

        dispatch(
          addUserWeapon(
            calcItemToUserItem(weapon, {
              ID: weaponID,
              setupIDs: [setupID],
            })
          )
        );
      }
    }

    artifacts.forEach((artifact, artifactIndex) => {
      if (artifact) {
        const foundIndex = indexById(myArts, artifact.ID);

        if (foundIndex !== -1) {
          let newSetupIDs = myArts[foundIndex].setupIDs;

          if (newSetupIDs && !newSetupIDs.includes(setupID)) {
            dispatch(
              updateUserArtifact({
                index: foundIndex,
                ...myArts[foundIndex],
                setupIDs: newSetupIDs.concat(setupID),
              })
            );
          }
        } else {
          dispatch(
            addUserArtifact({
              ...artifact,
              owner: null,
              setupIDs: [setupID],
            })
          );
        }
      }
    });

    batch(() => {
      dispatch(
        saveSetup({
          ID: setupID,
          name,
          data: cleanupCalcSetup(calculator, setupID, { weaponID }),
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
