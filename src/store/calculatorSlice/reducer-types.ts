import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  CalcArtifact,
  ArtifactSubStat,
  ElementType,
  WeaponType,
  CalcSetupManageInfo,
  AttributeStat,
  CalcSetup,
  CustomBuffCtrl,
  CustomDebuffCtrl,
  TeammateWeapon,
  TeammateArtifact,
  SetupImportInfo,
  PartiallyRequired,
} from "@Src/types";
import type { CalculatorState } from "./types";

export type UpdateCalculatorAction = PayloadAction<
  Partial<Pick<CalculatorState, "activeId" | "standardId" | "comparedIds">>
>;

export type InitNewSessionPayload = PartiallyRequired<SetupImportInfo, "calcSetup">;

export type ImportSetupAction = PayloadAction<{
  importInfo: PartiallyRequired<SetupImportInfo, "calcSetup" | "target">;
  shouldOverwriteChar: boolean;
  shouldOverwriteTarget: boolean;
}>;

export type AddTeammateAction = PayloadAction<{
  name: string;
  elementType: ElementType;
  weaponType: WeaponType;
  teammateIndex: number;
}>;

export type UpdateTeammateWeaponAction = PayloadAction<
  {
    teammateIndex: number;
  } & Partial<TeammateWeapon>
>;

export type UpdateTeammateArtifactAction = PayloadAction<
  {
    teammateIndex: number;
  } & Partial<TeammateArtifact>
>;

export type UpdateCalcSetupAction = PayloadAction<
  Partial<CalcSetup> & {
    setupId?: number;
  }
>;

type InputInfo = {
  inputIndex: number;
  value: number;
};

export type ToggleModCtrlPath = {
  modCtrlName: "selfBuffCtrls" | "selfDebuffCtrls" | "wpBuffCtrls" | "artBuffCtrls" | "artDebuffCtrls";
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
  weaponType: WeaponType;
  ctrlIndex: number;
};

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

export type ChangeArtifactAction = PayloadAction<{
  pieceIndex: number;
  newPiece: CalcArtifact | null;
  shouldKeepStats?: boolean;
}>;

export type UpdateArtifactAction = PayloadAction<{
  pieceIndex: number;
  level?: number;
  mainStatType?: AttributeStat;
  subStat?: {
    index: number;
    newInfo: Partial<ArtifactSubStat>;
  };
}>;

export type NewSetupManageInfo = CalcSetupManageInfo & {
  status: "REMOVED" | "OLD" | "NEW" | "DUPLICATE";
  originId?: number;
  isCompared: boolean;
};

export type UpdateSetupsAction = PayloadAction<{
  newSetupManageInfos: NewSetupManageInfo[];
  newStandardId: number;
}>;

export type ApplySettingsAction = PayloadAction<{
  doMergeCharInfo?: boolean;
}>;
