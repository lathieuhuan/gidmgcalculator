import { RootState } from "..";

export const selectUserWps = (state: RootState) => state.database.userWps;

export const selectUserArts = (state: RootState) => state.database.userArts;

export const selectUserChars = (state: RootState) => state.database.userChars;

export const selectUserSetups = (state: RootState) => state.database.userSetups;

export const selectChosenChar = (state: RootState) => state.database.chosenChar;

export const selectChosenSetupID = (state: RootState) => state.database.chosenSetupID;
