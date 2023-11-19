import { VISION_TYPES } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { genExclusiveBuff } from "@Src/data/characters/utils";
import {
  ActiveCondition,
  BuffModifierArgsWrapper,
  CharInfo,
  CharacterBonus,
  CharacterBonusTarget,
  CharacterStackConfig,
  ModifierInput,
  Vision,
} from "@Src/types";
import { countVision, isGranted, toArray } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";

const isAvailable = (fromSelf: boolean, condition: ActiveCondition, char: CharInfo, inputs: ModifierInput[]) => {
  if (fromSelf) {
    if (!isGranted(condition, char)) return false;
  } else if (condition.tmInputIndex !== undefined && !inputs[condition.tmInputIndex]) {
    return false;
  }
  return true;
};

const getStackValue = (
  stack: CharacterStackConfig,
  inputs: number[],
  obj: BuffModifierArgsWrapper,
  fromSelf: boolean
): number => {
  switch (stack.type) {
    case "input": {
      const { index = 0, extra, negativeMax, max } = stack;
      let input = inputs[index] ?? 0;

      if (extra && isAvailable(fromSelf, extra, obj.char, inputs)) input += extra.value;
      if (negativeMax) input = negativeMax - input;
      if (max && input > max) input = max;
      return input;
    }
    case "option": {
      const optionIndex = inputs[stack.index ?? 0] - 1;
      return stack.options[optionIndex] ?? 1;
    }
    case "attribute": {
      const { field, tmInputIndex = 0 } = stack;
      const stackValue = fromSelf ? obj.totalAttr[field] : inputs[tmInputIndex] ?? 1;
      return stackValue;
    }
    case "nation": {
      let count = obj.partyData.reduce((total, teammate) => {
        return total + (teammate?.nation === obj.charData.nation ? 1 : 0);
      }, 0);
      if (stack.nation === "different") {
        count = obj.partyData.filter(Boolean).length - count;
      }
      return count;
    }
    case "element":
      const { geo = 0 } = countVision(obj.partyData, obj.charData);
      return stack.options[geo - 1] ?? 1;
  }
  return 1;
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
  modifierArgs: BuffModifierArgsWrapper;
  fromSelf: boolean;
}
export const applyCharacterBonus = ({
  description,
  bonus,
  inputs,
  modifierArgs: obj,
  fromSelf,
}: ApplyCharacterBuffArgs) => {
  if (!isAvailable(fromSelf, bonus, obj.char, inputs)) {
    return;
  }
  if (bonus.checkInput !== undefined) {
    const { checkInput } = bonus;
    const { value, index = 0, type = "equal" } = typeof checkInput === "number" ? { value: checkInput } : checkInput;
    const input = inputs[index] ?? 0;
    switch (type) {
      case "equal":
        if (input !== value) return;
        else break;
      case "min":
        if (input < value) return;
        else break;
    }
  }
  if (bonus.weaponTypes) {
    if (!bonus.weaponTypes.includes(obj.charData.weaponType)) return;
  }
  if (bonus.visionCount) {
    const visionCount = countVision(obj.partyData, obj.charData);
    for (const key in bonus.visionCount) {
      const currentCount = visionCount[key as Vision] ?? 0;
      const requiredCount = bonus.visionCount[key as Vision] ?? 0;
      if (currentCount < requiredCount) return;
    }
  }
  let buffValue = bonus.value;

  if (bonus.levelScale) {
    const { talent, value, extra, tmInputIndex = 0 } = bonus.levelScale;

    const level = fromSelf
      ? finalTalentLv({
          talentType: talent,
          char: obj.char,
          charData: obj.charData,
          partyData: obj.partyData,
        })
      : inputs[tmInputIndex] ?? 0;

    buffValue *= value ? TALENT_LV_MULTIPLIERS[value][level] : level;

    if (typeof extra === "number") buffValue += extra;

    // @to-do
    // if (extra) {
    //   if (typeof extra === "number") {
    //     buffValue += extra;
    //   } else if (isGranted(extra, obj.char)) {
    //     buffValue += extra.value;
    //   }
    // }
  }
  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      buffValue *= getStackValue(stack, inputs, obj, fromSelf);
    }
  }

  if (buffValue) {
    if (bonus.max) buffValue = Math.min(buffValue, bonus.max);

    for (const target of toArray(bonus.targets)) {
      applyBuffValue(description, target, buffValue, obj, inputs[0]);
    }
  }
};
