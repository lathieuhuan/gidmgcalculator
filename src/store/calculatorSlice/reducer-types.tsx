import type { PayloadAction } from "@reduxjs/toolkit";
import type { DatabaseChar, MyArts, MyWps, Weapon } from "@Src/types";

export interface PickedChar extends Partial<DatabaseChar> {
  name: string;
}
export type InitSessionWithCharAction = PayloadAction<{
  pickedChar: PickedChar;
  myWps: MyWps;
  myArts: MyArts;
}>;

type InputInfo = {
  inputIndex: number;
  value: string | number | boolean;
};

export type ToggleModCtrlPath = {
  modCtrlName:
    | "allSelfBuffCtrls"
    | "allSelfDebuffCtrls"
    | "allWpBuffCtrls"
    | "allArtBuffCtrls"
    | "allSubArtBuffCtrls"
    | "allSubArtDebuffCtrls";
  ctrlIndex: number;
};
export type ToggleModCtrlAction = PayloadAction<ToggleModCtrlPath>;

export type ChangeModCtrlInputAction = PayloadAction<ToggleModCtrlPath & InputInfo>;

export type ToggleTeammateModCtrlPath = {
  teammateIndex: number;
  modCtrlName: "buffCtrls" | "debuffCtrls";
  ctrlIndex: number;
};
export type ToggleTeammateModCtrlAction = PayloadAction<ToggleTeammateModCtrlPath>;

export type ChangeTeammateModCtrlInputAction = PayloadAction<ToggleTeammateModCtrlPath & InputInfo>;

export type ToggleSubWpModCtrlPath = {
  weaponType: Weapon;
  ctrlIndex: number;
};
export type ToggleSubWpModCtrlAction = PayloadAction<ToggleSubWpModCtrlPath>;

export type RefineSubWeaponAction = PayloadAction<ToggleSubWpModCtrlPath & { value: number }>;

export type ChangeSubWpModCtrlInputAction = PayloadAction<ToggleSubWpModCtrlPath & InputInfo>;
