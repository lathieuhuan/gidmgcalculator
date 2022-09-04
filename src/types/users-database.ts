import type { CharInfo } from "./global";
import type {
  CalcArtInfo,
  CalcArtPiece,
  CalcWeapon,
  CustomBuffCtrl,
  CustomDebuffCtrl,
  ElementModCtrl,
  ModifierCtrl,
  Party,
  SetupType,
  SubArtModCtrl,
  SubWeaponComplexBuffCtrl,
  Target,
} from "./calculator";

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

export type UsersSetupCalcInfo = {
  char: CharInfo;
  party: Party;
  weapon: CalcWeapon;
  artInfo: CalcArtInfo;

  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
  wpBuffCtrls: ModifierCtrl[];
  subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl;
  artBuffCtrls: ModifierCtrl[];
  subArtBuffCtrls: SubArtModCtrl[];
  subArtDebuffCtrls: SubArtModCtrl[];
  elmtModCtrls: ElementModCtrl;
  customBuffCtrls: CustomBuffCtrl[];
  customDebuffCtrls: CustomDebuffCtrl[];
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
