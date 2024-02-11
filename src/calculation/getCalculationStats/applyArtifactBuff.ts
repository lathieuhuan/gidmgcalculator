import type { ArtifactBonus, BuffInfoWrap } from "@Src/types";
import { ELEMENT_TYPES } from "@Src/constants";
import { countElements, toArray } from "@Src/utils";
import { applyModifier } from "../utils";
import { isFinalBonus } from "./utils";

const isUsableBonus = (
  condition: Pick<ArtifactBonus, "checkInput" | "forWeapons">,
  info: BuffInfoWrap,
  inputs: number[]
) => {
  if (condition.checkInput !== undefined && inputs[0] !== condition.checkInput) {
    return false;
  }
  if (condition.forWeapons && !condition.forWeapons.includes(info.appChar.weaponType)) {
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
      const { [info.appChar.vision]: sameCount = 0, ...others } = countElements(info.partyData);

      switch (stack.element) {
        case "same_excluded":
          return sameCount;
        case "different":
          return Object.values(others as ReturnType<typeof countElements>).reduce((total, item) => total + item, 0);
      }
  }
};

const getBonusValue = (bonus: Omit<ArtifactBonus, "targets">, info: BuffInfoWrap, inputs: number[]) => {
  let bonusValue = 0;

  if (typeof bonus.value === "number") {
    bonusValue += bonus.value;

    if (bonus.stacks) {
      if (!info.partyData.length && bonus.stacks.type === "vision") {
        return 0;
      }
      bonusValue *= getStackValue(bonus.stacks, info, inputs);
    }
  } else {
    const { options, inpIndex = 0 } = bonus.value;
    const input = inputs[inpIndex] ?? 1;
    bonusValue = options[input - 1] || options[options.length - 1];
  }
  if (typeof bonus.sufExtra === "number") {
    bonusValue += bonus.sufExtra;
  } else if (bonus.sufExtra && isUsableBonus(bonus.sufExtra, info, inputs)) {
    bonusValue += getBonusValue(bonus.sufExtra, info, inputs);
  }

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
              const elmtIndex = inputs[mixed ?? 0];
              applyModifier(description, info.totalAttr, ELEMENT_TYPES[elmtIndex], bonusValue, info.tracker);
              break;
          }
        }
      }
    }
  }
};

export default applyArtifactBuff;
