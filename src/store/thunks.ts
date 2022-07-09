import { batch } from "react-redux";
import { AppThunk } from "./index";


export const initSessionWithChar = (pickedChar): AppThunk => (dispatch, getState) => {
  const { myWps, myArts } = getState().database;
  batch(() => {
    dispatch(INIT_SESSION_WITH_CHAR({ pickedChar, myWps, myArts }));
    dispatch(RESET_CALC_UI());
  });
};