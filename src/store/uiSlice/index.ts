import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EScreen } from "@Src/constants";
import type { ImportInfo, UIState } from "./types";

const initialState: UIState = {
  atScreen: EScreen.CALCULATOR,
  introOn: true,
  settingsOn: false,
  importInfo: {
    type: "",
  },
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
    updateImportInfo: (state, action: PayloadAction<ImportInfo>) => {
      state.importInfo = action.payload;
    },
  },
});

export const { updateUI, updateImportInfo } = uiSlice.actions;

export default uiSlice.reducer;
