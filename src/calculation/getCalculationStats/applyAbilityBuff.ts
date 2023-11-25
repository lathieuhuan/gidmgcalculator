import { VISION_TYPES } from "@Src/constants";
import { genExclusiveBuff } from "@Src/data/characters/utils";
import {
  AbilityBonus,
  AbilityBonusModel,
  AbilityBonusStack,
  AbilityBonusTarget,
  BuffModifierArgsWrapper,
  ModifierInput,
} from "@Src/types";
import { countVision, isGranted, toArray } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { getLevelScale, getOptionByIndex, isApplicableEffect, isAvailableEffect } from "../utils";
import { isFinalBonus } from "./utils";

const isCharacterBonus = (bonusModel: AbilityBonusModel): bonusModel is AbilityBonus => {
  return "value" in bonusModel;
};

const getStackValue = (
  stack: AbilityBonusStack,
  inputs: number[],
  obj: BuffModifierArgsWrapper,
  fromSelf: boolean
): number => {
  let result = 1;
  let extra = 0;

  if (stack.extra && isAvailableEffect(stack.extra, obj.char, inputs, fromSelf)) {
    extra = stack.extra.value;
  }

  switch (stack.type) {
    case "input": {
      const { index = 0, alterIndex } = stack;
      const finalIndex = alterIndex !== undefined && !fromSelf ? alterIndex : index;
      let input = inputs[finalIndex] ?? 0;
      result = input;
      break;
    }
    case "attribute": {
      const { field, alterIndex = 0 } = stack;
      let stackValue = fromSelf ? obj.totalAttr[field] : inputs[alterIndex] ?? 1;
      result = stackValue;
      break;
    }
    case "vision": {
      const visionCount = countVision(obj.partyData, obj.charData);
      const input =
        stack.visionType === "various" ? Object.keys(visionCount).length : visionCount[stack.visionType] ?? 0;

      extra = 0;
      result = getOptionByIndex(stack.options, input + extra - 1);
      break;
    }
    case "option": {
      result = getOptionByIndex(stack.options, inputs[stack.index ?? 0] - 1);
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
    case "energy": {
      result = obj.charData.EBcost;
      break;
    }
    case "resolve": {
      const [totalEnergy = 0, electroEnergy = 0] = inputs;
      const level = finalTalentLv({
        talentType: "EB",
        char: obj.char,
        charData: obj.charData,
        partyData: obj.partyData,
      });
      let extraEnergy = 0;

      if (obj.char.cons >= 1 && electroEnergy <= totalEnergy) {
        extraEnergy += electroEnergy * 0.8 + (totalEnergy - electroEnergy) * 0.2;
      }

      const stackPerEnergy = Math.min(Math.ceil(14.5 + level * 0.5), 20);
      const countResolve = (energyCost: number) => Math.round(energyCost * stackPerEnergy) / 100;
      const stacks = countResolve(totalEnergy + extraEnergy);

      result = Math.min(stacks, 60);
      break;
    }
  }

  if (stack.requiredBase) result -= stack.requiredBase;
  if (extra) result += extra;

  let max = 0;
  if (typeof stack.max === "number") {
    max = stack.max;
  } else if (stack.max) {
    max =
      stack.max.value +
      stack.max.extraAt.reduce((total, at) => total + (isGranted({ grantedAt: at }, obj.char) ? 1 : 0), 0);
  }
  if (max && result > max) result = max;

  return Math.max(result, 0);
};

const getBonusValue = (
  bonus: Omit<AbilityBonus, "targets">,
  inputs: number[],
  preCalcStacks: number[],
  obj: BuffModifierArgsWrapper,
  fromSelf: boolean
) => {
  const { preExtra } = bonus;
  let bonusValue = bonus.value * getLevelScale(bonus.scale, inputs, obj, fromSelf);

  if (typeof preExtra === "number") {
    bonusValue += preExtra;
  } else if (
    preExtra &&
    isAvailableEffect(preExtra, obj.char, inputs, fromSelf) &&
    isApplicableEffect(preExtra, obj, inputs)
  ) {
    bonusValue += getBonusValue(preExtra, inputs, preCalcStacks, obj, fromSelf);
  }

  if (bonus.stackIndex !== undefined) {
    bonusValue *= preCalcStacks[bonus.stackIndex] ?? 1;
  }
  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      bonusValue *= getStackValue(stack, inputs, obj, fromSelf);
    }
  }
  if (typeof bonus.max === "number") {
    bonusValue = Math.min(bonusValue, bonus.max);
  } else if (bonus.max) {
    bonusValue = Math.min(bonusValue, bonus.max.value * getStackValue(bonus.max.stacks, inputs, obj, fromSelf));
  }

  return bonusValue;
};

