import { VISION_TYPES } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { genExclusiveBuff } from "@Src/data/characters/utils";
import {
  BuffModifierArgsWrapper,
  CharInfo,
  CharacterBonus,
  CharacterBonusTarget,
  CharacterStackConfig,
  ModifierInput,
  Vision,
  GrantedAt,
} from "@Src/types";
import { countVision, isGranted, toArray } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";

const isAvailable = (
  condition: { grantedAt?: GrantedAt; alterIndex?: number },
  char: CharInfo,
  inputs: ModifierInput[],
  fromSelf: boolean
) => {
  if (fromSelf) {
    if (!isGranted(condition, char)) return false;
  } else if (condition.alterIndex !== undefined && !inputs[condition.alterIndex]) {
    return false;
  }
  return true;
};

const isApplicable = (bonus: CharacterBonus, inputs: number[], obj: BuffModifierArgsWrapper) => {
  const { checkInput, partyElmtCount, partyOnlyElmts } = bonus;

  if (checkInput !== undefined) {
    const { value, index = 0, type = "equal" } = typeof checkInput === "number" ? { value: checkInput } : checkInput;
    const input = inputs[index] ?? 0;
    switch (type) {
      case "equal":
        if (input !== value) return false;
        else break;
      case "min":
        if (input < value) return false;
        else break;
      case "max":
        if (input > value) return false;
    }
  }
  if (bonus.forWeapons && !bonus.forWeapons.includes(obj.charData.weaponType)) {
    return false;
  }
  if (bonus.forElmts && !bonus.forElmts.includes(obj.charData.vision)) {
    return false;
  }

  const visions = countVision(obj.partyData, obj.charData);

  if (partyElmtCount) {
    for (const key in partyElmtCount) {
      const currentCount = visions[key as Vision] ?? 0;
      const requiredCount = partyElmtCount[key as Vision] ?? 0;
      if (currentCount < requiredCount) return false;
    }
  }
  if (partyOnlyElmts) {
    for (const vision in visions) {
      if (!partyOnlyElmts.includes(vision as Vision)) return false;
    }
  }
  return true;
};

export const getStackValue = (
  stack: CharacterStackConfig,
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
  const { extraStack, maxStack } = stack;

  if (extraStack && isAvailable(extraStack, obj.char, inputs, fromSelf)) {
    result += extraStack.value;
  }
  if (maxStack && result > maxStack) {
    result = maxStack;
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
    } else if (isAvailable(preExtra, obj.char, inputs, fromSelf)) {
      buffValue += getBuffValue(preExtra, inputs, preCalcStack, obj, fromSelf);
    }
  }

  console.log("preCalcStack", preCalcStack);

  if (bonus.stackIndex !== undefined) {
    buffValue *= preCalcStack[bonus.stackIndex] ?? 1;
  }
  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      buffValue *= getStackValue(stack, inputs, obj, fromSelf);
    }
  }
  if (bonus.max) {
    buffValue = Math.min(buffValue, bonus.max);
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
      if (target.maxMult) {
        const max = obj.totalAttr.base_atk * target.maxMult;
        if (buffValue > max) buffValue = max;
      }
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
  preCalcStack: number[];
  modifierArgs: BuffModifierArgsWrapper;
  fromSelf: boolean;
}
export const applyCharacterBonus = ({
  description,
  bonus,
  inputs,
  preCalcStack,
  modifierArgs: obj,
  fromSelf,
}: ApplyCharacterBuffArgs) => {
  if (!isAvailable(bonus, obj.char, inputs, fromSelf) || !isApplicable(bonus, inputs, obj)) {
    return;
  }
  const buffValue = getBuffValue(bonus, inputs, preCalcStack, obj, fromSelf);

  if (buffValue) {
    for (const target of toArray(bonus.targets)) {
      applyBuffValue(description, target, buffValue, obj, inputs[0]);
    }
  }
};
