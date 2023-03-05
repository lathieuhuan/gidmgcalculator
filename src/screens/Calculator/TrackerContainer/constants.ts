import type { AttacklementInfoKey, AttackPatternInfoKey } from "@Src/types";

export const keyMap: Record<AttackPatternInfoKey | AttacklementInfoKey, string> = {
  pct_: "Percent",
  flat: "Flat",
  cDmg_: "CRIT DMG",
  cRate_: "CRIT Rate",
  defIgn_: "DEF ignore",
  mult_: "Multiplier",
  specialMult: "Special Multiplier",
};
