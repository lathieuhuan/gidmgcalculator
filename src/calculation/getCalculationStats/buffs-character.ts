import { VISION_TYPES } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { genExclusiveBuff } from "@Src/data/characters/utils";
import { BuffModifierArgsWrapper, CharacterBonus, CharacterBonusTarget, CharacterStackConfig } from "@Src/types";
import { isGranted, toArray } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";

const getStackValue = (stack: CharacterStackConfig, inputs: number[], obj: BuffModifierArgsWrapper): number => {
  switch (stack.type) {
    case "input": {
      const { index = 0, negativeMax } = stack;
      let input = inputs[index] ?? 0;
      if (negativeMax) input = negativeMax - input;
      return input;
    }
    case "attribute": {
      const { field } = stack;
      const stackValue = obj.totalAttr[field];
      return stackValue;
    }
    case "level_scale": {
      const level = finalTalentLv({
        talentType: stack.path,
        char: obj.char,
        charData: obj.charData,
        partyData: obj.partyData,
      });
      return TALENT_LV_MULTIPLIERS[stack.value][level];
    }
    case "level": {
      const level = finalTalentLv({
        talentType: stack.path,
        char: obj.char,
        charData: obj.charData,
        partyData: obj.partyData,
      });
      return level;
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
      return applyModifier(description, obj.totalAttr, path, buffValue, obj.tracker);
    case "PATT":
      return applyModifier(description, obj.attPattBonus, path, buffValue, obj.tracker);
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
}
export const applyCharacterBonus = ({ description, bonus, inputs, modifierArgs }: ApplyCharacterBuffArgs) => {
  if (!isGranted(bonus, modifierArgs.char, inputs)) {
    return;
  }
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
  if (bonus.weaponTypes) {
    if (!bonus.weaponTypes.includes(modifierArgs.charData.weaponType)) return;
  }
  let buffValue = bonus.value;

  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      buffValue *= getStackValue(stack, inputs, modifierArgs);
    }
  }
  if (bonus.extra) {
    const { extra } = bonus;
    if (typeof extra === "number") {
      buffValue += extra;
    } else if (isGranted(extra, modifierArgs.char)) {
      buffValue += extra.value;
    }
  }
  if (buffValue) {
    if (bonus.max) buffValue = Math.min(buffValue, bonus.max);

    for (const target of toArray(bonus.targets)) {
      applyBuffValue(description, target, buffValue, modifierArgs, inputs[0]);
    }
  }
};
