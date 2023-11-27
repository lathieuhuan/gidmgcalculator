import { VISION_TYPES } from "@Src/constants";
import { genExclusiveBuff } from "@Src/data/characters/utils";
import {
  AbilityBonus,
  AbilityBonusModel,
  AbilityBonusStack,
  BuffModifierArgsWrapper,
  DynamicMax,
  ModifierInput,
} from "@Src/types";
import { countVision, toArray } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { getLevelScale, isAvailableEffect, isUsableEffect } from "../utils";
import { isFinalBonus } from "./utils";

const isCharacterBonus = (bonusModel: AbilityBonusModel): bonusModel is AbilityBonus => {
  return "value" in bonusModel;
};

const getMax = (max: number | DynamicMax, inputs: number[], obj: BuffModifierArgsWrapper, fromSelf: boolean) => {
  if (typeof max === "number") {
    return max;
  }
  let result = max.value;

  for (const extra of max.extras) {
    if (isUsableEffect(extra, obj, inputs, fromSelf)) {
      result += extra.value;
    }
  }
  return result;
};

const getStackValue = (
  stack: AbilityBonusStack,
  inputs: number[],
  obj: BuffModifierArgsWrapper,
  fromSelf: boolean
): number => {
  let result = 1;

  switch (stack.type) {
    case "input": {
      const { index = 0, alterIndex } = stack;
      const finalIndex = alterIndex !== undefined && !fromSelf ? alterIndex : index;
      const input = inputs[finalIndex] ?? 0;
      result = input;
      break;
    }
    case "attribute": {
      const { field, alterIndex = 0 } = stack;
      const stackValue = fromSelf ? obj.totalAttr[field] : inputs[alterIndex] ?? 1;
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
    case "energy": {
      result = obj.charData.EBcost;
      break;
    }
    case "resolve": {
      let [totalEnergy = 0, electroEnergy = 0] = inputs;
      if (obj.char.cons >= 1 && electroEnergy <= totalEnergy) {
        totalEnergy += electroEnergy * 0.8 + (totalEnergy - electroEnergy) * 0.2;
      }
      const level = finalTalentLv({
        talentType: "EB",
        char: obj.char,
        charData: obj.charData,
        partyData: obj.partyData,
      });
      const stackPerEnergy = Math.min(Math.ceil(14.5 + level * 0.5), 20);
      const stacks = Math.round(totalEnergy * stackPerEnergy) / 100;
      // const countResolve = (energyCost: number) => Math.round(energyCost * stackPerEnergy) / 100;

      result = Math.min(stacks, 60);
      break;
    }
  }

  if (stack.requiredBase) result -= stack.requiredBase;

  if (stack.extra && isAvailableEffect(stack.extra, obj.char, inputs, fromSelf)) {
    result += stack.extra.value;
  }

  if (stack.max) {
    const max = getMax(stack.max, inputs, obj, fromSelf);
    if (result > max) result = max;
  }

  return Math.max(result, 0);
};

const getBonusValue = (
  bonus: Omit<AbilityBonus, "targets">,
  inputs: number[],
  preCalcStacks: number[],
  obj: BuffModifierArgsWrapper,
  fromSelf: boolean
) => {
  const { value, preExtra } = bonus;
  let bonusValue = 0;

  // ========== INITIAL VALUE ==========
  if (typeof value === "number") {
    bonusValue = value;
  } else {
    const { preOptions, options, indexSrc } = value;
    let index = -1;

    /** Navia */
    if (preOptions && !inputs[1]) {
      const preIndex = preOptions[inputs[0]];
      index += preIndex ?? preOptions[preOptions.length - 1];
    }

    switch (indexSrc.type) {
      case "vision":
        const { visionType } = indexSrc;
        const visionCount = countVision(obj.partyData, obj.charData);
        const input =
          visionType === "various"
            ? Object.keys(visionCount).length
            : typeof visionType === "string"
            ? visionCount[visionType] ?? 0
            : visionType.reduce((total, type) => total + (visionCount[type] ?? 0), 0);

        index += input;
        break;
      case "input":
        index += inputs[indexSrc.index ?? 0];
        break;
      case "level":
        index += finalTalentLv({
          talentType: indexSrc.talent,
          char: obj.char,
          charData: obj.charData,
          partyData: obj.partyData,
        });
        break;
    }

    if (value.extra && isAvailableEffect(value.extra, obj.char, inputs, fromSelf)) {
      index += value.extra.value;
    }
    if (value.max) {
      const max = getMax(value.max, inputs, obj, fromSelf);
      if (index > max) index = max;
    }

    bonusValue = options[index] ?? (index > 0 ? options[options.length - 1] : 0);
  }

  // ========== APPLY LEVEL SCALE ==========
  bonusValue *= getLevelScale(bonus.scale, inputs, obj, fromSelf);

  // ========== ADD PRE-EXTRA ==========
  if (typeof preExtra === "number") {
    bonusValue += preExtra;
  } else if (preExtra && isUsableEffect(preExtra, obj, inputs, fromSelf)) {
    bonusValue += getBonusValue(preExtra, inputs, preCalcStacks, obj, fromSelf);
  }

  // ========== APPLY STACKS ==========
  if (bonus.stackIndex !== undefined) {
    bonusValue *= preCalcStacks[bonus.stackIndex] ?? 1;
  }
  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      bonusValue *= getStackValue(stack, inputs, obj, fromSelf);
    }
  }
  // ========== APPLY MAX ==========
  if (typeof bonus.max === "number") {
    bonusValue = Math.min(bonusValue, bonus.max);
  } else if (bonus.max) {
    bonusValue = Math.min(bonusValue, bonus.max.value * getStackValue(bonus.max.stacks, inputs, obj, fromSelf));
  }

  return bonusValue;
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
  if (isUsableEffect(bonus, obj, inputs, fromSelf)) {
    const bonusValue = getBonusValue(bonus, inputs, preCalcStacks, obj, fromSelf);

    if (bonusValue) {
      for (const target of toArray(bonus.targets)) {
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
      }
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
