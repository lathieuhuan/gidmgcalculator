import { ascsFromLv } from "@Src/utils";
import { CalculatedCharInfo } from "@Store/calculatorSlice/types";

const makeAscsChecker = (value: number) => (char: CalculatedCharInfo) => {
  const ascs = ascsFromLv(char.level);
  return ascs >= value;
};

const makeConsChecker = (value: number) => (char: CalculatedCharInfo) => {
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
