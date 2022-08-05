import { findById } from "@Src/utils";
import { batch } from "react-redux";
import { initSessionWithChar, updateAllArtPieces } from "./calculatorSlice";
import type { PickedChar } from "./calculatorSlice/reducer-types";
import { AppThunk } from "./index";
import { resetCalculatorUI } from "./uiSlice";

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
