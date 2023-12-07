import { VISION_TYPES } from "@Src/constants";
import { AbilityPenalty, DebuffInfoWrap } from "@Src/types";
import { toArray } from "@Src/utils";
import { CalcUltilInfo } from "../types";
import { getLevelScale, isUsableEffect, applyModifier } from "../utils";

const getPenaltyValue = (
  penalty: Omit<AbilityPenalty, "targets">,
  info: CalcUltilInfo,
  inputs: number[],
  fromSelf: boolean
) => {
  const { preExtra } = penalty;
  let result = penalty.value * getLevelScale(penalty.lvScale, info, inputs, fromSelf);

  if (typeof preExtra === "number") {
    result += preExtra;
  } else if (preExtra && isUsableEffect(preExtra, info, inputs, fromSelf)) {
    result += getPenaltyValue(preExtra, info, inputs, fromSelf);
  }
  if (penalty.max && result > penalty.max) result = penalty.max;

  return Math.max(result, 0);
};

interface ApplyAbilityDebuffArgs {
  description: string;
  effects: AbilityPenalty | AbilityPenalty[];
  inputs: number[];
  infoWrap: DebuffInfoWrap;
  fromSelf: boolean;
}
const applyAbilityDebuff = ({ description, effects, infoWrap: info, inputs, fromSelf }: ApplyAbilityDebuffArgs) => {
  for (const effect of toArray(effects)) {
    if (isUsableEffect(effect, info, inputs, fromSelf)) {
      const penaltyValue = getPenaltyValue(effect, info, inputs, fromSelf);

      for (const target of toArray(effect.targets)) {
        if (typeof target === "string") {
          applyModifier(description, info.resistReduct, target, penaltyValue, info.tracker);
        } else {
          const visionIndex = inputs[target.index ?? 0];
          applyModifier(description, info.resistReduct, VISION_TYPES[visionIndex], penaltyValue, info.tracker);
        }
      }
    }
  }
};

export default applyAbilityDebuff;
