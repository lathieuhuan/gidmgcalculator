import type { AttackPatternInfoKey, CalcItemBuff, CharInfo } from "@Src/types";

const makeConsChecker = (value: number) => (char: CharInfo) => {
  return char.cons >= value;
};

export const checkCons = {
  1: makeConsChecker(1),
  2: makeConsChecker(2),
  4: makeConsChecker(4),
  6: makeConsChecker(6),
};

export const genExclusiveBuff = (
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
