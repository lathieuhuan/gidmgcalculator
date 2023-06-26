import type {
  CalcWeapon,
  CharInfo,
  ModifierCtrl,
  UserArtifact,
  UserWeapon,
  WeaponType,
} from "@Src/types";
import type { PickedChar } from "./reducer-types";
import type { CalculatorState } from "./types";

import calculateAll from "@Src/calculation";
import { findById, userItemToCalcItem } from "@Src/utils";
import { getArtifactSetBonuses } from "@Src/utils/calculation";
import {
  createArtifactBuffCtrls,
  createCharInfo,
  createWeapon,
  createWeaponBuffCtrls,
} from "@Src/utils/creators";

export function calculate(state: CalculatorState, all?: boolean) {
  try {
    const { activeId, setupManageInfos, setupsById, charData, target } = state;
    const allIds = all ? setupManageInfos.map(({ ID }) => ID) : [activeId];

    for (const id of allIds) {
      const results = calculateAll(setupsById[id], target, charData);
      state.statsById[id] = {
        infusedElement: results.infusedElement,
        totalAttrs: results.totalAttr,
        rxnBonuses: results.rxnBonus,
        dmgResult: results.dmgResult,
      };
    }
  } catch (err) {
    console.log(err);

    state.message = {
      active: true,
      type: "error",
      content: "An unknown error has occurred and prevented the calculation process.",
    };
  }
}

type ParseAndInitDataArgs = {
  pickedChar: PickedChar;
  userWps: UserWeapon[];
  userArts: UserArtifact[];
  weaponType: WeaponType;
  seedID: number;
};
export function parseUserCharData({
  pickedChar: { name, weaponID, artifactIDs = [null, null, null, null, null], ...info },
  userWps,
  userArts,
  weaponType,
  seedID,
}: ParseAndInitDataArgs) {
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
