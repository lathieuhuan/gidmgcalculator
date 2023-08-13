import type { AutoBuff, BuffModifierArgsWrapper, StackConfig } from "@Src/types";
import { countVision, toArray } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";

const getStackValue = (
  stack: StackConfig,
  inputs: number[],
  { charData, partyData, totalAttr }: BuffModifierArgsWrapper
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

const applyBuffValue = (
  buffValue: number,
  description: string,
  buff: AutoBuff,
  modifierArgs: BuffModifierArgsWrapper
) => {
  if (buffValue) {
    if (buff.targetAttribute) {
      const attributeKey = buff.targetAttribute === "own_element" ? modifierArgs.charData.vision : buff.targetAttribute;
      applyModifier(description, modifierArgs.totalAttr, attributeKey, buffValue, modifierArgs.tracker);
    }
    if (buff.targetAttPatt) {
      applyModifier(description, modifierArgs.attPattBonus, buff.targetAttPatt, buffValue, modifierArgs.tracker);
    }
  }
};

interface ApplyWeaponBuffArgs {
  description: string;
  buff: AutoBuff;
  refi: number;
  inputs: number[];
  modifierArgs: BuffModifierArgsWrapper;
}
export const applyWeaponBuff = ({ description, buff, refi, inputs, modifierArgs }: ApplyWeaponBuffArgs) => {
  const scaleRefi = (base: number, increment = base / 3) => base + increment * refi;

  if (buff.options && buff.stacks && !Array.isArray(buff.stacks)) {
    let buffValue = buff.options[getStackValue(buff.stacks, inputs, modifierArgs) - 1];
    buffValue = buffValue ? scaleRefi(buffValue) : buffValue;
    return applyBuffValue(buffValue, description, buff, modifierArgs);
  }
  if (!buff.base) {
    return;
  }
  const { charData, partyData } = modifierArgs;

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
      buffValue *= getStackValue(stack, inputs, modifierArgs);
    }
  }
  buffValue += initialValue;

  if (maxValue && buffValue > maxValue) {
    buffValue = maxValue;
  }
  applyBuffValue(buffValue, description, buff, modifierArgs);
};

// interface ApplyMainWeaponsBuffsArgs {
//   isFinal: boolean;
//   weaponData: AppWeapon;
//   refi: number;
//   wpBuffCtrls: ModifierCtrl[];
//   modifierArgs: BuffModifierArgsWrapper;
// }
// export const applyMainWeaponBuffs = ({
//   isFinal,
//   weaponData,
//   refi,
//   wpBuffCtrls,
//   modifierArgs,
// }: ApplyMainWeaponsBuffsArgs) => {
//   if (!weaponData.buffs) return;
//   const description = `${weaponData.name} activated`;

//   // #to-do: check if buff exist
//   for (const { activated, index, inputs = [] } of wpBuffCtrls) {
//     const buff = findByIndex(weaponData.buffs, index);
//     if (!activated || !buff) continue;

//     if (isFinal === checkFinal(buff.stacks)) {
//       applyWeaponBuff({ description, buff, refi, inputs, modifierArgs });
//     }
//     for (const buffBonus of buff.buffBonuses || []) {
//       const bonus = {
//         ...buffBonus,
//         base: buffBonus.base ?? buff.base,
//         stacks: buffBonus.stacks ?? buff.stacks,
//       };

//       if (isFinal === checkFinal(bonus.stacks)) {
//         applyWeaponBuff({ description, buff: bonus, refi, inputs, modifierArgs });
//       }
//     }
//   }
// };
