import type { WeaponBonus, BuffInfoWrap, WeaponBonusStack, WeaponBuff } from "@Src/types";
import { countVision, toArray } from "@Src/utils";
import { applyModifier } from "../utils";
import { isFinalBonus } from "./utils";

const isUsableBonus = (bonus: WeaponBonus, info: BuffInfoWrap, inputs: number[]) => {
  if (typeof bonus.checkInput === "number") {
    if (inputs[0] !== bonus.checkInput) {
      return false;
    }
  } else if (bonus.checkInput) {
    const { source = 0, value, type = "equal" } = bonus.checkInput;
    let input = 0;

    if (source === "various_vision") {
      if (info.partyData.length) {
        input = Object.keys(countVision(info.partyData, info.charData)).length;
      } else {
        return false;
      }
    } else {
      input = inputs[source];
    }

    switch (type) {
      case "equal":
        if (input !== value) return false;
        break;
      case "min":
        if (input < value) return false;
        break;
    }
  }
  return true;
};

const getStackValue = (stack: WeaponBonusStack, { charData, partyData, totalAttr }: BuffInfoWrap, inputs: number[]) => {
  switch (stack.type) {
    case "input": {
      const { index = 0, doubledAt } = stack;

      if (typeof index === "number") {
        let stackValue = inputs[index] ?? 0;

        if (doubledAt !== undefined && inputs[doubledAt]) {
          stackValue *= 2;
        }
        return stackValue;
      }
      return index.reduce((total, { value, ratio = 1 }) => total + (inputs[value] ?? 0) * ratio, 0);
    }
    case "attribute": {
      const stackValue = totalAttr[stack.field];
      if (stack.baseline && stackValue < stack.baseline) return 0;
      return stackValue;
    }
    case "vision": {
      const { element, max } = stack;
      const { [charData.vision]: sameCount = 0, ...others } = countVision(partyData);
      let stackValue = 0;

      if (element === "different") {
        stackValue = Object.values(others as Record<string, number>).reduce((total, count) => total + count, 0);
      } else {
        stackValue = sameCount + (element === "same_included" ? 1 : 0);
      }

      return max ? Math.min(stackValue, max) : stackValue;
    }
    case "energy": {
      return partyData.reduce((result, data) => result + (data?.EBcost ?? 0), charData.EBcost);
    }
    case "nation": {
      return partyData.reduce(
        (result, data) => result + (data?.nation === "liyue" ? 1 : 0),
        charData.nation === "liyue" ? 1 : 0
      );
    }
  }
};

const getBonusValue = (
  bonus: WeaponBonus,
  info: BuffInfoWrap,
  inputs: number[],
  refi: number,
  preCalcStacks: number[]
) => {
  let bonusValue = 0;
  const scaleRefi = (base: number, increment = base / 3) => base + increment * refi;

  if (typeof bonus.value === "number") {
    bonusValue = scaleRefi(bonus.value, bonus.incre);

    // ========== APPLY STACKS ==========
    for (const stackValue of preCalcStacks) {
      bonusValue *= stackValue;
    }
    if (bonus.stacks) {
      for (const stack of toArray(bonus.stacks)) {
        if (!info.partyData.length && ["vision", "energy", "nation"].includes(stack.type)) {
          return 0;
        }
        bonusValue *= getStackValue(stack, info, inputs);
      }
    }
  } else {
    const { options, inpIndex = 0 } = bonus.value;
    const index = (inputs[inpIndex] ?? 0) - 1;

    if (options[index]) {
      bonusValue = scaleRefi(options[index]);
    }
  }

  // ========== ADD SUF-EXTRA ==========
  bonusValue += bonus.sufExtra ? scaleRefi(bonus.sufExtra) : 0;

  // ========== APPLY MAX ==========
  let max = 0;
  if (typeof bonus.max === "number") {
    max = scaleRefi(bonus.max);
  } else if (bonus.max) {
    max = scaleRefi(bonus.max.value, bonus.max.incre);
  }
  if (max) bonusValue = Math.min(bonusValue, max);

  return Math.max(bonusValue, 0);
};

const isTrulyFinalBonus = (bonus: WeaponBonus, cmnStacks: WeaponBonus["stacks"]) => {
  return isFinalBonus(bonus.stacks) || isFinalBonus(cmnStacks);
};

interface ApplyWeaponBuffArgs {
  description: string;
  buff: Pick<WeaponBuff, "cmnStacks" | "effects">;
  infoWrap: BuffInfoWrap;
  inputs: number[];
  refi: number;
  isFinal?: boolean;
}
const applyWeaponBuff = ({ description, buff, infoWrap: info, inputs, refi, isFinal }: ApplyWeaponBuffArgs) => {
  const cmnStacks = buff.cmnStacks ? toArray(buff.cmnStacks) : [];
  const commonStacks = cmnStacks.map((cmnStack) => getStackValue(cmnStack, info, inputs));
  const noIsFinal = isFinal === undefined;

  for (const bonus of toArray(buff.effects)) {
    if ((noIsFinal || isFinal === isTrulyFinalBonus(bonus, cmnStacks)) && isUsableBonus(bonus, info, inputs)) {
      const bonusValue = getBonusValue(bonus, info, inputs, refi, commonStacks);

      if (bonusValue) {
        const { ATTR, PATT } = bonus.targets;
        if (ATTR) {
          const attributeKey = ATTR === "own_elmt" ? info.charData.vision : ATTR;
          applyModifier(description, info.totalAttr, attributeKey, bonusValue, info.tracker);
        }
        if (PATT) {
          applyModifier(description, info.attPattBonus, PATT, bonusValue, info.tracker);
        }
      }
    }
  }
};

export default applyWeaponBuff;
