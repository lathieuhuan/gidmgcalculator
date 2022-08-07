import { PayloadAction } from "@reduxjs/toolkit";
import { Artifact, CalcArtPieceSubStatInfo, Weapon } from "@Src/types";

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
