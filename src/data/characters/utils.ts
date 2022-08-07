import type {
  CharInfo,
  ModifierInput,
  ModifierCtrl,
  TalentBuff,
  AttackPatternInfoKey,
} from "@Src/types";
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

type TalentBuffConfig = [
  boolean | undefined,
  AttackPatternInfoKey,
  string | readonly [boolean, number],
  number
];

export function talentBuff(...configs: TalentBuffConfig[]) {
  const result: Partial<TalentBuff> = {};

  for (let [condition, attPattKey, descConfig, value] of configs) {
    if (condition) {
      let desc = "";
      if (Array.isArray(descConfig)) {
        desc = makeTrackerDesc(descConfig[0], descConfig[1]);
      }
      result[attPattKey] = { desc, value };
    }
  }
  if (Object.keys(result)) return result;
}

export function modIsActivated(modCtrls: ModifierCtrl[], index: number) {
  const ctrl = findByIndex(modCtrls, index);
  return ctrl && ctrl.activated;
}

export const charModCtrlIsActivated = (
  mods: {
    index: number;
    isGranted: (char: CharInfo) => boolean;
  }[],
  char: CharInfo,
  buffCtrls: ModifierCtrl[],
  index: number
) => findByIndex(mods, index)?.isGranted(char) && modIsActivated(buffCtrls, index);

export function findInput(
  modCtrls: ModifierCtrl[],
  ctrlIndex: number,
  inputIndex: number,
  defaultValue: ModifierInput = 0
) {
  const ctrl = findByIndex(modCtrls, ctrlIndex);
  return ctrl && ctrl.inputs ? ctrl.inputs[inputIndex] : defaultValue;
}
