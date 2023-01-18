import { batch } from "react-redux";
import isEqual from "react-fast-compare";
import type { AppThunk } from "./index";
import type { PickedChar } from "./calculatorSlice/reducer-types";
import { EScreen } from "@Src/constants";

import { initSessionWithChar, updateAllArtifact } from "./calculatorSlice";
import { updateUI } from "./uiSlice";
import {
  addUserArtifact,
  addUserWeapon,
  saveSetup,
  updateUserArtifact,
  updateUserWeapon,
} from "./userDatabaseSlice";

import { findById, calcItemToUserItem, userItemToCalcItem } from "@Src/utils";
import { cleanupCalcSetup, isUserSetup } from "@Src/utils/setup";

export const startCalculation =
  (pickedChar: PickedChar): AppThunk =>
  (dispatch, getState) => {
    const { userWps, userArts } = getState().database;

    dispatch(initSessionWithChar({ pickedChar, userWps, userArts }));
  };

export const pickEquippedArtSet =
  (artifactIDs: (number | null)[]): AppThunk =>
  (dispatch, getState) => {
    const { userArts } = getState().database;
    const artifacts = artifactIDs.map((id) => {
      const artifact = id ? findById(userArts, id) : undefined;
      return artifact ? userItemToCalcItem(artifact) : null;
    });

    dispatch(updateAllArtifact(artifacts));
  };

export const saveSetupThunk = (setupID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const {
      calculator,
      database: { userSetups, userWps, userArts },
    } = getState();

    const { weapon, artifacts } = calculator.setupsById[setupID];
    let seedID = Date.now();
    let weaponID = weapon.ID;
    const artifactIDs = artifacts.map((artifact) => artifact?.ID ?? null);
    const userSetup = findById(userSetups, setupID);
    const userWeapon = findById(userWps, weapon.ID);
    const isOldSetup = userSetup && isUserSetup(userSetup);

    if (!userWeapon) {
      dispatch(
        addUserWeapon(
          calcItemToUserItem(weapon, {
            setupIDs: [setupID],
          })
        )
      );

      if (isOldSetup) {
        const oldWeapon = findById(userWps, userSetup.weaponID);

        if (oldWeapon) {
          dispatch(
            updateUserWeapon({
              ID: userSetup.weaponID,
              setupIDs: oldWeapon.setupIDs?.filter((ID) => ID !== setupID),
            })
          );
        }
      }
    } else {
      // Nothing changes => add setupID
      if (isEqual(weapon, userItemToCalcItem(userWeapon))) {
        const newSetupIDs = userWeapon.setupIDs || [];

        if (!newSetupIDs.includes(setupID)) {
          dispatch(
            updateUserWeapon({
              ID: userWeapon.ID,
              setupIDs: newSetupIDs.concat(setupID),
            })
          );
        }
      } else {
        // Add new weapon
        weaponID = seedID++;

        dispatch(
          addUserWeapon(
            calcItemToUserItem(weapon, {
              ID: weaponID,
              setupIDs: [setupID],
            })
          )
        );

        // Remove setupID from existed weapon
        dispatch(
          updateUserWeapon({
            ID: userWeapon.ID,
            setupIDs: userWeapon.setupIDs?.filter((ID) => ID !== setupID),
          })
        );
      }
    }

    artifacts.forEach((artifact, artifactIndex) => {
      if (!artifact) return;
      const userArtifact = findById(userArts, artifact.ID);

      if (!userArtifact) {
        dispatch(
          addUserArtifact(
            calcItemToUserItem(artifact, {
              setupIDs: [setupID],
            })
          )
        );

        if (isOldSetup) {
          const oldArtifactID = userSetup.artifactIDs[artifactIndex] || undefined;
          const oldArtifact = findById(userArts, oldArtifactID);

          if (oldArtifact) {
            dispatch(
              updateUserArtifact({
                ID: oldArtifact.ID,
                setupIDs: oldArtifact.setupIDs?.filter((ID) => ID !== setupID),
              })
            );
          }
        }
      } else {
        if (isEqual(artifact, userItemToCalcItem(userArtifact))) {
          const newSetupIDs = userArtifact.setupIDs || [];

          if (!newSetupIDs.includes(setupID)) {
            dispatch(
              updateUserArtifact({
                ID: userArtifact.ID,
                setupIDs: newSetupIDs.concat(setupID),
              })
            );
          }
        } else {
          const artifactID = seedID++;
          artifactIDs[artifactIndex] = artifactID;

          dispatch(
            addUserArtifact(
              calcItemToUserItem(artifact, {
                ID: artifactID,
                setupIDs: [setupID],
              })
            )
          );

          dispatch(
            updateUserArtifact({
              ID: userArtifact.ID,
              setupIDs: userArtifact.setupIDs?.filter((ID) => ID !== setupID),
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
          data: cleanupCalcSetup(calculator, setupID, { weaponID, artifactIDs }),
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
