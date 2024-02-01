import { VISION_TYPES } from "@Src/constants";
import { Penalty_Character, DebuffInfoWrap, PenaltyConfig_Character } from "@Src/types";
import { toArray } from "@Src/utils";
import { CalcUltilInfo } from "../types";
import { CharacterCal, applyModifier } from "../utils";

const getPenaltyValue = (
  penalty: PenaltyConfig_Character,
  info: CalcUltilInfo,
  inputs: number[],
  fromSelf: boolean
) => {
  const { preExtra } = penalty;
  let result = penalty.value * CharacterCal.getLevelScale(penalty.lvScale, info, inputs, fromSelf);

  if (typeof preExtra === "number") {
    result += preExtra;
  } else if (preExtra && CharacterCal.isUsable(preExtra, info, inputs, fromSelf)) {
    result += getPenaltyValue(preExtra, info, inputs, fromSelf);
  }
  if (penalty.max && result > penalty.max) result = penalty.max;

  return Math.max(result, 0);
};

interface ApplyAbilityDebuffArgs {
  description: string;
  effects: Penalty_Character | Penalty_Character[];
  inputs: number[];
  infoWrap: DebuffInfoWrap;
  fromSelf: boolean;
}
const applyAbilityDebuff = ({ description, effects, infoWrap: info, inputs, fromSelf }: ApplyAbilityDebuffArgs) => {
  for (const effect of toArray(effects)) {
    if (CharacterCal.isExtensivelyUsable(effect, info, inputs, fromSelf)) {
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
