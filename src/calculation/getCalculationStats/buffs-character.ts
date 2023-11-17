import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { genExclusiveBuff } from "@Src/data/characters/utils";
import { BuffModifierArgsWrapper, CharacterBonus, CharacterBonusTarget, CharacterStackConfig } from "@Src/types";
import { isGranted, toArray } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";

const getStackValue = (
  stack: CharacterStackConfig,
  inputs: number[],
  modifierArgs: BuffModifierArgsWrapper
): number => {
  switch (stack.type) {
    case "input": {
      const { index = 0, negativeMax } = stack;

      let input = inputs[index] ?? 0;
      if (negativeMax) input = negativeMax - input;
      return input;
    }
    case "attribute": {
      const { field } = stack;
      const stackValue = modifierArgs.totalAttr[field];
      return stackValue;
    }
    case "level": {
      const level = finalTalentLv({
        talentType: stack.path,
        char: modifierArgs.char,
        charData: modifierArgs.charData,
        partyData: modifierArgs.partyData,
      });
      return level;
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
    case "ATTR":
      return applyModifier(description, modifierArgs.totalAttr, path, buffValue, modifierArgs.tracker);
    case "PATT":
      return applyModifier(description, modifierArgs.attPattBonus, path, buffValue, modifierArgs.tracker);
    case "RXN":
      return applyModifier(description, modifierArgs.rxnBonus, path, buffValue, modifierArgs.tracker);
    case "ITEM":
      return modifierArgs.calcItemBuffs.push(genExclusiveBuff(description, target.id, path, buffValue));
  }
};

interface ApplyCharacterBuffArgs {
  description: string;
  bonus: CharacterBonus;
  inputs: number[];
  modifierArgs: BuffModifierArgsWrapper;
}
export const applyCharacterBuff = ({ description, bonus, inputs, modifierArgs }: ApplyCharacterBuffArgs) => {
  if (isGranted(bonus, modifierArgs.char)) {
    if (bonus.checkInput !== undefined) {
      const { checkInput } = bonus;
      const { value, index = 0, type = "equal" } = typeof checkInput === "number" ? { value: checkInput } : checkInput;
      const input = inputs[index] ?? 0;
      switch (type) {
        case "equal":
          if (value !== input) return;
        case "min":
          if (value < input) return;
      }
    }
    let buffValue = bonus.value;

    if (bonus.levelScale) {
      const { value, talent } = bonus.levelScale;
      const level = finalTalentLv({
        talentType: talent,
        char: modifierArgs.char,
        charData: modifierArgs.charData,
        partyData: modifierArgs.partyData,
      });
      buffValue *= TALENT_LV_MULTIPLIERS[value][level];
    }

    if (bonus.stacks) {
      for (const stack of toArray(bonus.stacks)) {
        buffValue *= getStackValue(stack, inputs, modifierArgs);
      }
    }
    if (bonus.initial) {
      buffValue += bonus.initial;
    }
    if (buffValue) {
      if (bonus.max) buffValue = Math.min(buffValue, bonus.max);

      for (const target of toArray(bonus.targets)) {
        applyBuffValue(description, target, buffValue, modifierArgs);
      }
    }
  }
};
