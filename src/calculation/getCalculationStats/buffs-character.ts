import { genExclusiveBuff } from "@Src/data/characters/utils";
import { BuffModifierArgsWrapper, CharacterBonus, CharacterBonusTarget, CharacterStackConfig } from "@Src/types";
import { toArray } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";

const getStackValue = (
  stack: CharacterStackConfig,
  inputs: number[],
  { charData, partyData, totalAttr }: BuffModifierArgsWrapper
) => {
  switch (stack.type) {
    case "input": {
      const { index = 0, negativeMax } = stack;

      let input = inputs[index] || 0;
      if (negativeMax) input = negativeMax - input;
      return input;
    }
    case "attribute": {
      const { field } = stack;
      const stackValue = totalAttr[field];
      return stackValue;
    }
  }
  return 1;
};

const applyBuffValue = (
  description: string,
  target: CharacterBonusTarget,
  buffValue: number,
  modifierArgs: BuffModifierArgsWrapper
) => {
  const { type, path } = target;

  switch (type) {
    case "totalAttr":
      return applyModifier(description, modifierArgs.totalAttr, path, buffValue, modifierArgs.tracker);
    case "attPattBonus":
      return applyModifier(description, modifierArgs.attPattBonus, path, buffValue, modifierArgs.tracker);
    case "calcItem":
      return modifierArgs.calcItemBuffs.push(genExclusiveBuff(description, target.id, path, buffValue));
  }
};

interface ApplyCharacterBuffArgs {
  description: string;
  bonus: CharacterBonus;
  inputs: number[];
  modifierArgs: BuffModifierArgsWrapper;
  // fromSelf?: boolean
}
export const applyCharacterBuff = ({ description, bonus, inputs, modifierArgs }: ApplyCharacterBuffArgs) => {
  let buffValue = bonus.value;

  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      buffValue *= getStackValue(stack, inputs, modifierArgs);
    }
  }
  if (buffValue) {
    for (const target of toArray(bonus.targets)) {
      applyBuffValue(description, target, buffValue, modifierArgs);
    }
  }
};