const applyBonusValue = (
  description: string,
  target: AbilityBonusTarget,
  bonusValue: number,
  obj: BuffModifierArgsWrapper,
  inputs: number[]
) => {
  switch (target.type) {
    case "ATTR":
      return applyModifier(description, obj.totalAttr, target.path, bonusValue, obj.tracker);
    case "PATT":
      return applyModifier(description, obj.attPattBonus, target.path, bonusValue, obj.tracker);
    case "ELMT":
      return applyModifier(description, obj.attElmtBonus, target.path, bonusValue, obj.tracker);
    case "RXN":
      return applyModifier(description, obj.rxnBonus, target.path, bonusValue, obj.tracker);
    case "ITEM":
      return obj.calcItemBuffs.push(genExclusiveBuff(description, target.id, target.path, bonusValue));
    case "IN_ELMT":
      const visionIndex = inputs[target.index || 0];
      return applyModifier(description, obj.totalAttr, VISION_TYPES[visionIndex], bonusValue, obj.tracker);
    case "ELM_NA":
      if (obj.charData.weaponType === "catalyst" || obj.infusedElement !== "phys") {
        applyModifier(description, obj.attPattBonus, "NA.pct_", bonusValue, obj.tracker);
      }
      return;
  }
};

interface ApplyCharacterBuffArgs {
  description: string;
  bonus: AbilityBonus;
  inputs: number[];
  preCalcStacks?: number[];
  modifierArgs: BuffModifierArgsWrapper;
  fromSelf: boolean;
}
const applyAbilityBonus = ({
  description,
  bonus,
  inputs,
  preCalcStacks = [],
  modifierArgs: obj,
  fromSelf,
}: ApplyCharacterBuffArgs) => {
  if (!isAvailableEffect(bonus, obj.char, inputs, fromSelf) || !isApplicableEffect(bonus, obj, inputs)) {
    return;
  }
  const bonusValue = getBonusValue(bonus, inputs, preCalcStacks, obj, fromSelf);

  if (bonusValue) {
    for (const target of toArray(bonus.targets)) {
      applyBonusValue(description, target, bonusValue, obj, inputs);
    }
  }
};

interface ApplyCharacterBonusesArgs extends Omit<ApplyCharacterBuffArgs, "bonus" | "preCalcStacks"> {
  bonuses: AbilityBonusModel | AbilityBonusModel[];
  inputs: ModifierInput[];
  isFinal?: boolean;
}
const applyAbilityBuff = ({ bonuses, isFinal, ...others }: ApplyCharacterBonusesArgs) => {
  const noIsFinal = isFinal === undefined;

  for (const bonus of toArray(bonuses)) {
    if (isCharacterBonus(bonus)) {
      const isTrulyFinalBonus =
        isFinalBonus(bonus.stacks) || (typeof bonus.preExtra === "object" && isFinalBonus(bonus.preExtra.stacks));

      if (noIsFinal || isFinal === isTrulyFinalBonus) {
        applyAbilityBonus({
          bonus,
          ...others,
        });
      }
    } else if (noIsFinal || isFinal === isFinalBonus(bonus.stacks)) {
      const preCalcStacks = toArray(bonus.stacks).map((stack) =>
        getStackValue(stack, others.inputs, others.modifierArgs, others.fromSelf)
      );

      for (const subBonus of bonus.children) {
        applyAbilityBonus({
          bonus: subBonus,
          preCalcStacks,
          ...others,
        });
      }
    }
  }
};

export default applyAbilityBuff;
