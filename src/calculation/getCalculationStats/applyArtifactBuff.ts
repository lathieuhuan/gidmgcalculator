import type { ArtifactBonus, BuffInfoWrap } from "@Src/types";
import { VISION_TYPES } from "@Src/constants";
import { applyModifier } from "../utils";

interface ApplyArtifactBuffArgs {
  description: string;
  buff: ArtifactBonus;
  infoWrap: BuffInfoWrap;
  inputs?: number[];
}
const applyArtifactBuff = ({ description, buff, infoWrap, inputs }: ApplyArtifactBuffArgs) => {
  let buffValue = buff.initialValue ?? 0;

  if (buff.checkInput !== undefined && inputs?.length) {
    if (inputs[0] !== buff.checkInput) {
      return;
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

        if (typeof index === "number") {
          stacks = inputs?.[index] ?? 1;
        } else {
          const { value = 0, convertRate } = index;
          stacks = (inputs?.[value] ?? 1) * convertRate;
        }
        break;
      case "vision":
        let sameCount = 0;
        let diffCount = 0;

        for (const teammate of infoWrap.partyData) {
          if (teammate) {
            teammate.vision === infoWrap.charData.vision ? sameCount++ : diffCount++;
          }
        }
        switch (buff.stacks.element) {
          case "same_excluded": {
            stacks = sameCount;
            break;
          }
          case "different": {
            stacks = diffCount;
            break;
          }
        }
        break;
      case "attribute":
        stacks = infoWrap.totalAttr[buff.stacks.field];
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
        applyModifier(description, infoWrap.totalAttr, buff.path, buffValue, infoWrap.tracker);
      } else {
        const { inputIndex = 0 } = buff;
        const path = VISION_TYPES[inputs?.[inputIndex] ?? 0];
        applyModifier(description, infoWrap.totalAttr, path, buffValue, infoWrap.tracker);
      }
      break;
    case "attPattBonus":
      if (buff.weaponTypes && !buff.weaponTypes.includes(infoWrap.charData.weaponType)) {
        return;
      }
      applyModifier(description, infoWrap.attPattBonus, buff.path, buffValue, infoWrap.tracker);
      break;
    case "rxnBonus":
      applyModifier(description, infoWrap.rxnBonus, buff.path, buffValue, infoWrap.tracker);
      break;
  }
};

export default applyArtifactBuff;
