import { VISION_TYPES } from "@Src/constants";
import { AbilityPenaltyModel, DebuffModifierArgsWrapper } from "@Src/types";
import { toArray } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { isAvailableEffect, getLevelScale, isApplicableEffect } from "../utils";

const getPenaltyValue = (
  penalty: AbilityPenaltyModel,
  inputs: number[],
  obj: DebuffModifierArgsWrapper,
  fromSelf: boolean
) => {
  const { preExtra } = penalty;
  let result = penalty.value * getLevelScale(penalty.scale, inputs, obj, fromSelf);

  if (typeof preExtra === "number") {
    result += preExtra;
  } else if (preExtra && inputs[0] === preExtra.checkInput) {
    result += preExtra.value;
  }
  if (penalty.max && result > penalty.max) result = penalty.max;

  return Math.max(result, 0);
};

interface ApplyAbilityDebuffArgs {
  description: string;
  penalties: AbilityPenaltyModel | AbilityPenaltyModel[];
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
    if (!isAvailableEffect(penalty, obj.char, inputs, fromSelf) || !isApplicableEffect(penalty, obj, inputs)) {
      continue;
    }
    const penaltyValue = getPenaltyValue(penalty, inputs, obj, fromSelf);

    for (const target of toArray(penalty.targets)) {
      if (typeof target === "string") {
        applyModifier(description, obj.resistReduct, target, penaltyValue, obj.tracker);
      } else {
        const visionIndex = inputs[target.index ?? 0];
        applyModifier(description, obj.resistReduct, VISION_TYPES[visionIndex], penaltyValue, obj.tracker);
      }
    }
  }
};

export default applyAbilityDebuff;
