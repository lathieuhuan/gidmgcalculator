import type { CharInfo } from "./global";
import type { CalcArtPiece, CalcWeapon } from "./calculator";

export type DatabaseState = {
  myChars: DatabaseChar[];
  myWps: MyWps;
  myArts: MyArts;
  chosenChar: string;
};

export type DatabaseChar = CharInfo & {
  weaponID: number;
  artifactIDs: (number | null)[];
};

export type DatabaseWp = CalcWeapon & {
  user: string | null;
};

export type MyWps = DatabaseWp[];

export type DatabaseArt = CalcArtPiece & {
  user: string | null;
};

export type MyArts = DatabaseArt[];
