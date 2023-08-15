import { VISION_TYPES } from "@Src/constants";
import type { ArtifactBonus, BuffModifierArgsWrapper } from "@Src/types";
import { countVision } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";

interface ApplyArtifactBuffArgs {
  description: string;
  buff: ArtifactBonus;
  modifierArgs: BuffModifierArgsWrapper;
  inputs?: number[];
}
export const applyArtifactBuff = ({ description, buff, modifierArgs, inputs }: ApplyArtifactBuffArgs) => {
  let buffValue = buff.initialValue ?? 0;

  if (buff.checkInput !== undefined && inputs?.length) {
    if (typeof buff.checkInput === "number") {
      if (inputs[0] !== buff.checkInput) {
        return;
      }
    } else {
      const { value, index = 0 } = buff.checkInput;
      const input = inputs[index] ?? 0;

      if (input !== value) {
        return;
      }
    }
  }

  if (Array.isArray(buff.value)) {
    const index = (inputs?.[0] ?? 1) - 1;
    buffValue = buff.value[index];
  } else {
    let stacks = 1;

    switch (buff.stacks?.type) {
      case "input":
        const { index = 0 } = buff.stacks;
        stacks = inputs?.[index] ?? 1;
        break;
      case "vision":
        switch (buff.stacks.element) {
          case "same_excluded": {
            const { [modifierArgs.charData.vision]: same = 0 } = countVision(modifierArgs.partyData);
            stacks = same;
            break;
          }
          case "different": {
            const { [modifierArgs.charData.vision]: same, ...others } = countVision(modifierArgs.partyData);
            stacks = Object.keys(others).length;
            break;
          }
        }
        break;
      case "attribute":
        stacks = modifierArgs.totalAttr[buff.stacks.field];
        break;
    }
    buffValue += buff.value * stacks;
  }
  if (buff.max && buffValue > buff.max) {
    buffValue = buff.max;
  }

  switch (buff.target) {
    case "totalAttr":
      if (buff.path !== "input_element") {
        applyModifier(description, modifierArgs.totalAttr, buff.path, buffValue, modifierArgs.tracker);
      } else {
        const { inputIndex = 0 } = buff;
        const path = VISION_TYPES[inputs?.[inputIndex] ?? 0];
        applyModifier(description, modifierArgs.totalAttr, path, buffValue, modifierArgs.tracker);
      }
      break;
    case "attPattBonus":
      if (buff.weaponTypes && !buff.weaponTypes.includes(modifierArgs.charData.weaponType)) {
        return;
      }
      applyModifier(description, modifierArgs.attPattBonus, buff.path, buffValue, modifierArgs.tracker);
      break;
    case "rxnBonus":
      applyModifier(description, modifierArgs.rxnBonus, buff.path, buffValue, modifierArgs.tracker);
      break;
  }
};