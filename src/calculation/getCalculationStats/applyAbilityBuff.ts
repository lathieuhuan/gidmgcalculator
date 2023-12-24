import { VISION_TYPES } from "@Src/constants";
import {
  AbilityBonus,
  AbilityBonusStack,
  AbilityInnateBuff,
  AttackPatternInfoKey,
  BuffInfoWrap,
  CalcItemBuff,
  DynamicMax,
  AbilityEffectValueOption,
  ExtraMax,
} from "@Src/types";
import { countVision, toArray } from "@Src/utils";
import { finalTalentLv } from "@Src/utils/calculation";
import { CalcUltilInfo } from "../types";
import { getLevelScale, isAvailableEffect, isUsableEffect, applyModifier } from "../utils";
import { isFinalBonus } from "./utils";

const genExclusiveBuff = (
  desc: string,
  ids: string | string[],
  key: AttackPatternInfoKey,
  buffValue: number
): CalcItemBuff => {
  return {
    ids,
    bonus: {
      [key]: { desc, value: buffValue },
    },
  };
};

const getTotalExtraMax = (
  extras: ExtraMax | ExtraMax[] | undefined,
  info: CalcUltilInfo,
  inputs: number[],
  fromSelf: boolean
) => {
  let result = 0;

  if (extras) {
    for (const extra of toArray(extras)) {
      if (isUsableEffect(extra, info, inputs, fromSelf)) {
        result += extra.value;
      }
    }
  }
  return result;
};

const getMax = (max: number | DynamicMax, info: CalcUltilInfo, inputs: number[], fromSelf: boolean) => {
  return typeof max === "number" ? max : max.value + getTotalExtraMax(max.extras, info, inputs, fromSelf);
};

const getStackValue = (stack: AbilityBonusStack, info: BuffInfoWrap, inputs: number[], fromSelf: boolean): number => {
  let result = 1;

  switch (stack.type) {
    case "input": {
      const { index = 0, alterIndex } = stack;
      const finalIndex = alterIndex !== undefined && !fromSelf ? alterIndex : index;
      let input = inputs[finalIndex] ?? 0;

      if (stack.capacity) {
        const { value, extra } = stack.capacity;
        input = value - input;
        if (isUsableEffect(extra, info, inputs, fromSelf)) input += extra.value;
        input = Math.max(input, 0);
      }
      result = input;
      break;
    }
    case "attribute": {
      const { field, alterIndex = 0 } = stack;
      const stackValue = fromSelf ? info.totalAttr[field] : inputs[alterIndex] ?? 1;
      result = stackValue;
      break;
    }
    case "nation": {
      let count = info.partyData.reduce((total, teammate) => {
        return total + (teammate?.nation === info.charData.nation ? 1 : 0);
      }, 0);
      if (stack.nation === "different") {
        count = info.partyData.filter(Boolean).length - count;
      }
      result = count;
      break;
    }
    case "energy": {
      result = info.charData.EBcost;
      break;
    }
    case "resolve": {
      let [totalEnergy = 0, electroEnergy = 0] = inputs;
      if (info.char.cons >= 1 && electroEnergy <= totalEnergy) {
        totalEnergy += electroEnergy * 0.8 + (totalEnergy - electroEnergy) * 0.2;
      }
      const level = finalTalentLv({
        talentType: "EB",
        char: info.char,
        charData: info.charData,
        partyData: info.partyData,
      });
      const stackPerEnergy = Math.min(Math.ceil(14.5 + level * 0.5), 20);
      const stacks = Math.round(totalEnergy * stackPerEnergy) / 100;
      // const countResolve = (energyCost: number) => Math.round(energyCost * stackPerEnergy) / 100;

      result = Math.min(stacks, 60);
      break;
    }
  }

  if (stack.requiredBase) result -= stack.requiredBase;

  if (stack.extra && isAvailableEffect(stack.extra, info.char, inputs, fromSelf)) {
    result += stack.extra.value;
  }

  if (stack.max) {
    const max = getMax(stack.max, info, inputs, fromSelf);
    if (result > max) result = max;
  }

  return Math.max(result, 0);
};

export const getIntialBonusValue = (
  value: AbilityEffectValueOption,
  info: CalcUltilInfo,
  inputs: number[],
  fromSelf: boolean
) => {
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
      const visionCount = info.partyData.length ? countVision(info.partyData, info.charData) : {};
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
        char: info.char,
        charData: info.charData,
        partyData: info.partyData,
      });
      break;
  }

  if (value.extra && isAvailableEffect(value.extra, info.char, inputs, fromSelf)) {
    index += value.extra.value;
  }
  if (value.max) {
    const max = getMax(value.max, info, inputs, fromSelf);
    if (index > max) index = max;
  }

  return options[index] ?? (index > 0 ? options[options.length - 1] : 0);
};

