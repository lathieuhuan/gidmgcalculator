import type { Paths, SkillBonusPath } from "@Src/calculators/utils";
import type { AttributeStat, Level, ModifierInput, ReactionBonusKey } from "@Src/types";
import { applyModifier } from "@Src/calculators/utils";
import { LEVELS } from "@Src/constants";
import { bareLv } from "@Src/utils";
import { BASE_ATTACK_TYPE, SUBSTAT_SCALE } from "./constants";

export function makeWpModApplier(
  recipient: "totalAttrs",
  paths: AttributeStat | AttributeStat[],
  rootScale: number | number[]
): (args: any) => void;
export function makeWpModApplier(
  recipient: "rxnBonuses",
  paths: ReactionBonusKey | ReactionBonusKey[],
  rootScale: number | number[]
): (args: any) => void;
export function makeWpModApplier(
  recipient: "skillBonuses",
  paths: SkillBonusPath | SkillBonusPath[],
  rootScale: number | number[]
): (args: any) => void;

export function makeWpModApplier(recipient: string, paths: Paths, rootScale: number | number[]) {
  return (args: any) => {
    const { refi, desc, tracker } = args;
    const rootValue = Array.isArray(rootScale)
      ? rootScale.map((scale) => scale * (refi + 3))
      : rootScale * (refi + 3);
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

export function getInput(inputs: ModifierInput[] | undefined, index: number): number;
export function getInput(inputs: ModifierInput[] | undefined, index: number, as: "string"): string;
export function getInput(
  inputs: ModifierInput[] | undefined,
  index: number,
  as: "boolean"
): boolean;

export function getInput(
  inputs: ModifierInput[] | undefined,
  index: number,
  as?: "string" | "boolean"
) {
  if (as === "string") {
    return inputs![index] as string;
  } else if (as === "boolean") {
    return !!inputs?.[index];
  }
  return inputs![index] as number;
}
