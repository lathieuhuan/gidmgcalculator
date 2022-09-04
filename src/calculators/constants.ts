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
  1: 17.17,
  20: 80.58,
  40: 207.38,
  50: 323.6,
  60: 492.88,
  70: 765.64,
  80: 1077.44,
  90: 1446.85,
};

export const TRANSFORMATIVE_REACTION_INFO: Record<
  typeof TRANSFORMATIVE_REACTIONS[number],
  { mult: number; dmgType: AttackElement | "various" }
> = {
  swirl: { mult: 0.6, dmgType: "various" },
  superconduct: { mult: 0.5, dmgType: "cryo" },
  electroCharged: { mult: 1.2, dmgType: "electro" },
  overloaded: { mult: 2, dmgType: "pyro" },
  shattered: { mult: 1.5, dmgType: "phys" },
  burning: { mult: 0.25, dmgType: "pyro" },
  rupture: { mult: 2, dmgType: "dendro" },
  burgeon: { mult: 3, dmgType: "dendro" },
  hyperbloom: { mult: 3, dmgType: "dendro" },
};
