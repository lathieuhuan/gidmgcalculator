import type { Paths, SkillBonusPath } from "@Src/calculators/utils";
import { addMod } from "@Src/calculators/utils";
import { LEVELS } from "@Src/constants";
import type { AllStat, Level } from "@Src/types";
import { bareLv } from "@Src/utils";
import type { ReactionBonusKey } from "@Store/calculatorSlice/types";
import { BASE_ATTACK_TYPE, SUBSTAT_SCALE } from "./constants";

export function addWpModMaker(
  recipient: "totalAttrs",
  paths: AllStat | AllStat[],
  rootScale: number
): (args: any) => void;

export function addWpModMaker(
  recipient: "reactionBonus",
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootScale: number
): (args: any) => void;

export function addWpModMaker(
  recipient: "skillBonus",
  paths: SkillBonusPath | SkillBonusPath[],
  rootScale: number
): (args: any) => void;

export function addWpModMaker(
  recipient: string,
  paths: Paths,
  rootScale: number
) {
  return (args: any) => {
    const { refinement, trackerDesc, tracker } = args;
    const rootValue = Array.isArray(rootScale)
      ? rootScale.map((scale) => scale * (refinement + 3))
      : rootScale * (refinement + 3);
    if (args[recipient]) {
      addMod(trackerDesc, args[recipient], paths as any, rootValue, tracker);
    }
  };
}

export const wpMainStatAtLv = (scale: string, lv: Level) => {
  return BASE_ATTACK_TYPE[scale][LEVELS.indexOf(lv)];
};

export const wpSubStatAtLv = (scale: string, lv: Level) => {
  const curLv = bareLv(lv);
  const index = curLv === 1 ? 0 : curLv === 20 ? 1 : (curLv - 20) / 10;
  return SUBSTAT_SCALE[scale][index];
};
