import type { CharInfo, ModifierInput } from "@Src/types";
import type { ModifierCtrl, SkillBonusInfoKey } from "@Store/calculatorSlice/types";
import type { AbilityModifier, TalentBuff } from "./types";
import { ascsFromLv, findByIndex } from "@Src/utils";

const makeAscsChecker = (value: number) => (char: CharInfo) => {
  return ascsFromLv(char.level) >= value;
};

const makeConsChecker = (value: number) => (char: CharInfo) => {
  return char.cons >= value;
};

export const checkAscs = {
  1: makeAscsChecker(1),
  4: makeAscsChecker(4),
};

export const checkCons = {
  1: makeConsChecker(1),
  2: makeConsChecker(2),
  4: makeConsChecker(4),
  6: makeConsChecker(6),
};

export const makeTrackerDesc = (isAscs: boolean, level: number) => {
  return `Self / ${isAscs ? "Ascension" : "Constellation"} ${level} activated`;
};

type TalentBuffConfig = [boolean, SkillBonusInfoKey, string | [boolean, number], number];

export function talentBuff(...configs: TalentBuffConfig[]) {
  const result: Partial<TalentBuff> = {};
  for (let config of configs) {
    if (config[0]) {
      let desc = config[2];
      if (Array.isArray(desc)) {
        desc = makeTrackerDesc(...desc);
      }
      result[config[1]] = { desc, value: config[3] };
    }
  }
  if (Object.keys(result)) return result;
}

export function modIsActivated(modCtrls: ModifierCtrl[], index: number) {
  const ctrl = findByIndex(modCtrls, index);
  return ctrl && ctrl.activated;
}

export const charModCtrlIsActivated = (
  mods: AbilityModifier[],
  char: CharInfo,
  buffCtrls: ModifierCtrl[],
  index: number
) => findByIndex(mods, index)?.isGranted(char) && modIsActivated(buffCtrls, index);

export function findInput(
  modCtrls: ModifierCtrl[],
  ctrlIndex: number,
  inputIndex: number,
  defaultValue: ModifierInput
) {
  const ctrl = findByIndex(modCtrls, ctrlIndex);
  return ctrl && ctrl.inputs ? ctrl.inputs[inputIndex] : defaultValue;
}
