import type { CalcSetup, ModifierInput, Party, SubArtModCtrl } from "@Src/types";
import { initCharModCtrls } from "@Store/calculatorSlice/initiators";
import {
  getAllSubArtBuffCtrls,
  getAllSubArtDebuffCtrls,
  getMainArtBuffCtrls,
  getMainWpBuffCtrls,
} from "@Store/calculatorSlice/utils";
import { findCharacter } from "@Data/controllers";
import { findByIndex } from "./index";

export function cleanCalcSetup(data: CalcSetup): CalcSetup {
  const { buffs = [], debuffs = [] } = findCharacter(data.char) || {};
  const party: Party = [];

  for (const teammate of data.party) {
    if (teammate) {
      // #to-do
      party.push({
        name: teammate.name,
        buffCtrls: teammate.buffCtrls.filter((ctrl) => ctrl.activated),
        debuffCtrls: teammate.debuffCtrls.filter((ctrl) => ctrl.activated),
        weapon: {
          code: 0,
          refi: 1,
          type: "bow",
          buffCtrls: [],
        },
        artifact: {
          code: 0,
          buffCtrls: [],
          debuffCtrls: [],
        },
      });
    }
  }
  if (party.length < 3) {
    party.push(...Array(3 - party.length).fill(null));
  }

  return {
    ...data,
    selfBuffCtrls: data.selfBuffCtrls.filter((ctrl) => {
      const buff = findByIndex(buffs, ctrl.index);
      return buff ? ctrl.activated && (!buff.isGranted || buff.isGranted(data.char)) : false;
    }),
    selfDebuffCtrls: data.selfDebuffCtrls.filter((ctrl) => {
      const debuff = findByIndex(debuffs, ctrl.index);
      return debuff ? ctrl.activated && (!debuff.isGranted || debuff.isGranted(data.char)) : false;
    }),
    wpBuffCtrls: data.wpBuffCtrls.filter((ctrl) => ctrl.activated),
    party,
    artBuffCtrls: data.artBuffCtrls.filter((ctrl) => ctrl.activated),
    subArtBuffCtrls: data.subArtBuffCtrls.filter((ctrl) => ctrl.activated),
    subArtDebuffCtrls: data.subArtDebuffCtrls.filter((ctrl) => ctrl.activated),
    customBuffCtrls: data.customBuffCtrls.filter((ctrl) => ctrl.value),
    customDebuffCtrls: data.customDebuffCtrls.filter((ctrl) => ctrl.value),
  };
}

type Restorable = {
  activated: boolean;
  index: number;
  inputs?: ModifierInput[];
  code?: number;
  refi?: number;
};

export function restoreCalcSetup(data: CalcSetup) {
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
  const party: Party = [];

  for (const index of [0, 1, 2]) {
    const teammate = data.party[index];

    if (teammate) {
      const [buffCtrls, debuffCtrls] = initCharModCtrls(teammate.name, false);
      // #to-do
      party.push({
        name: teammate.name,
        buffCtrls: restoreModCtrls(buffCtrls, teammate.buffCtrls),
        debuffCtrls: restoreModCtrls(debuffCtrls, teammate.debuffCtrls),
        weapon: {
          code: 0,
          refi: 1,
          type: "bow",
          buffCtrls: [],
        },
        artifact: {
          code: 0,
          buffCtrls: [],
          debuffCtrls: [],
        },
      });
    } else {
      party.push(null);
    }
  }

  const setCode = artInfo.sets[0]?.bonusLv === 1 ? artInfo.sets[0].code : null;
  const artBuffCtrls = getMainArtBuffCtrls(setCode);
  const subArtBuffCtrls = getAllSubArtBuffCtrls(setCode);
  const subArtDebuffCtrls = getAllSubArtDebuffCtrls();

  const output: CalcSetup = {
    ...data,
    selfBuffCtrls: restoreModCtrls(selfBuffCtrls, data.selfBuffCtrls),
    selfDebuffCtrls: restoreModCtrls(selfDebuffCtrls, data.selfDebuffCtrls),
    wpBuffCtrls: restoreModCtrls(wpBuffCtrls, data.wpBuffCtrls),
    party,
    artBuffCtrls: restoreModCtrls(artBuffCtrls, data.artBuffCtrls),
    subArtBuffCtrls: restoreModCtrls(subArtBuffCtrls, data.subArtBuffCtrls) as SubArtModCtrl[],
    subArtDebuffCtrls: restoreModCtrls(
      subArtDebuffCtrls,
      data.subArtDebuffCtrls
    ) as SubArtModCtrl[],
  };

  return output;
}
