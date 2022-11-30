import type {
  ActualAttackElement,
  AttributeStat,
  ResonanceVision,
  TransformativeReaction,
} from "@Src/types";

type ResonanceStat = {
  key: AttributeStat;
  value: number;
};

export const RESONANCE_STAT: Record<ResonanceVision, ResonanceStat> = {
  pyro: { key: "atk_", value: 25 },
  cryo: { key: "cRate", value: 15 },
  geo: { key: "shStr", value: 15 },
  hydro: { key: "hp_", value: 25 },
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
  TransformativeReaction,
  { mult: number; dmgType: ActualAttackElement }
> = {
  bloom: { mult: 2, dmgType: "dendro" },
  hyperbloom: { mult: 3, dmgType: "dendro" },
  burgeon: { mult: 3, dmgType: "dendro" },
  burning: { mult: 0.25, dmgType: "pyro" },
  swirl: { mult: 0.6, dmgType: "various" },
  superconduct: { mult: 0.5, dmgType: "cryo" },
  electroCharged: { mult: 1.2, dmgType: "electro" },
  overloaded: { mult: 2, dmgType: "pyro" },
  shattered: { mult: 1.5, dmgType: "phys" },
};
