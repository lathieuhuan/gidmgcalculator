import type {
  FlatStat,
  Level,
  Rarity,
  RngPercentStat,
  Weapon,
} from "@Src/types";

export interface CalculatorState {
  currentSetup: number;
  configs: {
    separateCharInfo: boolean;
    keepArtStatsWhenSwitching: boolean;
  };
  setups: number[];
  char: CalcChar | null;
  charData: CalcCharData | null;
  allSelfModCtrls: CharModCtrl[];
  allWps: CalcWeapon[];
  allSubWpModCtrl: {
    buffCtrls: SubWpBuffCtrl[];
    debuffCtrls: [];
  }[];
  allArts: CalcArt[];
  allParties: CalcParty[];
  allElmtModCtrls: ElmtModCtrl[];
  allCustomMCs: CustomModCtrl[];
  target: {};
  monster: Monster | null;
}
export interface CalcChar {
  level: Level;
  NAs: number;
  ES: number;
  EB: number;
  cons: number;
}
export interface CalcCharData {}
export interface CharModCtrl {
  activated: boolean;
  id: number;
  inputs?: (number | string)[];
}
interface CalcWeapon {
  type: Weapon;
  code: number;
  level: Level;
  refinement: number;
}
interface SubWpBuffCtrl {
  code: number;
  activated: boolean;
  refinement: number;
  index: number;
}
interface CalcArt {
  sets: { code: number; bonusLv: 0 | 1 }[];
  pieces: CalcArtPiece[];
}
interface CalcArtPiece {
  code: number;
  rarity: Rarity;
  mainStatType: FlatStat | RngPercentStat;
}
interface CalcParty {}
interface ElmtModCtrl {}
interface CustomModCtrl {}
interface Monster {}
