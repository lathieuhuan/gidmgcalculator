import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CalcArtPiece, UsersArtifact, UsersDatabaseState } from "@Src/types";
import { indexById } from "@Src/utils";

const initialState: UsersDatabaseState = {
  myChars: [],
  myWps: [],
  myArts: [],
  chosenChar: "",
};

export const usersDatabaseSlice = createSlice({
  name: "users-database",
  initialState,
  reducers: {
    addArtifact: (state, action: PayloadAction<UsersArtifact>) => {
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

export const { addArtifact, overwriteArtifact } = usersDatabaseSlice.actions;

export default usersDatabaseSlice.reducer;
