import { CalcArtifact } from "@Src/types";
import { ARTIFACT_MAIN_STATS } from "./constants";

export function artifactMainStatValue(artPiece: CalcArtifact) {
  const { type, level, rarity = 5, mainStatType } = artPiece;
  const mainStat = ARTIFACT_MAIN_STATS[type][mainStatType]![rarity][level];
  return mainStat;
}
