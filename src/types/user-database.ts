import type { CalcArtPiece, CalcSetup, CalcWeapon, SetupType, Target } from "./calculator";
import type { CharInfo } from "./global";

export type UserDatabaseState = {
  myChars: UserCharacter[];
  myWps: UserWeapon[];
  myArts: UserArtifact[];
  mySetups: (UserSetup | UserComplexSetup)[];
  chosenChar: string;
  chosenSetupID: number;
};

export type UserCharacter = CharInfo & {
  weaponID: number;
  artifactIDs: (number | null)[];
};

export type UserWeapon = CalcWeapon & {
  owner: string | null;
  setupIDs?: number[];
};

export type UserArtifact = CalcArtPiece & {
  owner: string | null;
  setupIDs?: number[];
};

export type UserSetupCalcInfo = Omit<CalcSetup, "weapon" | "artInfo"> & {
  weaponID: number;
  artifactIDs: (number | null)[];
  target: Target;
};

export type UserSetup = UserSetupCalcInfo & {
  ID: number;
  type: Exclude<SetupType, "complex">;
  name: string;
};

export type UserComplexSetup = {
  ID: number;
  type: "complex";
  name: string;
  shownID: number;
  allIDs: Record<string, number>;
};
