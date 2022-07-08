import type { Paths, SkillBonusPath } from "@Src/calculators/utils";
import type { AllStat, Level } from "@Src/types";
import type { ReactionBonusKey } from "@Store/calculatorSlice/types";
import { applyModifier } from "@Src/calculators/utils";
import { LEVELS } from "@Src/constants";
import { bareLv } from "@Src/utils";
import { BASE_ATTACK_TYPE, SUBSTAT_SCALE } from "./constants";

export function makeWpModApplier(
  recipient: "totalAttrs",
  paths: AllStat | AllStat[],
  rootScale: number
): (args: any) => void;
export function makeWpModApplier(
  recipient: "rxnBonuses",
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootScale: number
): (args: any) => void;
export function makeWpModApplier(
  recipient: "skillBonuses",
  paths: SkillBonusPath | SkillBonusPath[],
  rootScale: number
): (args: any) => void;

export function makeWpModApplier(
  recipient: string,
  paths: Paths,
  rootScale: number
) {
  return (args: any) => {
    const { refinement, desc, tracker } = args;
    const rootValue = Array.isArray(rootScale)
      ? rootScale.map((scale) => scale * (refinement + 3))
      : rootScale * (refinement + 3);
    if (args[recipient]) {
      applyModifier(desc, args[recipient], paths as any, rootValue, tracker);
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
