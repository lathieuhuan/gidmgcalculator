import type { CharInfo, ModifierInput, ModifierCtrl, TalentBuff, AttackPatternInfoKey } from "@Src/types";
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
  return `Self / ${isAscs ? "Ascension" : "Constellation"} ${level}`;
};

export type TalentBuffConfig = [boolean | undefined, AttackPatternInfoKey, string | readonly [boolean, number], number];

export function talentBuff(...configs: TalentBuffConfig[]) {
  const result: Partial<TalentBuff> = {};

  for (let [condition, attPattKey, descConfig, value] of configs) {
    if (condition) {
      result[attPattKey] = {
        desc: typeof descConfig === "string" ? descConfig : makeTrackerDesc(descConfig[0], descConfig[1]),
        value,
      };
    }
  }
  return result;
}

export function modIsActivated(modCtrls: ModifierCtrl[], index: number) {
  const ctrl = findByIndex(modCtrls, index);
  return ctrl && ctrl.activated;
}

/** activated is not enough for char modifiers, they need to be granted */
export const charModIsInUse = (
  mods: Array<{
    index: number;
    isGranted?: (char: CharInfo) => boolean;
  }>,
  char: CharInfo,
  buffCtrls: ModifierCtrl[],
  index: number
) => {
  const modifier = findByIndex(mods, index);
  return modifier && (!modifier.isGranted || modifier.isGranted(char)) && modIsActivated(buffCtrls, index);
};

export function findInput(
  modCtrls: ModifierCtrl[],
  ctrlIndex: number,
  inputIndex: number,
  defaultValue: ModifierInput = 0
) {
  const ctrl = findByIndex(modCtrls, ctrlIndex);
  return ctrl && ctrl.inputs ? ctrl.inputs[inputIndex] ?? 0 : defaultValue;
}
