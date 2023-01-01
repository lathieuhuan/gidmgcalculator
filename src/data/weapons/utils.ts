import type { AttributeStat, ResistanceReductionKey } from "@Src/types";
import { pickOne } from "@Src/utils";
import type {
  AttackElementPath,
  AttackPatternPath,
  ReactionBonusPath,
  ModRecipientKey,
  RecipientName,
} from "@Src/utils/calculation";
import { applyModifier } from "@Src/utils/calculation";

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
  keys: ReactionBonusPath | ReactionBonusPath[],
  baseBuffValue: NumOrArrayNum,
  divider?: NumOrArrayNum
): (args: any) => void;
export function makeWpModApplier(
  recipientName: "resistReduct",
  keys: ResistanceReductionKey | ResistanceReductionKey[],
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
