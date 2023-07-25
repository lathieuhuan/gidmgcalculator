import { MySetupsModalType } from "@Store/uiSlice/types";

export type OpenModalFn = (type: MySetupsModalType) => () => void;
