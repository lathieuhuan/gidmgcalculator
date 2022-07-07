import type { CharInfo, Level } from "@Src/types";

export interface DatabaseState {
  myChars: DatabaseChar[];
  myWps: [];
  myArts: [];
  chosenChar: string;
}

interface DatabaseChar extends CharInfo {
  weaponId: number;
  artifactIds: (number | null)[];
}
