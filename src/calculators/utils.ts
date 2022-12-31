import {
  ATTACK_ELEMENTS,
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERNS,
  ATTACK_PATTERN_INFO_KEYS,
  ATTRIBUTE_STAT_TYPES,
  REACTIONS,
  REACTION_BONUS_INFO_KEYS,
} from "@Src/constants";
import type {
  AttributeStat,
  AttackElement,
  ReactionBonus,
  Reaction,
  ResistanceReduction,
  TotalAttribute,
  AttackPatternBonusKey,
  AttackPatternInfoKey,
  AttackPatternBonus,
  AttackElementBonus,
  AttacklementInfoKey,
  Vision,
  WeaponType,
  Level,
  ResistanceReductionKey,
  ReactionBonusInfoKey,
  Tracker,
  TrackerRecord,
} from "@Src/types";
import { bareLv, pickOne, turnArray } from "@Src/utils";
import { BASE_REACTION_DAMAGE } from "./constants";

export function addOrInit<T extends Partial<Record<K, number | undefined>>, K extends keyof T>(
  obj: T,
  key: K,
  value: number
) {
  obj[key] = (((obj[key] as number | undefined) || 0) + value) as T[K];
}

export function initTracker() {
  const tracker = {
    totalAttr: {},
    attPattBonus: {},
    attElmtBonus: {},
    rxnBonus: {},
    resistReduct: {},
    NAs: {},
    ES: {},
    EB: {},
    RXN: {},
  } as Tracker;

  for (const stat of ATTRIBUTE_STAT_TYPES) {
    tracker.totalAttr[stat] = [];
  }
  for (const attPatt of [...ATTACK_PATTERNS, "all"] as const) {
    for (const key of ATTACK_PATTERN_INFO_KEYS) {
      tracker.attPattBonus[`${attPatt}.${key}`] = [];
    }
  }
  for (const attElmt of ATTACK_ELEMENTS) {
    for (const key of ATTACK_ELEMENT_INFO_KEYS) {
      tracker.attElmtBonus[`${attElmt}.${key}`] = [];
    }
    tracker.resistReduct[attElmt] = [];
  }
  tracker.resistReduct.def = [];

  for (const reaction of REACTIONS) {
    for (const key of REACTION_BONUS_INFO_KEYS) {
      tracker.rxnBonus[`${reaction}.${key}`] = [];
    }
  }

  return tracker;
}

export function addTrackerRecord(list: TrackerRecord[] | undefined, desc: string, value: number) {
  if (!list) {
    return;
  }

  const existed = list.find((note: any) => note.desc === desc);
  if (existed) {
    existed.value += value;
  } else {
    list.push({ desc, value });
  }
}

export function getRxnBonusesFromEM(EM = 0) {
  return {
    transformative: Math.round((16000 * EM) / (EM + 2000)) / 10,
    amplifying: Math.round((2780 * EM) / (EM + 1400)) / 10,
    quicken: Math.round((5000 * EM) / (EM + 1200)) / 10,
    shield: Math.round((4440 * EM) / (EM + 1400)) / 10,
  };
}

export function getAmplifyingMultiplier(elmt: AttackElement, rxnBonus: ReactionBonus) {
  return {
    melt: (1 + rxnBonus.melt.pct / 100) * (elmt === "pyro" ? 2 : elmt === "cryo" ? 1.5 : 1),
    vaporize:
      (1 + rxnBonus.vaporize.pct / 100) * (elmt === "pyro" ? 1.5 : elmt === "hydro" ? 2 : 1),
  };
}

export function getQuickenBuffDamage(charLv: Level, rxnBonus: ReactionBonus) {
  const base = BASE_REACTION_DAMAGE[bareLv(charLv)];

  return {
    aggravate: Math.round(base * 1.15 * (rxnBonus.aggravate.pct / 100)),
    spread: Math.round(base * 1.25 * (rxnBonus.spread.pct / 100)),
  };
}

export const getDefaultStatInfo = (
  key: "NAs" | "ES" | "EB",
  weaponType: WeaponType,
  vision: Vision
): {
  attElmt: AttackElement;
  multType: number;
} => {
  const attElmt = key === "NAs" && weaponType !== "catalyst" ? "phys" : vision;

  return {
    attElmt,
    multType: attElmt === "phys" ? 1 : 2,
  };
};
