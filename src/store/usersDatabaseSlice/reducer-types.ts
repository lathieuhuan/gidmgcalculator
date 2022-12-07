import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Artifact,
  ArtPieceMainStat,
  CalcArtPieceSubStatInfo,
  Level,
  PartiallyRequired,
  UsersArtifact,
  UsersCharacter,
  UsersComplexSetup,
  UsersSetup,
  UsersSetupCalcInfo,
  UsersWeapon,
  Weapon,
} from "@Src/types";

export type AddUsersDatabaseAction = PayloadAction<{
  Characters: UsersCharacter[];
  Weapons: UsersWeapon[];
  Artifacts: UsersArtifact[];
  Setups: (UsersSetup | UsersComplexSetup)[];
}>;

export type UpdateUsersCharacterAction = PayloadAction<
  PartiallyRequired<Partial<UsersCharacter>, "name">
>;

export type UpdateUsersArtifactSubStatAction = PayloadAction<
  { ID: number; subStatIndex: number } & Partial<CalcArtPieceSubStatInfo>
>;

export type RemoveArtifactAction = PayloadAction<{
  ID: number;
  owner: string | null;
  type: Artifact;
}>;

export type UpdateUsersWeaponAction = PayloadAction<
  Partial<Omit<UsersWeapon, "ID">> & {
    index?: number;
    ID: number;
  }
>;

export type UpdateUsersArtifactAction = PayloadAction<{
  index?: number;
  ID: number;
  level?: number;
  mainStatType?: ArtPieceMainStat;
  setupIDs?: number[];
}>;

export type RemoveWeaponAction = PayloadAction<{ ID: number; owner: string | null; type: Weapon }>;

export type UnequipArtifactAction = PayloadAction<{
  owner: string | null;
  artifactID: number;
  artifactIndex: number;
}>;

type SwitchArgs = {
  /**
   * Owner of the target item
   */
  newOwner: string | null;
  newID: number;
  oldOwner: string;
  oldID: number;
};

export type SwitchWeaponAction = PayloadAction<SwitchArgs>;

export type SwitchArtifactAction = PayloadAction<
  SwitchArgs & {
    artifactIndex: number;
  }
>;

export type SaveSetupAction = PayloadAction<{
  ID: number;
  name: string;
  data: UsersSetupCalcInfo;
}>;

export type CombineSetupsAction = PayloadAction<{
  name: string;
  pickedIDs: number[];
}>;

export type SwitchShownSetupInComplexAction = PayloadAction<{
  complexID: number;
  shownID: number;
}>;

export type AddSetupToComplexAction = PayloadAction<{
  complexID: number;
  pickedIDs: number[];
}>;
