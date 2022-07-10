import { batch } from "react-redux";
import { initSessionWithChar } from "./calculatorSlice";
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
