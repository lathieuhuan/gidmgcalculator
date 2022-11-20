import type { CharData, UsersSetupCalcInfo } from "@Src/types";
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
    target,
  }: UsersSetupCalcInfo,
  charData: CharData,
  tracker?: Tracker
) {
  const dataChar = findCharacter(char)!;
  /** false = overwritable infusion. true = unoverwritable. undefined = no infusion */
  let selfInfused: boolean | undefined = undefined;
  let disabledNAs = false;

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

  const infusedElement =
    customInfusion.element !== "phys"
      ? customInfusion.element
      : selfInfused
      ? dataChar.vision
      : "phys";
  const partyData = getPartyData(party);

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
    infusedElement,
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
