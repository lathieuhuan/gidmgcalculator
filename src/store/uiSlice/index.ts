import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EScreen } from "@Src/constants";
import type { RootState } from "../index";
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

export const selectAtScreen = (state: RootState) => state.ui.atScreen;

export default uiSlice.reducer;
