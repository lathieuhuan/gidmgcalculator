import type { AttackPatternInfoKey, CalcItemBuff, CharInfo } from "@Src/types";
import { ascsFromLv } from "@Src/utils";

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

type ExclusiveBuffConfig = [string | string[], AttackPatternInfoKey, string, number];

export const exclBuff = (
  desc: string,
  ids: string | string[],
  key: AttackPatternInfoKey,
  buffValue: number
): CalcItemBuff => {
  return {
    ids,
    bonus: {
      [key]: { desc, value: buffValue },
    },
  };
};