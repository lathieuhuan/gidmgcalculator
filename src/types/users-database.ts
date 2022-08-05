import type { CharInfo } from "./global";
import type { CalcArtPiece, CalcWeapon } from "./calculator";

export type UsersDatabaseState = {
  myChars: UsersCharacter[];
  myWps: UsersWeapon[];
  myArts: UsersArtifact[];
  chosenChar: string;
};

export type UsersCharacter = CharInfo & {
  weaponID: number;
  artifactIDs: (number | null)[];
};

export type UsersWeapon = CalcWeapon & {
  owner: string | null;
};

export type UsersArtifact = CalcArtPiece & {
  owner: string | null;
};
