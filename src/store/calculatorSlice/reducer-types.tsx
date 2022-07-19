import type { PayloadAction } from "@reduxjs/toolkit";
import type { DatabaseChar, MyArts, MyWps } from "@Src/types";

export interface PickedChar extends Partial<DatabaseChar> {
  name: string;
}
export type InitSessionWithCharAction = PayloadAction<{
  pickedChar: PickedChar;
  myWps: MyWps;
  myArts: MyArts;
}>;

export type ToggleModCtrlPath = {
  modCtrlName:
    | "allSelfBuffCtrls"
    | "allSelfDebuffCtrls"
    | "allWpBuffCtrls"
    | "allArtBuffCtrls"
    | "allSubArtBuffCtrls"
    | "allSubArtDebuffCtrls"
    | "allTmBuffCtrls"
    | "allTmDebuffCtrls";
  index: number;
};
export type ToggleModCtrlAction = PayloadAction<ToggleModCtrlPath>;

type ChangeModCtrlPath = ToggleModCtrlPath & {
  inputIndex: number;
  value: string | number | boolean;
};
export type ChangeModCtrlInputAction = PayloadAction<ChangeModCtrlPath>;
