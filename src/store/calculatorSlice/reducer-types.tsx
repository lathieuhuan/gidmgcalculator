import type { PayloadAction } from "@reduxjs/toolkit";
import type { DatabaseChar, MyArts, MyWps } from "@Store/databaseSlice/types";

export interface PickedChar extends Partial<DatabaseChar> {
  name: string;
}
export type InitSessionWithCharAction = PayloadAction<{
  pickedChar: PickedChar;
  myWps: MyWps;
  myArts: MyArts;
}>;
