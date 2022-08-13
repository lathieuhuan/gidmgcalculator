import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Artifact,
  CalcArtPieceSubStatInfo,
  UsersArtifact,
  UsersCharacter,
  UsersComplexSetup,
  UsersSetup,
  UsersWeapon,
  Weapon,
} from "@Src/types";

export type AddUsersDatabaseAction = PayloadAction<{
  Characters: UsersCharacter[];
  Weapons: UsersWeapon[];
  Artifacts: UsersArtifact[];
  Setups: (UsersSetup | UsersComplexSetup)[];
}>;

export type ChangeUsersCharTalentLevelAction = PayloadAction<{
  name: string;
  type: "NAs" | "ES" | "EB";
  level: number;
}>;

export type ChangeUsersArtifactSubStatAction = PayloadAction<
  { ID: number; subStatIndex: number } & Partial<CalcArtPieceSubStatInfo>
>;

export type RemoveArtifactAction = PayloadAction<{
  ID: number;
  owner: string | null;
  type: Artifact;
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
