import type {
  AttributeStat,
  AttackElement,
  AttackPattern,
  DefenseIgnore,
  ReactionBonus,
  ReactionBonusKey,
  ResistanceReduction,
  TotalAttribute,
  Tracker,
  AttackPatternBonusKey,
  AttackPatternInfoKey,
  AttackPatternBonus,
} from "@Src/types";
import { pickOne, turnArr } from "@Src/utils";

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

/**
 * addMod
 * */

export type AttackPatternPath = `${AttackPatternBonusKey}.${AttackPatternInfoKey}`;

export type ModRecipient =
  | TotalAttribute
  | ReactionBonus
  | AttackPatternBonus
  | ResistanceReduction
  | DefenseIgnore;

export type Paths =
  | AttributeStat
  | AttributeStat[]
  | ReactionBonusKey
  | ReactionBonusKey[]
  | AttackPatternPath
  | AttackPatternPath[]
  | (AttackElement | "def")
  | (AttackElement | "def")[]
  | AttackPattern
  | AttackPattern[];

type RootValue = number | number[];

export function applyModifier(
  desc: string | undefined,
  recipient: TotalAttribute,
  paths: AttributeStat | AttributeStat[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ReactionBonus,
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackPatternBonus,
  paths: AttackPatternPath | AttackPatternPath[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ResistanceReduction,
  paths: (AttackElement | "def") | (AttackElement | "def")[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: DefenseIgnore,
  paths: AttackPattern | AttackPattern[],
  rootValue: RootValue,
  tracker: Tracker
): void;

export function applyModifier(
  desc: string | undefined = "",
  recipient: ModRecipient,
  paths: Paths,
  rootValue: RootValue,
  tracker: Tracker
) {
  turnArr(paths).forEach((path, i) => {
    const routes = path.split(".");
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

/**
 * addModMaker
 * */

interface ModApplierArgs {
  totalAttrs: TotalAttribute;
  attPattBonuses: AttackPatternBonus;
  rxnBonuses: ReactionBonus;
  desc: string;
  tracker: Tracker;
}

export function makeModApplier(
  recipientKey: "totalAttrs",
  paths: AttributeStat | AttributeStat[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientKey: "attPattBonuses",
  paths: AttackPatternPath | AttackPatternPath[],
  rootValue: RootValue
): (args: any) => void;
export function makeModApplier(
  recipientKey: "rxnBonuses",
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue
): (args: any) => void;

export function makeModApplier(recipientKey: string, paths: Paths, rootValue: RootValue) {
  return (args: ModApplierArgs) => {
    const recipient = (args as any)[recipientKey];
    if (recipient) {
      applyModifier(args.desc, recipient, paths as any, rootValue, args.tracker);
    }
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
