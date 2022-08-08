import { CalcArtSet, UsersArtifact } from "@Src/types";

export type Details = "weapon" | "setBonus" | "statsBonus" | number;

export type ArtifactInfo = {
  pieces: (UsersArtifact | null)[];
  sets: CalcArtSet[];
};
