import type {
  CalculatorState,
  ModifierInput,
  SubArtModCtrl,
  SubWeaponBuffCtrl,
  SubWeaponComplexBuffCtrl,
  UsersSetup,
  UsersSetupCalcInfo,
  Weapon,
} from "@Src/types";
import { WEAPON_TYPES } from "@Src/constants";
import { initCharModCtrls } from "@Store/calculatorSlice/initiators";
import {
  getAllSubArtBuffCtrls,
  getAllSubArtDebuffCtrls,
  getMainArtBuffCtrls,
  getMainWpBuffCtrls,
  getSubWeaponComplexBuffCtrls,
} from "@Store/calculatorSlice/utils";
import { getCurrentChar } from "./index";

export type DirtyCalcSetupData = Pick<
  CalculatorState,
  | "char"
  | "allSelfBuffCtrls"
  | "allSelfDebuffCtrls"
  | "allWeapons"
  | "allWpBuffCtrls"
  | "allSubWpComplexBuffCtrls"
  | "allArtInfos"
  | "allArtBuffCtrls"
  | "allSubArtBuffCtrls"
  | "allSubArtDebuffCtrls"
  | "allParties"
  | "allElmtModCtrls"
  | "allCustomBuffCtrls"
  | "allCustomDebuffCtrls"
  | "target"
>;

export function cleanCalcSetup(data: DirtyCalcSetupData, index: number): UsersSetupCalcInfo {
  const {
    char,
    allSelfBuffCtrls,
    allSelfDebuffCtrls,
    allWeapons,
    allWpBuffCtrls,
    allSubWpComplexBuffCtrls,
    allArtInfos,
    allArtBuffCtrls,
    allSubArtBuffCtrls,
    allSubArtDebuffCtrls,
    allParties,
    allElmtModCtrls,
    allCustomBuffCtrls,
    allCustomDebuffCtrls,
    target,
  } = data;

  const subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl = {};

  for (const weaponType of WEAPON_TYPES) {
    if (weaponType in allSubWpComplexBuffCtrls[index]) {
      const ctrls = allSubWpComplexBuffCtrls[index][weaponType] || [];

      if (ctrls.length) {
        subWpComplexBuffCtrls[weaponType] = ctrls.filter((ctrl) => ctrl.activated);
      }
    }
  }

  return {
    char: getCurrentChar(char, index),
    party: allParties[index],
    weapon: allWeapons[index],
    artInfo: allArtInfos[index],
    selfBuffCtrls: allSelfBuffCtrls[index].filter((ctrl) => ctrl.activated),
    selfDebuffCtrls: allSelfDebuffCtrls[index].filter((ctrl) => ctrl.activated),
    wpBuffCtrls: allWpBuffCtrls[index].filter((ctrl) => ctrl.activated),
    subWpComplexBuffCtrls,
    artBuffCtrls: allArtBuffCtrls[index].filter((ctrl) => ctrl.activated),
    subArtBuffCtrls: allSubArtBuffCtrls[index].filter((ctrl) => ctrl.activated),
    subArtDebuffCtrls: allSubArtDebuffCtrls[index].filter((ctrl) => ctrl.activated),
    elmtModCtrls: allElmtModCtrls[index],
    customBuffCtrls: allCustomBuffCtrls[index].filter((ctrl) => ctrl.value),
    customDebuffCtrls: allCustomDebuffCtrls[index].filter((ctrl) => ctrl.value),
    target,
  };
}

type Restorable = {
  activated: boolean;
  index: number;
  inputs?: ModifierInput[];
  code?: number;
  refi?: number;
};

export function restoreCalcSetup(data: UsersSetup) {
  function restoreModCtrls(newCtrls: Restorable[], refCtrls: Restorable[]) {
    for (const refCtrl of refCtrls) {
      const i = newCtrls.findIndex(({ code, index }) => {
        return index === refCtrl.index && code === refCtrl.code;
      });

      if (i !== -1) {
        newCtrls[i].activated = true;
        if (refCtrl.inputs && newCtrls[i].inputs) {
          newCtrls[i].inputs = refCtrl.inputs;
        }
      }
    }
    return newCtrls;
  }

  const { char, weapon, artInfo } = data;

  const [selfBuffCtrls, selfDebuffCtrls] = initCharModCtrls(char.name, true);
  const wpBuffCtrls = getMainWpBuffCtrls(weapon);
  const subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl = {};

  for (const key in data.subWpComplexBuffCtrls) {
    const weaponType = key as Weapon;
    const newCtrls = getSubWeaponComplexBuffCtrls(weaponType, weapon.code);
    const refCtrls = data.subWpComplexBuffCtrls[weaponType] || [];

    subWpComplexBuffCtrls[weaponType] = restoreModCtrls(newCtrls, refCtrls) as SubWeaponBuffCtrl[];
  }

  const setCode = artInfo.sets[0]?.bonusLv === 1 ? artInfo.sets[0].code : null;
  const artBuffCtrls = getMainArtBuffCtrls(setCode);
  const subArtBuffCtrls = getAllSubArtBuffCtrls(setCode);
  const subArtDebuffCtrls = getAllSubArtDebuffCtrls();

  const output: UsersSetupCalcInfo = {
    char,
    party: data.party,
    weapon,
    artInfo,
    selfBuffCtrls: restoreModCtrls(selfBuffCtrls, data.selfBuffCtrls),
    selfDebuffCtrls: restoreModCtrls(selfDebuffCtrls, data.selfDebuffCtrls),
    wpBuffCtrls: restoreModCtrls(wpBuffCtrls, data.wpBuffCtrls),
    subWpComplexBuffCtrls,
    artBuffCtrls: restoreModCtrls(artBuffCtrls, data.artBuffCtrls),
    subArtBuffCtrls: restoreModCtrls(subArtBuffCtrls, data.subArtBuffCtrls) as SubArtModCtrl[],
    subArtDebuffCtrls: restoreModCtrls(
      subArtDebuffCtrls,
      data.subArtDebuffCtrls
    ) as SubArtModCtrl[],
    elmtModCtrls: data.elmtModCtrls,
    customBuffCtrls: data.customBuffCtrls,
    customDebuffCtrls: data.customDebuffCtrls,
    target: data.target,
  };

  return output;
}
