import type { CalcSetup, NormalAttack, Target, Tracker } from "@Src/types";
import { findByIndex } from "@Src/utils";
import { appData } from "@Data/index";
import getBuffedStats from "./buffStats";
import getDamage from "./damage";

export default function calculateAll(
  {
    char,
    selfBuffCtrls,
    selfDebuffCtrls,
    party,
    weapon,
    wpBuffCtrls,
    artifacts,
    artBuffCtrls,
    artDebuffCtrls,
    elmtModCtrls,
    customBuffCtrls,
    customDebuffCtrls,
    customInfusion,
  }: CalcSetup,
  target: Target,
  tracker?: Tracker
) {
  const charData = appData.getCharData(char.name);
  const partyData = appData.getPartyData(party);
  let infusedElement = customInfusion.element;
  let infusedAttacks: NormalAttack[] = ["NA", "CA", "PA"];
  let isCustomInfusion = true;
  let disabledNAs = false;

  /** false = overwritable infusion. true = unoverwritable. undefined = no infusion */
  let selfInfused: boolean | undefined = undefined;

  if (charData.buffs) {
    for (const { activated, index } of selfBuffCtrls) {
      if (activated) {
        const buff = findByIndex(charData.buffs, index);

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
    infusedElement = charData.vision;
    isCustomInfusion = false;
  } else if (infusedElement === charData.vision) {
    isCustomInfusion = false;
  }

  if (charData.weaponType === "bow") {
    infusedAttacks = ["NA"];
  }

  const { totalAttr, artAttr, attPattBonus, attElmtBonus, calcItemBuffs, rxnBonus } = getBuffedStats({
    char,
    charData,
    selfBuffCtrls,
    weapon,
    wpBuffCtrls,
    artifacts,
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
    selfBuffCtrls,
    selfDebuffCtrls,
    artDebuffCtrls,
    party,
    partyData,
    disabledNAs,
    totalAttr,
    attPattBonus,
    attElmtBonus,
    calcItemBuffs,
    rxnBonus,
    customDebuffCtrls,
    infusion: {
      element: infusedElement,
      isCustom: isCustomInfusion,
      range: infusedAttacks,
    },
    elmtModCtrls,
    target,
    tracker,
  });
  return {
    infusedElement,
    infusedAttacks,
    totalAttr,
    artAttr,
    rxnBonus,
    dmgResult,
  };
}