function getBonusValue(
  bonus: Omit<AbilityBonus, "targets">,
  info: BuffInfoWrap,
  inputs: number[],
  fromSelf: boolean,
  preCalcStacks: number[]
) {
  const { value, preExtra } = bonus;
  let bonusValue = typeof value === "number" ? value : getIntialBonusValue(value, info, inputs, fromSelf);

  // ========== APPLY LEVEL SCALE ==========
  bonusValue *= getLevelScale(bonus.lvScale, info, inputs, fromSelf);

  // ========== ADD PRE-EXTRA ==========
  if (typeof preExtra === "number") {
    bonusValue += preExtra;
  } else if (preExtra && isUsableEffect(preExtra, info, inputs, fromSelf)) {
    bonusValue += getBonusValue(preExtra, info, inputs, fromSelf, preCalcStacks);
  }

  // ========== APPLY STACKS ==========
  if (bonus.stackIndex !== undefined) {
    bonusValue *= preCalcStacks[bonus.stackIndex] ?? 1;
  }
  if (bonus.stacks) {
    for (const stack of toArray(bonus.stacks)) {
      if (!info.partyData.length && ["nation", "resolve"].includes(stack.type)) {
        return 0;
      }
      bonusValue *= getStackValue(stack, info, inputs, fromSelf);
    }
  }
  // ========== APPLY MAX ==========
  if (typeof bonus.max === "number") {
    bonusValue = Math.min(bonusValue, bonus.max);
  } else if (bonus.max) {
    let finalMax = bonus.max.value;

    if (bonus.max.stacks) {
      finalMax *= getStackValue(bonus.max.stacks, info, inputs, fromSelf);
    }
    finalMax += getTotalExtraMax(bonus.max.extras, info, inputs, fromSelf);

    bonusValue = Math.min(bonusValue, finalMax);
  }

  return bonusValue;
}

const isTrulyFinalBonus = (bonus: AbilityBonus, cmnStacks: AbilityBonusStack[]) => {
  return (
    isFinalBonus(bonus.stacks) ||
    (typeof bonus.preExtra === "object" && isFinalBonus(bonus.preExtra.stacks)) ||
    (bonus.stackIndex !== undefined && isFinalBonus(cmnStacks[bonus.stackIndex]))
  );
};

interface ApplyAbilityBuffArgs {
  description: string;
  buff: AbilityInnateBuff;
  infoWrap: BuffInfoWrap;
  inputs: number[];
  fromSelf: boolean;
  isFinal?: boolean;
}
const applyAbilityBuff = ({ description, buff, infoWrap: info, inputs, fromSelf, isFinal }: ApplyAbilityBuffArgs) => {
  if (buff.effects) {
    const cmnStacks = buff.cmnStacks ? toArray(buff.cmnStacks) : [];
    const commonStacks = cmnStacks.map((cmnStack) => getStackValue(cmnStack, info, inputs, fromSelf));
    const noIsFinal = isFinal === undefined;

    for (const bonus of toArray(buff.effects)) {
      if (
        (noIsFinal || isFinal === isTrulyFinalBonus(bonus, cmnStacks)) &&
        isUsableEffect(bonus, info, inputs, fromSelf)
      ) {
        const bonusValue = getBonusValue(bonus, info, inputs, fromSelf, commonStacks);

        if (bonusValue) {
          for (const [key, value] of Object.entries(bonus.targets)) {
            const mixed = value as any;

            switch (key) {
              case "ATTR":
                applyModifier(description, info.totalAttr, mixed, bonusValue, info.tracker);
                break;
              case "PATT":
                applyModifier(description, info.attPattBonus, mixed, bonusValue, info.tracker);
                break;
              case "ELMT":
                applyModifier(description, info.attElmtBonus, mixed, bonusValue, info.tracker);
                break;
              case "RXN":
                applyModifier(description, info.rxnBonus, mixed, bonusValue, info.tracker);
                break;
              case "ITEM":
                info.calcItemBuffs.push(genExclusiveBuff(description, mixed.id, mixed.path, bonusValue));
                break;
              case "INP_ELMT":
                const visionIndex = inputs[mixed ?? 0];
                applyModifier(description, info.totalAttr, VISION_TYPES[visionIndex], bonusValue, info.tracker);
                break;
              case "ELM_NA":
                if (info.charData.weaponType === "catalyst" || info.infusedElement !== "phys") {
                  applyModifier(description, info.attPattBonus, "NA.pct_", bonusValue, info.tracker);
                }
                break;
            }
          }
        }
      }
    }
  }
};

export default applyAbilityBuff;
