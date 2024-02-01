import { TALENT_LV_MULTIPLIERS } from "@Src/constants";
import {
  AvailableCondition_Character,
  LevelScale_Character,
  AttackElementBonus,
  AttackPatternBonus,
  CharInfo,
  ReactionBonus,
  ResistanceReduction,
  ResistanceReductionKey,
  TotalAttribute,
  TotalAttributeStat,
  Tracker,
  Vision,
  UsableCondition_Character,
  ExtendedUsableCondition_Character,
} from "@Src/types";
import { countVision, isGranted, toArray } from "@Src/utils";
import { AttackElementPath, AttackPatternPath, ReactionBonusPath, finalTalentLv } from "@Src/utils/calculation";
import { CalcUltilInfo } from "./types";

export class CharacterCal {
  static isAvailable = (
    condition: AvailableCondition_Character,
    char: CharInfo,
    inputs: number[],
    fromSelf: boolean
  ): boolean => {
    if (fromSelf) {
      if (!isGranted(condition, char)) return false;
    } else if (condition.alterIndex !== undefined && !inputs[condition.alterIndex]) {
      return false;
    }
    return true;
  };

  static isUsable = (
    condition: UsableCondition_Character,
    info: CalcUltilInfo,
    inputs: number[],
    fromSelf: boolean
  ): boolean => {
    if (!this.isAvailable(condition, info.char, inputs, fromSelf)) {
      return false;
    }
    const { checkInput } = condition;

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
    return true;
  };

  static isExtensivelyUsable = (
    condition: ExtendedUsableCondition_Character,
    info: CalcUltilInfo,
    inputs: number[],
    fromSelf: boolean
  ): boolean => {
    if (!this.isUsable(condition, info, inputs, fromSelf)) {
      return false;
    }
    const { partyElmtCount, partyOnlyElmts } = condition;

    if (condition.forWeapons && !condition.forWeapons.includes(info.charData.weaponType)) {
      return false;
    }
    if (condition.forElmts && !condition.forElmts.includes(info.charData.vision)) {
      return false;
    }
    const visions = countVision(info.partyData, info.charData);

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

  static getLevelScale = (
    scale: LevelScale_Character | undefined,
    info: CalcUltilInfo,
    inputs: number[],
    fromSelf: boolean
  ): number => {
    if (scale) {
      const { talent, value, alterIndex = 0, max } = scale;
      const level = fromSelf
        ? finalTalentLv({
            talentType: talent,
            char: info.char,
            charData: info.charData,
            partyData: info.partyData,
          })
        : inputs[alterIndex] ?? 0;

      const result = value ? TALENT_LV_MULTIPLIERS[value][level] : level;
      return max && result > max ? max : result;
    }
    return 1;
  };
}

type ModRecipient = TotalAttribute | ReactionBonus | AttackPatternBonus | AttackElementBonus | ResistanceReduction;

type ModRecipientKey =
  | TotalAttributeStat
  | TotalAttributeStat[]
  | ReactionBonusPath
  | ReactionBonusPath[]
  | AttackPatternPath
  | AttackPatternPath[]
  | AttackElementPath
  | AttackElementPath[]
  | ResistanceReductionKey
  | ResistanceReductionKey[];

type RootValue = number | number[];

export function applyModifier(
  desc: string | undefined,
  recipient: TotalAttribute,
  keys: TotalAttributeStat | TotalAttributeStat[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackPatternBonus,
  keys: AttackPatternPath | AttackPatternPath[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: AttackElementBonus,
  keys: AttackElementPath | AttackElementPath[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ReactionBonus,
  keys: ReactionBonusPath | ReactionBonusPath[],
  rootValue: RootValue,
  tracker?: Tracker
): void;
export function applyModifier(
  desc: string | undefined,
  recipient: ResistanceReduction,
  keys: ResistanceReductionKey | ResistanceReductionKey[],
  rootValue: RootValue,
  tracker?: Tracker
): void;

export function applyModifier(
  desc: string | undefined = "",
  recipient: ModRecipient,
  keys: ModRecipientKey,
  rootValue: RootValue,
  tracker?: Tracker
) {
  let trackerKey: keyof Tracker;

  if ("atk" in recipient) {
    trackerKey = "totalAttr";
  } else if ("all" in recipient) {
    trackerKey = "attPattBonus";
  } else if ("bloom" in recipient) {
    trackerKey = "rxnBonus";
  } else if ("def" in recipient) {
    trackerKey = "resistReduct";
  } else {
    trackerKey = "attElmtBonus";
  }

  toArray(keys).forEach((key, i) => {
    const [field, subField] = key.split(".");
    const value = Array.isArray(rootValue) ? rootValue[i] : rootValue;
    const node = {
      desc,
      value,
    };
    // recipient: TotalAttribute, ReactionBonus, ResistanceReduction
    if (subField === undefined) {
      (recipient as any)[field] += value;
      if (tracker) {
        (tracker as any)[trackerKey][field].push(node);
      }
    } else {
      (recipient as any)[field][subField] += value;
      if (tracker) {
        (tracker as any)[trackerKey][key].push(node);
      }
    }
  });
}
