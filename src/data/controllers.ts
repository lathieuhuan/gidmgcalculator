import { Artifact } from "@Src/types";
import { findByCode, findByName } from "@Src/utils";
import artifacts from "./artifacts";
import characters from "./characters";

export const findCharacter = (name: string) => findByName(characters, name);

export const findArtifactSet = (code: number) => findByCode(artifacts, code);

export function findArtifactPiece(code: number, type: Artifact) {
  const tgSet = findByCode(artifacts, code)!;
  const { name, icon } = tgSet[type];
  return { beta: tgSet.beta, name, icon };
}
