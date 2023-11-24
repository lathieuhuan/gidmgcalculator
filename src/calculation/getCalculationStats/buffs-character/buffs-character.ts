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
import { countVision, isGranted, toArray } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { isFinalBonus } from "../utils";
import { isApplicable, isAvailable, isCharacterBonus } from "./utils";

const getOptionByIndex = (options: number[], index: number) => {
  return options[index] ?? (index > 0 ? options[options.length - 1] : 1);
};

const getStackValue = (
  stack: CharacterBonusStack,
  inputs: number[],
  obj: BuffModifierArgsWrapper,
  fromSelf: boolean
): number => {
  let result = 1;
  let extra = 0;

  if (stack.extra && isAvailable(stack.extra, obj.char, inputs, fromSelf)) {
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

const getBuffValue = (
  bonus: Omit<CharacterBonus, "targets">,
  inputs: number[],
  preCalcStacks: number[],
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
      buffValue *= getOptionByIndex(value, level - 1);
    }
  }
  if (typeof preExtra === "number") {
    buffValue += preExtra;
  } else if (preExtra && isAvailable(preExtra, obj.char, inputs, fromSelf) && isApplicable(preExtra, obj, inputs)) {
    buffValue += getBuffValue(preExtra, inputs, preCalcStacks, obj, fromSelf);
  }

  if (bonus.stackIndex !== undefined) {
    buffValue *= preCalcStacks[bonus.stackIndex] ?? 1;
  }
  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      buffValue *= getStackValue(stack, inputs, obj, fromSelf);
    }
  }
  if (typeof bonus.max === "number") {
    buffValue = Math.min(buffValue, bonus.max);
  } else if (bonus.max) {
    buffValue = Math.min(buffValue, bonus.max.value * getStackValue(bonus.max.stacks, inputs, obj, fromSelf));
  }

  return buffValue;
};

const applyBuffValue = (
  description: string,
  target: CharacterBonusTarget,
  buffValue: number,
  obj: BuffModifierArgsWrapper,
  inputs: number[]
) => {
  switch (target.type) {
    case "ATTR":
      return applyModifier(description, obj.totalAttr, target.path, buffValue, obj.tracker);
    case "PATT":
      return applyModifier(description, obj.attPattBonus, target.path, buffValue, obj.tracker);
    case "ELMT":
      return applyModifier(description, obj.attElmtBonus, target.path, buffValue, obj.tracker);
    case "RXN":
      return applyModifier(description, obj.rxnBonus, target.path, buffValue, obj.tracker);
    case "ITEM":
      return obj.calcItemBuffs.push(genExclusiveBuff(description, target.id, target.path, buffValue));
    case "IN_ELMT":
      const visionIndex = inputs[target.index || 0];
      return applyModifier(description, obj.totalAttr, VISION_TYPES[visionIndex], buffValue, obj.tracker);
    case "ELM_NA":
      if (obj.charData.weaponType === "catalyst" || obj.infusedElement !== "phys") {
        applyModifier(description, obj.attPattBonus, "NA.pct_", buffValue, obj.tracker);
      }
      return;
  }
};

interface ApplyCharacterBuffArgs {
  description: string;
  bonus: CharacterBonus;
  inputs: number[];
  preCalcStacks?: number[];
  modifierArgs: BuffModifierArgsWrapper;
  fromSelf: boolean;
}
const applyCharacterBonus = ({
  description,
  bonus,
  inputs,
  preCalcStacks = [],
  modifierArgs: obj,
  fromSelf,
}: ApplyCharacterBuffArgs) => {
  if (!isAvailable(bonus, obj.char, inputs, fromSelf) || !isApplicable(bonus, obj, inputs)) {
    return;
  }
  const buffValue = getBuffValue(bonus, inputs, preCalcStacks, obj, fromSelf);

  if (buffValue) {
    for (const target of toArray(bonus.targets)) {
      applyBuffValue(description, target, buffValue, obj, inputs);
    }
  }
};

interface ApplyCharacterBonusesArgs extends Omit<ApplyCharacterBuffArgs, "bonus" | "preCalcStacks"> {
  bonuses: CharacterBonusModel | CharacterBonusModel[];
  inputs: ModifierInput[];
  isFinal?: boolean;
}
export const applyCharacterBonuses = ({ bonuses, isFinal, ...others }: ApplyCharacterBonusesArgs) => {
  const noIsFinal = isFinal === undefined;

  for (const bonus of toArray(bonuses)) {
    if (isCharacterBonus(bonus)) {
      const isTrulyFinalBonus =
        isFinalBonus(bonus.stacks) || (typeof bonus.preExtra === "object" && isFinalBonus(bonus.preExtra.stacks));

      if (noIsFinal || isFinal === isTrulyFinalBonus) {
        applyCharacterBonus({
          bonus,
          ...others,
        });
      }
    } else if (noIsFinal || isFinal === isFinalBonus(bonus.stacks)) {
      const preCalcStacks = toArray(bonus.stacks).map((stack) =>
        getStackValue(stack, others.inputs, others.modifierArgs, others.fromSelf)
      );

      for (const subBonus of bonus.children) {
        applyCharacterBonus({
          bonus: subBonus,
          preCalcStacks,
          ...others,
        });
      }
    }
  }
};
