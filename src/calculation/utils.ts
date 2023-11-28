import { TALENT_LV_MULTIPLIERS } from "@Src/constants";
import {
  AbilityEffectApplyCondition,
  AbilityEffectAvailableCondition,
  AbilityEffectLevelScale,
  AppCharacter,
  CharInfo,
  PartyData,
  Vision,
} from "@Src/types";
import { countVision, isGranted } from "@Src/utils";
import { finalTalentLv } from "@Src/utils/calculation";
import { CalcUltilObj } from "./types";

export const isAvailableEffect = (
  condition: AbilityEffectAvailableCondition,
  char: CharInfo,
  inputs: number[],
  fromSelf: boolean
) => {
  if (fromSelf) {
    if (!isGranted(condition, char)) return false;
  } else if (condition.alterIndex !== undefined && !inputs[condition.alterIndex]) {
    return false;
  }
  return true;
};

export const isApplicableEffect = (
  condition: AbilityEffectApplyCondition,
  obj: {
    charData: AppCharacter;
    partyData: PartyData;
  },
  inputs: number[]
) => {
  const { checkInput, partyElmtCount, partyOnlyElmts } = condition;

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
        else break;
      case "included":
        if (!inputs.includes(value)) return false;
        else break;
    }
  }
  if (condition.forWeapons && !condition.forWeapons.includes(obj.charData.weaponType)) {
    return false;
  }
  if (condition.forElmts && !condition.forElmts.includes(obj.charData.vision)) {
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

export const isUsableEffect = (
  condition: AbilityEffectAvailableCondition & AbilityEffectApplyCondition,
  obj: CalcUltilObj,
  inputs: number[],
  fromSelf: boolean
) => {
  return isAvailableEffect(condition, obj.char, inputs, fromSelf) && isApplicableEffect(condition, obj, inputs);
};

export const getLevelScale = (
  scale: AbilityEffectLevelScale | undefined,
  obj: CalcUltilObj,
  inputs: number[],
  fromSelf: boolean
) => {
  if (scale) {
    const { talent, value, alterIndex = 0 } = scale;
    const level = fromSelf
      ? finalTalentLv({
          talentType: talent,
          char: obj.char,
          charData: obj.charData,
          partyData: obj.partyData,
        })
      : inputs[alterIndex] ?? 0;

    return value ? TALENT_LV_MULTIPLIERS[value][level] : level;
  }
  return 1;
};
