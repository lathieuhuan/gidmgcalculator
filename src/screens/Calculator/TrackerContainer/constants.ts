import type { AttacklementInfoKey, AttackPatternInfoKey } from "@Src/types";

export const keyMap: Record<AttackPatternInfoKey | AttacklementInfoKey, string> = {
  pct: "Percent",
  flat: "Flat",
  cDmg_: "CRIT DMG",
  cRate_: "CRIT Rate",
  defIgnore: "DEF ignore",
  mult: "Multiplier",
  specialMult: "Special Multiplier",
};
