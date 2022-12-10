import type { CalcSetup, CharData, Target } from "@Src/types";
import { findByIndex } from "@Src/utils";
import { findCharacter, getPartyData } from "@Data/controllers";
import getBuffedStats from "./buffStats";
import getDamage from "./damage";
import type { Tracker } from "./types";

export default function calculateAll(
  {
    char,
    selfBuffCtrls,
    selfDebuffCtrls,
    party,
    weapon,
    wpBuffCtrls,
    artInfo,
    artBuffCtrls,
    artDebuffCtrls,
    elmtModCtrls,
    customBuffCtrls,
    customDebuffCtrls,
    customInfusion,
  }: CalcSetup,
  target: Target,
  charData: CharData,
  tracker?: Tracker
) {
  const dataChar = findCharacter(char)!;
  const partyData = getPartyData(party);
  let infusedElement = customInfusion.element;
  let isCustomInfusion = true;
  let disabledNAs = false;

  /** false = overwritable infusion. true = unoverwritable. undefined = no infusion */
  let selfInfused: boolean | undefined = undefined;

  if (dataChar.buffs) {
    for (const { activated, index } of selfBuffCtrls) {
      if (activated) {
        const buff = findByIndex(dataChar.buffs, index);

        if (buff && buff.infuseConfig) {
          if (!selfInfused) {
            selfInfused = !buff.infuseConfig.overwritable;
          }
          if (!disabledNAs) {
            disabledNAs = buff.infuseConfig.disabledNAs || false;
          }
        }
      }
    }
  }

  if (infusedElement === "phys" && selfInfused !== undefined) {
    infusedElement = dataChar.vision;
    isCustomInfusion = false;
  } else if (infusedElement === dataChar.vision) {
    isCustomInfusion = false;
  }

  const { totalAttr, artAttr, attPattBonus, attElmtBonus, rxnBonus } = getBuffedStats({
    char,
    charData,
    dataChar,
    selfBuffCtrls,
    weapon,
    wpBuffCtrls,
    artInfo,
    artBuffCtrls,
    elmtModCtrls,
    party,
    partyData,
    customBuffCtrls,
    infusedElement,
    tracker,
  });

  const dmgResult = getDamage({
    char,
    charData,
    dataChar,
    selfBuffCtrls,
    selfDebuffCtrls,
    artDebuffCtrls,
    party,
    partyData,
    disabledNAs,
    totalAttr,
    attPattBonus,
    attElmtBonus,
    rxnBonus,
    customDebuffCtrls,
    infusion: {
      element: infusedElement,
      isCustom: isCustomInfusion,
    },
    elmtModCtrls,
    target,
    tracker,
  });
  return {
    infusedElement,
    totalAttr,
    artAttr,
    rxnBonus,
    dmgResult,
  };
}
