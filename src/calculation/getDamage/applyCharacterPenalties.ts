import { VISION_TYPES } from "@Src/constants";
import { CharacterPenaltyModel, DebuffModifierArgsWrapper } from "@Src/types";
import { toArray } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { isAvailable, getLevelScale } from "../utils";

const getPenaltyValue = (
  penalty: CharacterPenaltyModel,
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

interface ApplyCharacterPenaltiesArgs {
  description: string;
  penalties: CharacterPenaltyModel | CharacterPenaltyModel[];
  inputs: number[];
  modifierArgs: DebuffModifierArgsWrapper;
  fromSelf: boolean;
}
export const applyCharacterPenalties = ({
  description,
  penalties,
  modifierArgs: obj,
  inputs,
  fromSelf,
}: ApplyCharacterPenaltiesArgs) => {
  for (const penalty of toArray(penalties)) {
    if (!isAvailable(penalty, obj.char, inputs, fromSelf)) {
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
