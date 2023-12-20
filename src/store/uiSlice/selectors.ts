import type { RootState } from "@Store/index";

export const selectMySetupModalType = (state: RootState) => state.ui.mySetupsModalType;
