import type {
  AttributeStat,
  AttackElement,
  ReactionBonus,
  ReactionBonusKey,
  ResistanceReduction,
  TotalAttribute,
  Tracker,
  AttackPatternBonusKey,
  AttackPatternInfoKey,
  AttackPatternBonus,
  AttackElementBonus,
  AttacklementInfoKey,
  Vision,
  FinalInfusion,
  Weapon,
  ModifierInput,
  Level,
} from "@Src/types";
import { bareLv, pickOne, turnArr } from "@Src/utils";
import { BASE_REACTION_DAMAGE } from "./constants";

export function addOrInit<T extends Partial<Record<K, number | undefined>>, K extends keyof T>(
  obj: T,
  key: K,
  value: number
) {
  obj[key] = (((obj[key] as number | undefined) || 0) + value) as T[K];
}

export function pushOrMergeTrackerRecord(
  tracker: Tracker,
  field: string,
  desc: string,
  value: number
) {
  if (tracker) {
    // #to-check
    const existed = tracker[field].find((note: any) => note.desc === desc);
    if (existed) {
      existed.value += value;
    } else {
      tracker[field].push({ desc, value });
    }
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
  tracker: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackPatternBonus,
  keys: AttackPatternPath | AttackPatternPath[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackElementBonus,
  keys: AttackElementPath | AttackElementPath[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ReactionBonus,
  keys: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ResistanceReduction,
  keys: (AttackElement | "def") | (AttackElement | "def")[],
  rootValue: RootValue,
  tracker: Tracker
): void;

export function applyModifier(
  desc: string | undefined = "",
  recipient: ModRecipient,
  keys: ModRecipientKey,
  rootValue: RootValue,
  tracker: Tracker
) {
  turnArr(keys).forEach((key, i) => {
    const routes = key.split(".");
    const value = pickOne(rootValue, i);
    const node = {
      desc,
      value,
    };
    if (routes[1] === undefined) {
      (recipient as any)[routes[0]] += value;
      if (tracker) {
        tracker[routes[0]].push(node);
      }
    } else {
      (recipient as any)[routes[0]][routes[1]] += value;
      if (tracker) {
        tracker[routes[0]][routes[1]].push(node);
      }
    }
  });
}

export type RecipientName =
  | "totalAttr"
  | "attPattBonus"
  | "attElmtBonus"
  | "rxnBonus"
  | "resisReduct";

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
  recipientName: "resisReduct",
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

export const meltMult = (elmt: AttackElement) => (elmt === "pyro" ? 2 : 1.5);
export const vaporizeMult = (elmt: AttackElement) => (elmt === "pyro" ? 1.5 : 2);

export type IncreaseAttackBonusArgs = {
  element: AttackElement;
  type: AttacklementInfoKey;
  value: number;
  mainCharVision: Vision;
  infusion: FinalInfusion;
  attElmtBonus: AttackElementBonus;
  attPattBonus: AttackPatternBonus;
  desc: string;
  tracker?: Tracker;
};
export function increaseAttackBonus({
  element,
  type,
  value,
  mainCharVision,
  infusion,
  attElmtBonus,
  attPattBonus,
  desc,
  tracker,
}: IncreaseAttackBonusArgs) {
  if (mainCharVision === element) {
    applyModifier(desc, attElmtBonus, `${element}.${type}`, value, tracker);
  }
  for (const patt of ["NA", "CA", "PA"] as const) {
    if (infusion[patt] === element) {
      applyModifier(desc, attPattBonus, `${patt}.${type}`, value, tracker);
    }
  }
}

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

export function getInput(
  inputs: ModifierInput[] | undefined,
  index: number,
  fallback: number
): number;
export function getInput(
  inputs: ModifierInput[] | undefined,
  index: number,
  fallback: string
): string;
export function getInput(
  inputs: ModifierInput[] | undefined,
  index: number,
  fallback: boolean
): boolean;

export function getInput(
  inputs: ModifierInput[] | undefined,
  index: number,
  fallback: number | string | boolean
): number | string | boolean {
  return inputs?.[index] !== undefined ? inputs[index] : fallback;
}
