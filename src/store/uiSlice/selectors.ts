import type { RootState } from "@Store/index";

export const selectAtScreen = (state: RootState) => state.ui.atScreen;

export const selectMySetupModalType = (state: RootState) => state.ui.mySetupsModalType;
