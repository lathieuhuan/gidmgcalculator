import type { WeaponBonus, BuffInfoWrap, WeaponStackConfig } from "@Src/types";
import { countVision, toArray } from "@Src/utils";
import { applyModifier } from "../utils";

const getStackValue = (
  stack: WeaponStackConfig,
  inputs: number[],
  { charData, partyData, totalAttr }: BuffInfoWrap
) => {
  switch (stack.type) {
    case "input": {
      const { index = 0, doubledAtInput } = stack;

      if (typeof index === "number") {
        let input = inputs[index] || 0;

        if (doubledAtInput && inputs[doubledAtInput]) {
          input *= 2;
        }
        return input;
      } else {
        const input = index.reduce(
          (total, { value, convertRate = 1 }) => total + (inputs[value] || 0) * convertRate,
          0
        );
        return input;
      }
    }
    case "attribute": {
      const { field, convertRate = 1, minus = 0 } = stack;
      const stackValue = (totalAttr[field] - minus) * convertRate;
      return stackValue;
    }
    case "vision": {
      const { element, max } = stack;
      let input = 0;

      switch (element) {
        case "same_included":
        case "same_excluded":
          let { [charData.vision]: sameCount = 0 } = countVision(partyData);
          if (element === "same_included") {
            sameCount++;
          }
          input = sameCount;
          break;
        case "different": {
          const { [charData.vision]: sameCount, ...others } = countVision(partyData);
          input = Object.values(others).reduce<number>((total, count) => total + (count as number) || 0, 0);
          break;
        }
      }
      if (max && input > max) {
        input = max;
      }

      return input;
    }
    case "energy": {
      return partyData.reduce((result, data) => result + (data?.EBcost || 0), charData.EBcost);
    }
    case "nation": {
      return partyData.reduce(
        (result, data) => result + (data?.nation === "liyue" ? 1 : 0),
        charData.nation === "liyue" ? 1 : 0
      );
    }
  }
};

const applyBuffValue = (buffValue: number, description: string, buff: WeaponBonus, modifierArgs: BuffInfoWrap) => {
  if (buffValue) {
    if (buff.targetAttribute) {
      const attributeKey = buff.targetAttribute === "own_elmt" ? modifierArgs.charData.vision : buff.targetAttribute;
      applyModifier(description, modifierArgs.totalAttr, attributeKey, buffValue, modifierArgs.tracker);
    }
    if (buff.targetAttPatt) {
      applyModifier(description, modifierArgs.attPattBonus, buff.targetAttPatt, buffValue, modifierArgs.tracker);
    }
  }
};

interface ApplyWeaponBuffArgs {
  description: string;
  buff: WeaponBonus;
  refi: number;
  inputs: number[];
  infoWrap: BuffInfoWrap;
}
const applyWeaponBuff = ({ description, buff, refi, inputs, infoWrap }: ApplyWeaponBuffArgs) => {
  const scaleRefi = (base: number, increment = base / 3) => base + increment * refi;

  if (buff.options && buff.stacks && !Array.isArray(buff.stacks)) {
    let buffValue = buff.options[getStackValue(buff.stacks, inputs, infoWrap) - 1];
    buffValue = buffValue ? scaleRefi(buffValue) : buffValue;
    return applyBuffValue(buffValue, description, buff, infoWrap);
  }
  if (!buff.base) {
    return;
  }
  const { charData, partyData } = infoWrap;

  if (buff.checkInput !== undefined) {
    if (typeof buff.checkInput === "number") {
      if (inputs[0] !== buff.checkInput) {
        return;
      }
    } else {
      const { index = 0, source, compareValue, compareType = "equal" } = buff.checkInput;
      let input = 0;

      if (source === "various_vision") {
        if (partyData.length) {
          input = Object.keys(countVision(partyData, charData)).length;
        } else return;
      } else {
        input = inputs[index];
      }

      switch (compareType) {
        case "equal":
          if (input !== compareValue) {
            return;
          }
          break;
        case "atleast":
          if (input < compareValue) {
            return;
          }
          break;
      }
    }
  }

  const { max } = buff;
  const maxValue = max ? (typeof max === "number" ? scaleRefi(max) : scaleRefi(max.base, max.increment)) : undefined;
  const initialValue = buff.initialBonus ? scaleRefi(buff.initialBonus) : 0;
  let buffValue = scaleRefi(buff.base, buff.increment);

  if (buff.stacks) {
    const stackArray = toArray(buff.stacks);

    for (const stack of stackArray) {
      if (["vision", "energy", "nation"].includes(stack.type) && !partyData.length) {
        return;
      }
      buffValue *= getStackValue(stack, inputs, infoWrap);
    }
  }
  buffValue += initialValue;

  if (maxValue && buffValue > maxValue) {
    buffValue = maxValue;
  }
  applyBuffValue(buffValue, description, buff, infoWrap);
};

export default applyWeaponBuff;
