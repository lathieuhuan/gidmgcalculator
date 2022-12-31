import type {
  CalcSetup,
  ModifierInput,
  Party,
  UserComplexSetup,
  UserSetup,
  UserSetupCalcInfo,
} from "@Src/types";
import type { CalculatorState } from "@Store/calculatorSlice/types";

import { findDataCharacter } from "@Data/controllers";
import { getArtifactBuffCtrls, getWeaponBuffCtrls } from "@Store/calculatorSlice/utils";
import { deepCopy, findByIndex } from "./pure-utils";
import { getArtifactSetBonuses } from "./calculation";
import { createCharModCtrls } from "./creators";

export function isUserSetup(setup: UserSetup | UserComplexSetup): setup is UserSetup {
  return ["original", "combined"].includes(setup.type);
}

interface CleanupCalcSetupOptions {
  weaponID?: number;
  artifactIDs?: (number | null)[];
}
export function cleanupCalcSetup(
  calculator: CalculatorState,
  setupID: number,
  options?: CleanupCalcSetupOptions
): UserSetupCalcInfo {
  const { char, weapon, artifacts, ...data } = calculator.setupsById[setupID];
  const { buffs = [], debuffs = [] } = findDataCharacter(char) || {};
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
    char,
    ...data,
    weaponID: options?.weaponID || weapon.ID,
    artifactIDs: options?.artifactIDs || artifacts.map((artifact) => artifact?.ID ?? null),
    selfBuffCtrls: data.selfBuffCtrls.filter((ctrl) => {
      const buff = findByIndex(buffs, ctrl.index);
      return buff ? ctrl.activated && (!buff.isGranted || buff.isGranted(char)) : false;
    }),
    selfDebuffCtrls: data.selfDebuffCtrls.filter((ctrl) => {
      const debuff = findByIndex(debuffs, ctrl.index);
      return debuff ? ctrl.activated && (!debuff.isGranted || debuff.isGranted(char)) : false;
    }),
    wpBuffCtrls: data.wpBuffCtrls.filter((ctrl) => ctrl.activated),
    party,
    artBuffCtrls: data.artBuffCtrls.filter((ctrl) => ctrl.activated),
    artDebuffCtrls: data.artDebuffCtrls.filter((ctrl) => ctrl.activated),
    customBuffCtrls: data.customBuffCtrls.filter((ctrl) => ctrl.value),
    customDebuffCtrls: data.customDebuffCtrls.filter((ctrl) => ctrl.value),
    target: calculator.target,
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

  const [selfBuffCtrls, selfDebuffCtrls] = createCharModCtrls(data.char.name, true);
  const wpBuffCtrls = getWeaponBuffCtrls(true, data.weapon);
  const party: Party = [];

  for (const index of [0, 1, 2]) {
    const teammate = data.party[index];

    if (teammate) {
      const [buffCtrls, debuffCtrls] = createCharModCtrls(teammate.name, false);
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

  const setBonuses = getArtifactSetBonuses(data.artifacts);
  const artBuffCtrls = setBonuses[0]?.bonusLv ? getArtifactBuffCtrls(true, setBonuses[0]) : [];

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
