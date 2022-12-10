import { CalcArtSet, UserArtifact } from "@Src/types";

export type Details = "weapon" | "setBonus" | "statsBonus" | number;

export type ArtifactInfo = {
  pieces: (UserArtifact | null)[];
  sets: CalcArtSet[];
};
