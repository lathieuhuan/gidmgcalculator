import type {
  AttackElementPath,
  AttackPatternPath,
  ModRecipientKey,
  RecipientName,
} from "@Src/calculators/utils";
import type {
  AttackElement,
  AttributeStat,
  Level,
  ModifierInput,
  ReactionBonusKey,
} from "@Src/types";
import { applyModifier } from "@Src/calculators/utils";
import { LEVELS } from "@Src/constants";
import { bareLv, pickOne } from "@Src/utils";
import { BASE_ATTACK_TYPE, SUBSTAT_SCALE } from "./constants";

type NumOrArrayNum = number | number[];

export function makeWpModApplier(
  recipientName: "totalAttr",
  keys: AttributeStat | AttributeStat[],
  baseBuffValue: NumOrArrayNum,
  divider?: NumOrArrayNum
): (args: any) => void;
export function makeWpModApplier(
  recipientName: "attPattBonus",
  keys: AttackPatternPath | AttackPatternPath[],
  baseBuffValue: NumOrArrayNum,
  divider?: NumOrArrayNum
): (args: any) => void;
export function makeWpModApplier(
  recipientName: "attElmtBonus",
  keys: AttackElementPath | AttackElementPath[],
  baseBuffValue: NumOrArrayNum,
  divider?: NumOrArrayNum
): (args: any) => void;
export function makeWpModApplier(
  recipientName: "rxnBonus",
  keys: ReactionBonusKey | ReactionBonusKey[],
  baseBuffValue: NumOrArrayNum,
  divider?: NumOrArrayNum
): (args: any) => void;
export function makeWpModApplier(
  recipientName: "resisReduct",
  keys: (AttackElement | "def") | (AttackElement | "def")[],
  baseBuffValue: NumOrArrayNum,
  divider?: NumOrArrayNum
): (args: any) => void;

export function makeWpModApplier(
  recipientName: RecipientName,
  keys: ModRecipientKey,
  baseBuffValue: NumOrArrayNum,
  divider: NumOrArrayNum = 4
) {
  return (args: any) => {
    if (args[recipientName]) {
      const { refi, desc, tracker } = args;
      let buffValue = baseBuffValue;

      if (refi > 1) {
        const calcValue = (baseValue: number, divider: number) => {
          const fraction = baseValue / divider;
          return fraction * (divider - 1 + refi);
        };
        buffValue = Array.isArray(baseBuffValue)
          ? baseBuffValue.map((value, i) => calcValue(value, pickOne(divider, i)))
          : calcValue(baseBuffValue, pickOne(divider, 0));
      }
      applyModifier(desc, args[recipientName], keys as any, buffValue, tracker);
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
