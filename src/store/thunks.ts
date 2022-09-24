import { batch } from "react-redux";

import type { AppThunk } from "./index";
import type { PickedChar } from "./calculatorSlice/reducer-types";

import { initSessionWithChar, updateAllArtPieces } from "./calculatorSlice";
import { resetCalculatorUI, changeScreen, toggleSettings } from "./uiSlice";
import { saveSetup } from "./usersDatabaseSlice";

import { EScreen } from "@Src/constants";
import { findById } from "@Src/utils";
import { cleanCalcSetup } from "@Src/utils/setup";

export const startCalculation =
  (pickedChar: PickedChar): AppThunk =>
  (dispatch, getState) => {
    const { myWps, myArts } = getState().database;

    batch(() => {
      dispatch(initSessionWithChar({ pickedChar, myWps, myArts }));
      dispatch(resetCalculatorUI());
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

export const saveSetupThunk = (index: number, ID: number, name: string): AppThunk => {
  return (dispatch, getState) => {
    const { calculator } = getState();

    batch(() => {
      dispatch(
        saveSetup({
          ID,
          name,
          data: {
            ...cleanCalcSetup(calculator.setups[index]),
            target: calculator.target,
          },
        })
      );
      dispatch(changeScreen(EScreen.MY_SETUPS));
      dispatch(toggleSettings(false));
    });
  };
};
