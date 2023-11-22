import { VISION_TYPES } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { genExclusiveBuff } from "@Src/data/characters/utils";
import {
  BuffModifierArgsWrapper,
  CharacterBonus,
  CharacterBonusModel,
  CharacterBonusStack,
  CharacterBonusTarget,
  ModifierInput,
} from "@Src/types";
import { countVision, toArray } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { isFinalBonus } from "../utils";
import { isApplicable, isAvailable, isCharacterBonus } from "./utils";

export const getStackValue = (
  stack: CharacterBonusStack,
  inputs: number[],
  obj: BuffModifierArgsWrapper,
  fromSelf: boolean
): number => {
  let result = 1;

  switch (stack.type) {
    case "input": {
      const { index = 0, alterIndex, requiredBase } = stack;
      const finalIndex = alterIndex !== undefined && !fromSelf ? alterIndex : index;
      let input = inputs[finalIndex] ?? 0;

      if (requiredBase) input = Math.max(input - requiredBase, 0);
      result = input;
      break;
    }
    case "option": {
      const optionIndex = inputs[stack.index ?? 0] - 1;
      result = stack.options[optionIndex] ?? 1;
      break;
    }
    case "attribute": {
      const { field, alterIndex = 0, requiredBase } = stack;
      let stackValue = fromSelf ? obj.totalAttr[field] : inputs[alterIndex] ?? 1;

      if (requiredBase) stackValue = Math.max(stackValue - requiredBase, 0);
      result = stackValue;
      break;
    }
    case "nation": {
      let count = obj.partyData.reduce((total, teammate) => {
        return total + (teammate?.nation === obj.charData.nation ? 1 : 0);
      }, 0);
      if (stack.nation === "different") {
        count = obj.partyData.filter(Boolean).length - count;
      }
      result = count;
      break;
    }
    case "vision": {
      const { visionType } = stack;
      const visionCount = countVision(obj.partyData, obj.charData);
      const input = visionType === "various" ? Object.keys(visionCount).length : visionCount[visionType] ?? 0;
      result = stack.options[input - 1] ?? 1;
      break;
    }
  }
  const { extra, max } = stack;

  if (extra && isAvailable(extra, obj.char, inputs, fromSelf)) {
    result += extra.value;
  }
  if (max && result > max) {
    result = max;
  }

  return result;
};

const getBuffValue = (
  bonus: Omit<CharacterBonus, "targets">,
  inputs: number[],
  preCalcStack: number[],
  obj: BuffModifierArgsWrapper,
  fromSelf: boolean
) => {
  const { preExtra } = bonus;
  let buffValue = bonus.value;

  if (bonus.scale) {
    const { talent, value, alterIndex = 0 } = bonus.scale;
    const level = fromSelf
      ? finalTalentLv({
          talentType: talent,
          char: obj.char,
          charData: obj.charData,
          partyData: obj.partyData,
        })
      : inputs[alterIndex] ?? 0;

    if (typeof value === "number") {
      buffValue *= value ? TALENT_LV_MULTIPLIERS[value][level] : level;
    } else {
      buffValue *= value[level - 1] ?? 1;
    }
  }
  if (preExtra) {
    if (typeof preExtra === "number") {
      buffValue += preExtra;
    } else if (isAvailable(preExtra, obj.char, inputs, fromSelf) && isApplicable(preExtra, obj, inputs)) {
      buffValue += getBuffValue(preExtra, inputs, preCalcStack, obj, fromSelf);
    }
  }

  if (bonus.stackIndex !== undefined) {
    buffValue *= preCalcStack[bonus.stackIndex] ?? 1;
  }
  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      buffValue *= getStackValue(stack, inputs, obj, fromSelf);
    }
  }
  if (bonus.max) {
    let max = 0;

    if (typeof bonus.max === "number") {
      max = bonus.max;
    } else {
      const stack = getStackValue(bonus.max.stacks, inputs, obj, fromSelf);
      max = bonus.max.value * stack;
    }
    buffValue = Math.min(buffValue, max);
  }

  return buffValue;
};

const applyBuffValue = (
  description: string,
  target: CharacterBonusTarget,
  buffValue: number,
  obj: BuffModifierArgsWrapper,
  input: number
) => {
  const { type, path } = target;

  switch (type) {
    case "ATTR":
      return applyModifier(description, obj.totalAttr, path, buffValue, obj.tracker);
    case "PATT":
      return applyModifier(description, obj.attPattBonus, path, buffValue, obj.tracker);
    case "ELMT":
      return applyModifier(description, obj.attElmtBonus, path, buffValue, obj.tracker);
    case "RXN":
      return applyModifier(description, obj.rxnBonus, path, buffValue, obj.tracker);
    case "ITEM":
      return obj.calcItemBuffs.push(genExclusiveBuff(description, target.id, path, buffValue));
    case "ELM_NA":
      if (obj.charData.weaponType === "catalyst" || obj.infusedElement !== "phys") {
        applyModifier(description, obj.attPattBonus, "NA.pct_", buffValue, obj.tracker);
      }
      return;
    case "IN_ELM":
      return applyModifier(description, obj.totalAttr, VISION_TYPES[input], buffValue, obj.tracker);
  }
};

interface ApplyCharacterBuffArgs {
  description: string;
  bonus: CharacterBonus;
  inputs: number[];
  preCalcStack?: number[];
  modifierArgs: BuffModifierArgsWrapper;
  fromSelf: boolean;
}
const applyCharacterBonus = ({
  description,
  bonus,
  inputs,
  preCalcStack = [],
  modifierArgs: obj,
  fromSelf,
}: ApplyCharacterBuffArgs) => {
  if (!isAvailable(bonus, obj.char, inputs, fromSelf) || !isApplicable(bonus, obj, inputs)) {
    return;
  }
  const buffValue = getBuffValue(bonus, inputs, preCalcStack, obj, fromSelf);

  if (buffValue) {
    for (const target of toArray(bonus.targets)) {
      applyBuffValue(description, target, buffValue, obj, inputs[0]);
    }
  }
};

interface ApplyCharacterBonusesArgs extends Omit<ApplyCharacterBuffArgs, "bonus" | "preCalcStack"> {
  bonuses: CharacterBonusModel | CharacterBonusModel[];
  inputs: ModifierInput[];
  isFinal: boolean;
}
export const applyCharacterBonuses = ({ bonuses, isFinal, ...others }: ApplyCharacterBonusesArgs) => {
  for (const bonus of toArray(bonuses)) {
    if (isCharacterBonus(bonus)) {
      const isTrulyFinalBonus =
        isFinalBonus(bonus.stacks) || (typeof bonus.preExtra === "object" && isFinalBonus(bonus.preExtra.stacks));

      if (isFinal === isTrulyFinalBonus) {
        applyCharacterBonus({
          bonus,
          ...others,
        });
      }
    } else if (isFinal === isFinalBonus(bonus.stacks)) {
      const preCalcStack = toArray(bonus.stacks).map((stack) =>
        getStackValue(stack, others.inputs, others.modifierArgs, others.fromSelf)
      );

      for (const subBonus of bonus.children) {
        applyCharacterBonus({
          bonus: subBonus,
          preCalcStack,
          ...others,
        });
      }
    }
  }
};
