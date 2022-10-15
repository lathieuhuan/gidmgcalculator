import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AmplifyingReaction,
  CalcArtPiece,
  CalcArtPieceSubStatInfo,
  UsersCharacter,
  UsersArtifact,
  UsersWeapon,
  Target,
  Vision,
  Weapon,
  UsersSetup,
  CalcSetupManageInfo,
  ArtPieceMainStat,
} from "@Src/types";
import type { CalcConfigurations } from "./types";

export type PickedChar = Partial<UsersCharacter> & {
  name: string;
};
export type InitSessionWithCharAction = PayloadAction<{
  pickedChar: PickedChar;
  myWps: UsersWeapon[];
  myArts: UsersArtifact[];
}>;

export type UpdateArtPieceAction = PayloadAction<{
  pieceIndex: number;
  level?: number;
  mainStatType?: ArtPieceMainStat;
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
    | "selfBuffCtrls"
    | "selfDebuffCtrls"
    | "wpBuffCtrls"
    | "artBuffCtrls"
    | "subArtBuffCtrls"
    | "subArtDebuffCtrls";
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
  sourceID: number;
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

export type ChangeArtPieceAction = PayloadAction<{
  pieceIndex: number;
  newPiece: CalcArtPiece | null;
  isFresh?: boolean;
}>;

type ArtPieceSubStatPath = {
  pieceIndex: number;
  subStatIndex: number;
};

export type ChangeArtPieceSubStatAction = PayloadAction<
  ArtPieceSubStatPath & Partial<CalcArtPieceSubStatInfo>
>;

export type NewSetupManageInfo = CalcSetupManageInfo & {
  status: "OLD" | "NEW" | "DUPLICATE";
};

export type ApplySettingsOnCalculatorAction = PayloadAction<{
  newSetupManageInfos: NewSetupManageInfo[];
  newConfigs: CalcConfigurations;
  removedSetupIDs: number[];
}>;

export type ImportSetupAction = PayloadAction<{
  data: UsersSetup;
  shouldOverwriteChar: boolean;
  shouldOverwriteTarget: boolean;
}>;