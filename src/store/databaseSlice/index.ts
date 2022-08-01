import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CalcArtPiece, DatabaseArt, DatabaseState } from "@Src/types";
import { indexById } from "@Src/utils";

const initialState: DatabaseState = {
  myChars: [],
  myWps: [],
  myArts: [],
  chosenChar: "",
};

export const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    addArtifact: (state, action: PayloadAction<DatabaseArt>) => {
      state.myArts.unshift(action.payload);
    },
    overwriteArtifact: ({ myArts }, action: PayloadAction<CalcArtPiece>) => {
      const { ID, ...info } = action.payload;
      const index = indexById(myArts, ID);

      if (myArts[index]) {
        myArts[index] = { ...myArts[index], ...info };
      }
    },
  },
});

export const { addArtifact, overwriteArtifact } = databaseSlice.actions;

export default databaseSlice.reducer;
