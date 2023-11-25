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

export const getOptionByIndex = (options: number[], index: number) => {
  return options[index] ?? (index > 0 ? options[options.length - 1] : 1);
};

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

interface IsApplicableEffectArgs {
  charData: AppCharacter;
  partyData: PartyData;
}
export const isApplicableEffect = (
  bonus: AbilityEffectApplyCondition,
  obj: IsApplicableEffectArgs,
  inputs: number[]
) => {
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
      case "included":
        if (!inputs.includes(value)) return false;
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

type Obj = {
  char: CharInfo;
  charData: AppCharacter;
  partyData: PartyData;
};
export const getLevelScale = (
  scale: AbilityEffectLevelScale | undefined,
  inputs: number[],
  obj: Obj,
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

    if (typeof value === "number") {
      return value ? TALENT_LV_MULTIPLIERS[value][level] : level;
    } else {
      return getOptionByIndex(value, level - 1);
    }
  }
  return 1;
};
