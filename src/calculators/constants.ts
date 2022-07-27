import type { AttackElement, AttributeStat, ResonanceVision } from "@Src/types";
import { TRANSFORMATIVE_REACTIONS } from "@Src/constants";

type ResonanceStat = {
  key: AttributeStat;
  value: number;
};

export const RESONANCE_STAT: Record<ResonanceVision, ResonanceStat> = {
  pyro: { key: "atk_", value: 25 },
  cryo: { key: "cRate", value: 15 },
  geo: { key: "shStr", value: 15 },
  dendro: { key: "em", value: 50 },
};

export const BASE_REACTION_DAMAGE: Record<number, number> = {
  1: 9,
  20: 40,
  40: 104,
  50: 162,
  60: 245,
  70: 383,
  80: 540,
  90: 725,
};

export const TRANSFORMATIVE_REACTION_INFO: Record<
  typeof TRANSFORMATIVE_REACTIONS[number],
  { mult: number; dmgType: AttackElement | "various" }
> = {
  superconduct: { mult: 1, dmgType: "cryo" },
  swirl: { mult: 1.2, dmgType: "various" },
  electroCharged: { mult: 2.4, dmgType: "electro" },
  overloaded: { mult: 4, dmgType: "pyro" },
  shattered: { mult: 3, dmgType: "phys" },
};
