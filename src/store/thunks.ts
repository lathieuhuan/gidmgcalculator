import { batch } from "react-redux";

import type { AppThunk } from "./index";
import type { PickedChar } from "./calculatorSlice/reducer-types";

import { initSessionWithChar, updateAllArtPieces } from "./calculatorSlice";
import { updateUI } from "./uiSlice";
import {
  addArtifact,
  addWeapon,
  saveSetup,
  updateUsersArtifact,
  updateUsersWeapon,
} from "./usersDatabaseSlice";

import { EScreen } from "@Src/constants";
import { findById, indexById } from "@Src/utils";
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
    const artPieces = artifactIDs.map((id) => {
      if (id) {
        const foundArtPiece = findById(myArts, id);

        if (foundArtPiece) {
          const { owner, ...info } = foundArtPiece;
          return info;
        }
      }
      return null;
    });

    dispatch(updateAllArtPieces(artPieces));
  };

export const saveSetupThunk = (ID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const {
      calculator,
      database: { myWps, myArts },
    } = getState();
    const { weapon, artInfo } = calculator.setupsById[ID];
    const foundWpIndex = indexById(myWps, weapon.ID);

    if (foundWpIndex !== -1) {
      dispatch(
        updateUsersWeapon({
          index: foundWpIndex,
          ...myWps[foundWpIndex],
          setupIDs: (myWps[foundWpIndex].setupIDs || []).concat(ID),
        })
      );
    } else {
      dispatch(
        addWeapon({
          ...weapon,
          owner: null,
          setupIDs: [ID],
        })
      );
    }

    for (const artPiece of artInfo.pieces) {
      if (artPiece) {
        const foundIndex = indexById(myArts, artPiece.ID);

        if (foundIndex !== -1) {
          dispatch(
            updateUsersArtifact({
              index: foundIndex,
              ...myArts[foundIndex],
              setupIDs: (myArts[foundIndex].setupIDs || []).concat(ID),
            })
          );
        } else {
          dispatch(
            addArtifact({
              ...artPiece,
              owner: null,
              setupIDs: [ID],
            })
          );
        }
      }
    }

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
