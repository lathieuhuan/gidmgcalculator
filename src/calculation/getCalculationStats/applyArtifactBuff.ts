import type { ArtifactBonus, BuffInfoWrap } from "@Src/types";
import { VISION_TYPES } from "@Src/constants";
import { applyModifier } from "../utils";
import { countVision, toArray } from "@Src/utils";
import { isFinalBonus } from "./utils";

const isUsableBonus = (bonus: ArtifactBonus, infoWrap: BuffInfoWrap, inputs: number[]) => {
  if (bonus.checkInput !== undefined && inputs[0] !== bonus.checkInput) {
    return false;
  }
  if (bonus.forWeapons && !bonus.forWeapons.includes(infoWrap.charData.weaponType)) {
    return false;
  }
  return true;
};

const getStackValue = (stack: NonNullable<ArtifactBonus["stacks"]>, info: BuffInfoWrap, inputs: number[]) => {
  switch (stack.type) {
    case "input":
      return inputs[stack.index ?? 0];
    case "attribute":
      return info.totalAttr[stack.field];
    case "vision":
      const { [info.charData.vision]: sameCount = 0, ...others } = countVision(info.partyData);

      switch (stack.element) {
        case "same_excluded":
          return sameCount;
        case "different":
          return Object.values(others as ReturnType<typeof countVision>).reduce((total, item) => total + item, 0);
      }
  }
};

const getBonusValue = (bonus: ArtifactBonus, info: BuffInfoWrap, inputs: number[]) => {
  let bonusValue = 0;

  if (typeof bonus.value === "number") {
    bonusValue += bonus.value;

    if (bonus.stacks) {
      if (!info.partyData.length && bonus.stacks.type === "vision") {
        return 0;
      }
      bonusValue *= getStackValue(bonus.stacks, info, inputs);
    }
  }
  if (bonus.sufExtra) bonusValue += bonus.sufExtra;
  if (bonus.max && bonusValue > bonus.max) bonusValue = bonus.max;

  return Math.max(bonusValue, 0);
};

interface ApplyArtifactBuffArgs {
  description: string;
  buff: { effects: ArtifactBonus | ArtifactBonus[] };
  infoWrap: BuffInfoWrap;
  inputs: number[];
  isFinal?: boolean;
}
const applyArtifactBuff = ({ description, buff, infoWrap: info, inputs, isFinal }: ApplyArtifactBuffArgs) => {
  const noIsFinal = isFinal === undefined;

  for (const bonus of toArray(buff.effects)) {
    if ((noIsFinal || isFinal === isFinalBonus(bonus.stacks)) && isUsableBonus(bonus, info, inputs)) {
      const bonusValue = getBonusValue(bonus, info, inputs);

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
            case "RXN":
              applyModifier(description, info.rxnBonus, mixed, bonusValue, info.tracker);
              break;
            case "INP_ELMT":
              const visionIndex = inputs[mixed ?? 0];
              applyModifier(description, info.totalAttr, VISION_TYPES[visionIndex], bonusValue, info.tracker);
              break;
          }
        }
      }
    }
  }
};

export default applyArtifactBuff;
