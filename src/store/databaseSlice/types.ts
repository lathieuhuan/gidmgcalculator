import type { CharInfo } from "@Src/types";
import type { CalcArtPiece, CalcWeapon } from "@Store/calculatorSlice/types";

export interface DatabaseState {
  myChars: DatabaseChar[];
  myWps: MyWps;
  myArts: MyArts;
  chosenChar: string;
}

export interface DatabaseChar extends CharInfo {
  weaponID: number;
  artifactIDs: (number | null)[];
}

interface DatabaseWp extends CalcWeapon {
  user: string | null;
}
export type MyWps = DatabaseWp[];

interface DatabaseArt extends CalcArtPiece {
  user: string | null;
}
export type MyArts = DatabaseArt[];
