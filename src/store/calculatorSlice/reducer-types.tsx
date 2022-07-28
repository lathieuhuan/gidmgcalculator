import { MonsterConfig } from "@Data/monsters/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AmplifyingReaction,
  CalcArtPiece,
  DatabaseChar,
  MyArts,
  MyWps,
  Target,
  Vision,
  Weapon,
} from "@Src/types";

export interface PickedChar extends Partial<DatabaseChar> {
  name: string;
}
export type InitSessionWithCharAction = PayloadAction<{
  pickedChar: PickedChar;
  myWps: MyWps;
  myArts: MyArts;
}>;

export type AddTeammateAction = PayloadAction<{
  name: string;
  vision: Vision;
  weapon: Weapon;
  tmIndex: number;
}>;

export type ChangeElementModCtrlAction = PayloadAction<{
  field: "ampRxn" | "infusion_ampRxn";
  value: AmplifyingReaction | null;
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

export type CopyCustomModCtrlsAction = PayloadAction<{
  isBuffs: boolean;
  sourceIndex: number;
}>;

type CustomModCtrlPath = {
  isBuffs: boolean;
  ctrlIndex: number;
};

export type RemoveCustomModCtrlAction = PayloadAction<CustomModCtrlPath>;

export type ChangeCustomModCtrlValueAction = PayloadAction<
  CustomModCtrlPath & {
    value: number;
  }
>;

export type ModifyTargetAction = PayloadAction<{
  key: keyof Target;
  value: number;
}>;

export type ChangeMonsterConfigAction = PayloadAction<{
  inputIndex: number;
  value: MonsterConfig;
}>;

export type UpdateArtPieceAction = PayloadAction<{
  pieceIndex: number;
  newPiece: CalcArtPiece | null;
  isFirstTime?: boolean;
}>;
