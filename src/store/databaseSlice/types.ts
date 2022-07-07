import type { Level } from "@Src/types";

export interface DatabaseState {
  myChars: DatabaseChar[];
  myWps: [];
  myArts: [];
  chosenChar: string;
}

interface DatabaseChar {
  name: string;
  level: Level;
  NAs: number;
  ES: number;
  EB: number;
  cons: number;
  weaponId: number;
  artifactIds: (number | null)[]
}
