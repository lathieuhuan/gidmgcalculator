import type { AllStat, Tracker } from "@Src/types";
import type {
  SkillBonus,
  SkillBonusInfoKey,
  SkillBonusKey,
  ReactionBonus,
  ReactionBonusKey,
  TotalAttribute,
} from "@Store/calculatorSlice/types";
import { pickOne, turnArr } from "@Src/utils";

export function addOrInit(obj: any, key: string | number, value: number) {
  turnArr(key).forEach((k) => {
    obj[k] = (obj[k] || 0) + value;
  });
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
  desc: string,
  recipient: TotalAttribute,
  paths: AllStat | AllStat[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string,
  recipient: ReactionBonus,
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function applyModifier(
  desc: string,
  recipient: SkillBonus,
  paths: SkillBonusPath | SkillBonusPath[],
  rootValue: RootValue,
  tracker: Tracker
): void;

export function applyModifier(
  desc: string,
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
      value
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
  totalAttrs: TotalAttribute,
  skillBonuses: SkillBonus,
  rxnBonuses: ReactionBonus,
  desc: string,
  tracker: Tracker
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

export function makeModApplier(
  recipientKey: string,
  paths: Paths,
  rootValue: RootValue
) {
  return (args: ModApplierArgs) => {
    const recipient = (args as any)[recipientKey];
    if (recipient) {
      applyModifier(args.desc, recipient, paths as any, rootValue, args.tracker);
    }
  };
}
