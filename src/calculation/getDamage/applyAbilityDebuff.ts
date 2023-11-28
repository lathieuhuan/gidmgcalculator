import { VISION_TYPES } from "@Src/constants";
import { AbilityPenalty, DebuffModifierArgsWrapper } from "@Src/types";
import { toArray } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { CalcUltilObj } from "../types";
import { getLevelScale, isUsableEffect } from "../utils";

const getPenaltyValue = (
  penalty: Omit<AbilityPenalty, "targets">,
  obj: CalcUltilObj,
  inputs: number[],
  fromSelf: boolean
) => {
  const { preExtra } = penalty;
  let result = penalty.value * getLevelScale(penalty.lvScale, obj, inputs, fromSelf);

  if (typeof preExtra === "number") {
    result += preExtra;
  } else if (preExtra && isUsableEffect(preExtra, obj, inputs, fromSelf)) {
    result += getPenaltyValue(preExtra, obj, inputs, fromSelf);
  }
  if (penalty.max && result > penalty.max) result = penalty.max;

  return Math.max(result, 0);
};

interface ApplyAbilityDebuffArgs {
  description: string;
  penalties: AbilityPenalty | AbilityPenalty[];
  inputs: number[];
  modifierArgs: DebuffModifierArgsWrapper;
  fromSelf: boolean;
}
const applyAbilityDebuff = ({
  description,
  penalties,
  modifierArgs: obj,
  inputs,
  fromSelf,
}: ApplyAbilityDebuffArgs) => {
  for (const penalty of toArray(penalties)) {
    if (isUsableEffect(penalty, obj, inputs, fromSelf)) {
      const penaltyValue = getPenaltyValue(penalty, obj, inputs, fromSelf);

      for (const target of toArray(penalty.targets)) {
        if (typeof target === "string") {
          applyModifier(description, obj.resistReduct, target, penaltyValue, obj.tracker);
        } else {
          const visionIndex = inputs[target.index ?? 0];
          applyModifier(description, obj.resistReduct, VISION_TYPES[visionIndex], penaltyValue, obj.tracker);
        }
      }
    }
  }
};

export default applyAbilityDebuff;
