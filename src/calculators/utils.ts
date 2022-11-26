import {
  ATTACK_ELEMENTS,
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERNS,
  ATTACK_PATTERN_INFO_KEYS,
  ATTRIBUTE_STAT_TYPES,
  REACTIONS,
} from "@Src/constants";
import type {
  AttributeStat,
  AttackElement,
  ReactionBonus,
  ReactionBonusKey,
  ResistanceReduction,
  TotalAttribute,
  AttackPatternBonusKey,
  AttackPatternInfoKey,
  AttackPatternBonus,
  AttackElementBonus,
  AttacklementInfoKey,
  Vision,
  Weapon,
  Level,
} from "@Src/types";
import { bareLv, pickOne, turnArray } from "@Src/utils";
import { BASE_REACTION_DAMAGE } from "./constants";
import { Tracker, TrackerRecord } from "./types";

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

  for (const reaction of [...REACTIONS, "infuse_melt", "infuse_vaporize"] as const) {
    tracker.rxnBonus[reaction] = [];
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

export type AttackPatternPath = `${AttackPatternBonusKey}.${AttackPatternInfoKey}`;

export type AttackElementPath = `${AttackElement}.${AttacklementInfoKey}`;

export type ModRecipient =
  | TotalAttribute
  | ReactionBonus
  | AttackPatternBonus
  | AttackElementBonus
  | ResistanceReduction;

export type ModRecipientKey =
  | AttributeStat
  | AttributeStat[]
  | ReactionBonusKey
  | ReactionBonusKey[]
  | AttackPatternPath
  | AttackPatternPath[]
  | AttackElementPath
  | AttackElementPath[]
  | (AttackElement | "def")
  | (AttackElement | "def")[];

type RootValue = number | number[];

/**
 * add modifier
 * */
export function applyModifier(
  desc: string | undefined,
  recipient: TotalAttribute,
  keys: AttributeStat | AttributeStat[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackPatternBonus,
  keys: AttackPatternPath | AttackPatternPath[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackElementBonus,
  keys: AttackElementPath | AttackElementPath[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ReactionBonus,
  keys: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ResistanceReduction,
  keys: (AttackElement | "def") | (AttackElement | "def")[],
  rootValue: RootValue,
  tracker?: Tracker
): void;

export function applyModifier(
  desc: string | undefined = "",
  recipient: ModRecipient,
  keys: ModRecipientKey,
  rootValue: RootValue,
  tracker?: Tracker
) {
  const keyOfTracker = (): keyof Tracker => {
    if ("atk" in recipient) {
      return "totalAttr";
    } else if ("all" in recipient) {
      return "attPattBonus";
    } else if ("bloom" in recipient) {
      return "rxnBonus";
    } else if ("def" in recipient) {
      return "resistReduct";
    } else {
      return "attElmtBonus";
    }
  };

  turnArray(keys).forEach((key, i) => {
    const [field, subField] = key.split(".");
    const value = pickOne(rootValue, i);
    const node = {
      desc,
      value,
    };
    // recipient: TotalAttribute, ReactionBonus, ResistanceReduction
    if (subField === undefined) {
      (recipient as any)[field] += value;
      if (tracker) {
        (tracker as any)[keyOfTracker()][field].push(node);
      }
    } else {
      (recipient as any)[field][subField] += value;
      if (tracker) {
        (tracker as any)[keyOfTracker()][key].push(node);
      }
    }
  });
}

export type RecipientName =
  | "totalAttr"
  | "attPattBonus"
  | "attElmtBonus"
  | "rxnBonus"
  | "resistReduct";

interface ModApplierArgs {
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  rxnBonus: ReactionBonus;
  desc: string;
  tracker: Tracker;
}

/**
 * add modifier maker
 * */
export function makeModApplier(
  recipientName: "totalAttr",
  keys: AttributeStat | AttributeStat[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientName: "attPattBonus",
  keys: AttackPatternPath | AttackPatternPath[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientName: "attElmtBonus",
  keys: AttackElementPath | AttackElementPath[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientName: "rxnBonus",
  keys: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientName: "resistReduct",
  keys: (AttackElement | "def") | (AttackElement | "def")[],
  rootValue: RootValue
): (args: any) => void;

export function makeModApplier(
  recipientName: RecipientName,
  keys: ModRecipientKey,
  rootValue: RootValue
) {
  return (args: ModApplierArgs) => {
    const recipient = (args as any)[recipientName];
    if (recipient) {
      applyModifier(args.desc, recipient, keys as any, rootValue, args.tracker);
    }
  };
}

export function getQuickenBuffDamage(charLv: Level, EM: number, rxnBnes: ReactionBonus) {
  const base = BASE_REACTION_DAMAGE[bareLv(charLv)];
  const bonus = 1 + (5 * EM) / (EM + 1200);

  return {
    aggravate: Math.round(base * 1.15 * (bonus + rxnBnes.aggravate / 100)),
    spread: Math.round(base * 1.25 * (bonus + rxnBnes.spread / 100)),
  };
}

export function getRxnBonusesFromEM(EM = 0) {
  return {
    transformative: Math.round((16000 * EM) / (EM + 2000)) / 10,
    amplifying: Math.round((2780 * EM) / (EM + 1400)) / 10,
    shield: Math.round((4440 * EM) / (EM + 1400)) / 10,
  };
}

export const meltMult = (elmt: AttackElement) => {
  return elmt === "pyro" ? 2 : elmt === "cryo" ? 1.5 : 1;
};
export const vaporizeMult = (elmt: AttackElement) => {
  return elmt === "pyro" ? 1.5 : elmt === "hydro" ? 2 : 1;
};

export const getDefaultStatInfo = (
  key: "NAs" | "ES" | "EB",
  weapon: Weapon,
  vision: Vision
): {
  attElmt: AttackElement;
  multType: number;
} => {
  const attElmt = key === "NAs" && weapon !== "catalyst" ? "phys" : vision;

  return {
    attElmt,
    multType: attElmt === "phys" ? 1 : 2,
  };
};
