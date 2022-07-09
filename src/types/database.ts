import type { CharInfo } from "./global";
import type { CalcArtPiece, CalcWeapon } from "./calculator";

export type DatabaseState = {
  myChars: DatabaseChar[];
  myWps: MyWps;
  myArts: MyArts;
  chosenChar: string;
};

export type DatabaseChar = {
  weaponID: number;
  artifactIDs: (number | null)[];
} & CharInfo;

type DatabaseWp = {
  user: string | null;
} & CalcWeapon;

export type MyWps = DatabaseWp[];

type DatabaseArt = {
  user: string | null;
} & CalcArtPiece;

export type MyArts = DatabaseArt[];
