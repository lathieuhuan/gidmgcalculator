import { type RootState } from "../index";

export const selectCharData = (state: RootState) => state.calculator.charData;

export const selectChar = (state: RootState) => state.calculator.char;
