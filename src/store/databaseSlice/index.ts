import type { DatabaseState } from "@Src/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DatabaseState = {
  myChars: [],
  myWps: [],
  myArts: [],
  chosenChar: "",
};

export const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {},
});

export const {} = databaseSlice.actions;

export default databaseSlice.reducer;
