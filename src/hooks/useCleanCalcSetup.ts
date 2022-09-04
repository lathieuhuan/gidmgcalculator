import type { ModifierCtrl, SubWeaponComplexBuffCtrl, UsersSetup } from "@Src/types";
import { WEAPON_TYPES } from "@Src/constants";
import { getCurrentChar } from "@Src/utils";
import { useSelector } from "@Store/hooks";

export function useCleanCalcSetup(index: number): UsersSetup {
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
    monster,
  } = useSelector((state) => state.calculator);

  function remove(ctrls: ModifierCtrl[]) {
    return ctrls.filter((ctrl) => ctrl.activated);
  }

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
    ID: Date.now(),
    type: "original",
    name: "",
    char: getCurrentChar(char, index),
    party: allParties[index],
    weapon: allWeapons[index],
    artInfo: allArtInfos[index],
    selfBuffCtrls: remove(allSelfBuffCtrls[index]),
    selfDebuffCtrls: remove(allSelfDebuffCtrls[index]),
    wpBuffCtrls: remove(allWpBuffCtrls[index]),
    subWpComplexBuffCtrls,
    artBuffCtrls: remove(allArtBuffCtrls[index]),
    subArtBuffCtrls: allSubArtBuffCtrls[index].filter((ctrl) => ctrl.activated),
    subArtDebuffCtrls: allSubArtDebuffCtrls[index].filter((ctrl) => ctrl.activated),
    elmtModCtrls: allElmtModCtrls[index],
    customBuffCtrls: allCustomBuffCtrls[index].filter((ctrl) => ctrl.value),
    customDebuffCtrls: allCustomDebuffCtrls[index].filter((ctrl) => ctrl.value),
    target,
  };
}
