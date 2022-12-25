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
import { findById, indexById, userItemToCalcItem } from "@Src/utils";
import { cleanupCalcSetup } from "@Src/utils/setup";

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

export const saveSetupThunk = (ID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const {
      calculator,
      database: { myWps, myArts },
    } = getState();
    const { weapon, artifacts } = calculator.setupsById[ID];
    const foundWpIndex = indexById(myWps, weapon.ID);

    if (foundWpIndex !== -1) {
      let newSetupIDs = myWps[foundWpIndex].setupIDs;

      if (newSetupIDs && !newSetupIDs.includes(ID)) {
        dispatch(
          updateUserWeapon({
            index: foundWpIndex,
            ...myWps[foundWpIndex],
            setupIDs: newSetupIDs.concat(ID),
          })
        );
      }
    } else {
      dispatch(
        addUserWeapon({
          ...weapon,
          owner: null,
          setupIDs: [ID],
        })
      );
    }

    artifacts.forEach((artifact, artifactIndex) => {
      if (artifact) {
        const foundIndex = indexById(myArts, artifact.ID);

        if (foundIndex !== -1) {
          let newSetupIDs = myArts[foundIndex].setupIDs;

          if (newSetupIDs && !newSetupIDs.includes(ID)) {
            dispatch(
              updateUserArtifact({
                index: foundIndex,
                ...myArts[foundIndex],
                setupIDs: newSetupIDs.concat(ID),
              })
            );
          }
        } else {
          dispatch(
            addUserArtifact({
              ...artifact,
              owner: null,
              setupIDs: [ID],
            })
          );
        }
      }
    });

    batch(() => {
      dispatch(
        saveSetup({
          ID,
          name,
          data: cleanupCalcSetup(calculator, ID),
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
