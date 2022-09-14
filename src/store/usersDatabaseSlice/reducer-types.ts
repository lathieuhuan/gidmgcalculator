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

export type UpdateUsersWeaponAction = PayloadAction<{
  ID: number;
  level?: Level;
  refi?: number;
}>;

export type UpdateUsersArtifactAction = PayloadAction<{
  ID: number;
  level?: number;
  mainStatType?: ArtPieceMainStat;
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
