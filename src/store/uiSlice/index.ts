import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UIState } from "./types";
import type { SetupImportInfo } from "@Src/types";
import { EScreen } from "@Src/constants";

const initialState: UIState = {
  atScreen: EScreen.CALCULATOR,
  appModalType: "INTRO",
  mySetupsModalType: "",
  highManagerWorking: false,
  trackerState: "close",
  importInfo: {},
  loading: false,
  ready: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    updateUI: (state, action: PayloadAction<Partial<UIState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateSetupImportInfo: (state, action: PayloadAction<SetupImportInfo>) => {
      state.importInfo = action.payload;
    },
  },
});

export const { updateUI, updateSetupImportInfo } = uiSlice.actions;

export default uiSlice.reducer;
