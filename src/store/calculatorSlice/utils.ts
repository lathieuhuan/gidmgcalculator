import type { MyArts, MyWps } from "@Src/types";
import type { PickedChar } from "./reducer-types";
import { findById } from "@Src/utils";
import { initCharInfo } from "./initiators";

export function parseAndInitData(
  { name, weaponID, artifactIDs = [null, null, null, null, null], ...info }: PickedChar,
  myWps: MyWps,
  myArts: MyArts
) {
  const char = { name, ...initCharInfo(info) };

  let wp;
  if (weaponID) {
    const existedWp = findById(myWps, weaponID);
    if (existedWp) {
      const { user, ...weapon } = existedWp;
      wp = {
        ...weapon,
        BCs: getMainWpBCs(existedWp),
      };
    }
  } else {
    const newWp = initWeapon({ type: findCharacter(char).weapon });
    wp = { ...newWp, BCs: getMainWpBCs(newWp) };
  }

  const pieces = artIDs.map((id) => {
    const artP = findById(myArts, id);
    if (artP) {
      const { user, ...info } = artP;
      return info;
    }
    return null;
  });
  const sets = getArtSets(pieces);
  const setCode = sets[0]?.bonusLv === 1 ? sets[0].code : null;
  const art = {
    pieces,
    sets,
    BCs: getMainArtBCs(setCode),
    subBCs: getSubArtBCs(setCode),
    subDCs: getSubArtDCs(),
  };
  return [char, wp, art];
}
