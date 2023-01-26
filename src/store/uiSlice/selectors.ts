import type { RootState } from "@Store/index";

export const selectAtScreen = (state: RootState) => state.ui.atScreen;

export const selectTrackerModalState = (state: RootState) => state.ui.trackerModalState;
