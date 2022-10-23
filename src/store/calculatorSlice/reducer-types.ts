import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AmplifyingReaction,
  CalcArtPiece,
  CalcArtPieceSubStatInfo,
  UsersCharacter,
  UsersArtifact,
  UsersWeapon,
  Vision,
  Weapon,
  UsersSetup,
  CalcSetupManageInfo,
  ArtPieceMainStat,
  CalcSetup,
  CustomBuffCtrl,
  CustomDebuffCtrl,
} from "@Src/types";
import type { CalcConfigurations, CalculatorState } from "./types";

export type UpdateCalculatorAction = PayloadAction<
  Partial<Pick<CalculatorState, "activeId" | "standardId" | "comparedIds" | "isError">>
>;

export type PickedChar = Partial<UsersCharacter> & {
  name: string;
};
export type InitSessionWithCharAction = PayloadAction<{
  pickedChar: PickedChar;
  myWps: UsersWeapon[];
  myArts: UsersArtifact[];
}>;

export type AddTeammateAction = PayloadAction<{
  name: string;
  vision: Vision;
  weapon: Weapon;
  tmIndex: number;
}>;

export type UpdateCalcSetupAction = PayloadAction<
  Partial<CalcSetup> & {
    setupId?: number;
  }
>;

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

type CustomBuffCtrlChange = Partial<CustomDebuffCtrl> & {
  index: number;
};
export type UpdateCustomBuffCtrlsAction = PayloadAction<
  | {
      actionType: "add" | "replace";
      ctrls: CustomBuffCtrl | CustomBuffCtrl[];
    }
  | {
      actionType: "edit";
      ctrls: CustomBuffCtrlChange | CustomBuffCtrlChange[];
    }
>;

type CustomDebuffCtrlChange = Partial<CustomDebuffCtrl> & {
  index: number;
};
export type UpdateCustomDebuffCtrlsAction = PayloadAction<
  | {
      actionType: "add" | "replace";
      ctrls: CustomDebuffCtrl | CustomDebuffCtrl[];
    }
  | {
      actionType: "edit";
      ctrls: CustomDebuffCtrlChange | CustomDebuffCtrlChange[];
    }
>;

type CustomModCtrlPath = {
  isBuffs: boolean;
  ctrlIndex: number;
};

export type RemoveCustomModCtrlAction = PayloadAction<CustomModCtrlPath>;

export type ChangeArtPieceAction = PayloadAction<{
  pieceIndex: number;
  newPiece: CalcArtPiece | null;
  isFresh?: boolean;
}>;

export type UpdateArtPieceAction = PayloadAction<{
  pieceIndex: number;
  level?: number;
  mainStatType?: ArtPieceMainStat;
  subStat?: {
    index: number;
    newInfo: Partial<CalcArtPieceSubStatInfo>;
  };
}>;

export type NewSetupManageInfo = CalcSetupManageInfo & {
  status: "OLD" | "NEW" | "DUPLICATE";
};

export type ApplySettingsAction = PayloadAction<{
  newSetupManageInfos: NewSetupManageInfo[];
  newConfigs: CalcConfigurations;
  removedSetupIds: number[];
}>;

export type ImportSetupAction = PayloadAction<{
  data: UsersSetup;
  shouldOverwriteChar: boolean;
  shouldOverwriteTarget: boolean;
}>;
