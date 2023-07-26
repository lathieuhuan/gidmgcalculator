import type {
  CalcWeapon,
  CharInfo,
  ModifierCtrl,
  UserArtifact,
  UserCharacter,
  UserWeapon,
  WeaponType,
} from "@Src/types";

import { findById, userItemToCalcItem } from "@Src/utils";
import { getArtifactSetBonuses } from "@Src/utils/calculation";
import { createArtifactBuffCtrls, createCharInfo, createWeapon, createWeaponBuffCtrls } from "@Src/utils/creators";

export type PickedChar = Partial<UserCharacter> & {
  name: string;
};

type ParseUserCharacterArgs = {
  pickedChar: PickedChar;
  userWps: UserWeapon[];
  userArts: UserArtifact[];
  weaponType: WeaponType;
  seedID: number;
};
export function parseUserCharacter({
  pickedChar: { name, weaponID, artifactIDs = [null, null, null, null, null], ...info },
  userWps,
  userArts,
  weaponType,
  seedID,
}: ParseUserCharacterArgs) {
  const char: CharInfo = { ...createCharInfo(info), name };

  let weapon: CalcWeapon;
  let wpBuffCtrls: ModifierCtrl[];
  const existedWp = findById(userWps, weaponID);

  if (existedWp) {
    weapon = userItemToCalcItem(existedWp, seedID++);
    wpBuffCtrls = createWeaponBuffCtrls(true, existedWp);
  } //
  else {
    const newWp = createWeapon({ type: weaponType });
    weapon = {
      ID: seedID++,
      ...newWp,
    };
    wpBuffCtrls = createWeaponBuffCtrls(true, newWp);
  }

  const artifacts = artifactIDs.map((id) => {
    const artifact = id ? findById(userArts, id) : undefined;
    return artifact ? userItemToCalcItem(artifact, seedID++) : null;
  });
  const firstSetBonus = getArtifactSetBonuses(artifacts)[0];

  return {
    char,
    weapon,
    wpBuffCtrls,
    artifacts,
    artBuffCtrls: firstSetBonus?.bonusLv ? createArtifactBuffCtrls(true, firstSetBonus) : [],
  };
}
