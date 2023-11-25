import { TALENT_LV_MULTIPLIERS } from "@Src/constants";
import {
  AppCharacter,
  CharacterBonusAvailableCondition,
  CharacterEffectLevelScale,
  CharInfo,
  PartyData,
} from "@Src/types";
import { isGranted } from "@Src/utils";
import { finalTalentLv } from "@Src/utils/calculation";

export const getOptionByIndex = (options: number[], index: number) => {
  return options[index] ?? (index > 0 ? options[options.length - 1] : 1);
};

export const isAvailable = (
  condition: CharacterBonusAvailableCondition,
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

type Obj = {
  char: CharInfo;
  charData: AppCharacter;
  partyData: PartyData;
};
export const getLevelScale = (
  scale: CharacterEffectLevelScale | undefined,
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
