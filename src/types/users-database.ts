import type { CalcArtPiece, CalcSetup, CalcWeapon, SetupType, Target } from "./calculator";
import type { CharInfo } from "./global";

export type UsersDatabaseState = {
  myChars: UsersCharacter[];
  myWps: UsersWeapon[];
  myArts: UsersArtifact[];
  mySetups: (UsersSetup | UsersComplexSetup)[];
  chosenChar: string;
  chosenSetupID: number;
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

export type UsersSetupCalcInfo = CalcSetup & {
  target: Target;
};

export type UsersSetup = UsersSetupCalcInfo & {
  ID: number;
  type: Exclude<SetupType, "complex">;
  name: string;
};

export type UsersComplexSetup = {
  ID: number;
  type: "complex";
  name: string;
  shownID: number;
  allIDs: Record<string, number>;
};
