import type {
  AllStat,
  ReactionBonus,
  ReactionBonusKey,
  SkillBonus,
  SkillBonusInfoKey,
  SkillBonusKey,
  TotalAttribute,
  Tracker,
  Vision,
} from "@Src/types";
import { pickOne, turnArr } from "@Src/utils";

export function addOrInit<T>(obj: Record<string, number | undefined>, key: string, value: number) {
  obj[key] = (obj[key] || 0) + value;
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

export type SkillBonusPath = `${SkillBonusKey}.${SkillBonusInfoKey}`;

export type ModRecipient = TotalAttribute | ReactionBonus | SkillBonus;

export type Paths =
  | AllStat
  | AllStat[]
  | ReactionBonusKey
  | ReactionBonusKey[]
  | SkillBonusPath
  | SkillBonusPath[];

type RootValue = number | number[];

export function applyModifier(
  desc: string | undefined,
  recipient: TotalAttribute,
  paths: AllStat | AllStat[],
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
  recipient: SkillBonus,
  paths: SkillBonusPath | SkillBonusPath[],
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
  skillBonuses: SkillBonus;
  rxnBonuses: ReactionBonus;
  desc: string;
  tracker: Tracker;
}

export function makeModApplier(
  recipientKey: "totalAttrs",
  paths: AllStat | AllStat[],
  rootValue: RootValue
): (args: any) => void;

export function makeModApplier(
  recipientKey: "rxnBonuses",
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue
): (args: any) => void;

export function makeModApplier(
  recipientKey: "skillBonuses",
  paths: SkillBonusPath | SkillBonusPath[],
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

export const ampMultiplier = {
  melt: (elmt: Vision) => (elmt === "pyro" ? 2 : 1.5),
  vaporize: (elmt: Vision) => (elmt === "pyro" ? 1.5 : 2),
};
