import {
  CharacterBonusApplyCondition,
  CharacterBonusAvailableCondition,
  BuffModifierArgsWrapper,
  CharInfo,
  CharacterBonus,
  CharacterBonusModel,
  ModifierInput,
  Vision,
} from "@Src/types";
import { countVision, isGranted } from "@Src/utils";

export const isAvailable = (
  condition: CharacterBonusAvailableCondition,
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

export const isApplicable = (bonus: CharacterBonusApplyCondition, obj: BuffModifierArgsWrapper, inputs: number[]) => {
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

export const isCharacterBonus = (bonusModel: CharacterBonusModel): bonusModel is CharacterBonus => {
  return "value" in bonusModel;
};
