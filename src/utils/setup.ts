import type { CalcSetup, ModifierInput, Party } from "@Src/types";
import { initCharModCtrls } from "@Store/calculatorSlice/initiators";
import { getArtifactBuffCtrls, getWeaponBuffCtrls } from "@Store/calculatorSlice/utils";
import { findCharacter } from "@Data/controllers";
import { deepCopy, findByIndex } from "./index";

export function cleanCalcSetup(data: CalcSetup): CalcSetup {
  const { buffs = [], debuffs = [] } = findCharacter(data.char) || {};
  const party: Party = [];

  for (const teammate of data.party) {
    if (teammate) {
      party.push({
        name: teammate.name,
        buffCtrls: teammate.buffCtrls.filter((ctrl) => ctrl.activated),
        debuffCtrls: teammate.debuffCtrls.filter((ctrl) => ctrl.activated),
        weapon: teammate.weapon,
        artifact: teammate.artifact,
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
    artDebuffCtrls: data.artDebuffCtrls.filter((ctrl) => ctrl.activated),
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
  const wpBuffCtrls = getWeaponBuffCtrls(true, weapon);
  const party: Party = [];

  for (const index of [0, 1, 2]) {
    const teammate = data.party[index];

    if (teammate) {
      const [buffCtrls, debuffCtrls] = initCharModCtrls(teammate.name, false);
      party.push({
        name: teammate.name,
        buffCtrls: restoreModCtrls(buffCtrls, teammate.buffCtrls),
        debuffCtrls: restoreModCtrls(debuffCtrls, teammate.debuffCtrls),
        weapon: deepCopy(teammate.weapon),
        artifact: deepCopy(teammate.artifact),
      });
    } else {
      party.push(null);
    }
  }

  const artBuffCtrls = artInfo.sets[0]?.bonusLv ? getArtifactBuffCtrls(true, artInfo.sets[0]) : [];

  // #to-do restore subArtBuffCtrls & subArtDebuffCtrls
  const output: CalcSetup = {
    ...data,
    selfBuffCtrls: restoreModCtrls(selfBuffCtrls, data.selfBuffCtrls),
    selfDebuffCtrls: restoreModCtrls(selfDebuffCtrls, data.selfDebuffCtrls),
    wpBuffCtrls: restoreModCtrls(wpBuffCtrls, data.wpBuffCtrls),
    party,
    artBuffCtrls: restoreModCtrls(artBuffCtrls, data.artBuffCtrls),
  };

  return output;
}
