import type { CharInfo } from "./global";
import type { CalcArtPiece, CalcWeapon } from "./calculator";

export type DatabaseState = {
  myChars: DatabaseChar[];
  myWps: DatabaseWp[];
  myArts: DatabaseArt[];
  chosenChar: string;
};

export type DatabaseChar = CharInfo & {
  weaponID: number;
  artifactIDs: (number | null)[];
};

export type DatabaseWp = CalcWeapon & {
  user: string | null;
};

export type DatabaseArt = CalcArtPiece & {
  user: string | null;
};
