import { TARGET_RESISTANCES_TYPES } from "@Src/constants";
import { Target } from "./types";

export function initTarget() {
  const result = { level: 1 } as Target;
  for (const elmt of TARGET_RESISTANCES_TYPES) {
    result[elmt] = 10;
  }
  return result;
}
