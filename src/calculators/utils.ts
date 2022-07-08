import { pickOne, turnArr } from "@Src/utils";
import type { AllStat, Tracker } from "@Src/types";
import type {
  SkillBonus,
  SkillBonusInfoKey,
  SkillBonusKey,
  ReactionBonus,
  ReactionBonusKey,
  TotalAttributes,
} from "@Store/calculatorSlice/types";

export function addOrInit(obj: any, key: string | number, value: number) {
  turnArr(key).forEach((k) => {
    obj[k] = (obj[k] || 0) + value;
  });
}

/** addMod */

export type SkillBonusPath = `${SkillBonusKey}.${SkillBonusInfoKey}`;

export type ModRecipient = TotalAttributes | ReactionBonus | SkillBonus;

export type Paths =
  | AllStat
  | AllStat[]
  | ReactionBonusKey
  | ReactionBonusKey[]
  | SkillBonusPath
  | SkillBonusPath[];

type RootValue = number | number[];

export function addMod(
  trackerDesc: string,
  recipient: TotalAttributes,
  paths: AllStat | AllStat[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function addMod(
  trackerDesc: string,
  recipient: ReactionBonus,
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue,
  tracker: Tracker
): void;
export function addMod(
  trackerDesc: string,
  recipient: SkillBonus,
  paths: SkillBonusPath | SkillBonusPath[],
  rootValue: RootValue,
  tracker: Tracker
): void;

export function addMod(
  trackerDesc: string,
  recipient: ModRecipient,
  paths: Paths,
  rootValue: RootValue,
  tracker: Tracker
) {
  turnArr(paths).forEach((path, i) => {
    const routes = path.split(".");
    const value = pickOne(rootValue, i);
    const node = {
      trackerDesc,
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

/** addModMaker */

export function addModMaker(
  recipient: "totalAttrs",
  paths: AllStat | AllStat[],
  rootValue: RootValue
): (args: any) => void;

export function addModMaker(
  recipient: "reactionBonus",
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootValue: RootValue
): (args: any) => void;

export function addModMaker(
  recipient: "skillBonus",
  paths: SkillBonusPath | SkillBonusPath[],
  rootValue: RootValue
): (args: any) => void;

export function addModMaker(
  recipient: string,
  paths: Paths,
  rootValue: RootValue
) {
  return (args: any) => {
    if (args[recipient]) {
      const { trackerDesc, tracker } = args;
      addMod(trackerDesc, args[recipient], paths as any, rootValue, tracker);
    }
  };
}
