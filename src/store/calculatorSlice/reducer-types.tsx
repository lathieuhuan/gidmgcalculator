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

export type ArtModCtrlPath = {
  modCtrlName: "allArtInfos";
  field: "buffCtrls" | "subBuffCtrls" | "subDebuffCtrls";
  index: number;
};
export type ToggleModCtrlAction = PayloadAction<ArtModCtrlPath>;
