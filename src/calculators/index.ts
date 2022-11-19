import type { AbilityBuff, CharData, ModifierCtrl, Tracker, UsersSetupCalcInfo } from "@Src/types";
import { findByIndex } from "@Src/utils";
import { findCharacter, getPartyData } from "@Data/controllers";
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
  const selfInfusion = checkSelfInfusion(dataChar.buffs || [], selfBuffCtrls);
  const infusedElement =
    selfInfusion === undefined || (selfInfusion === false && customInfusion.element !== "phys")
      ? customInfusion.element
      : dataChar.vision;
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

/** false = overwritable infusion. true = unoverwritable. undefined = no infusion */
function checkSelfInfusion(buffs: AbilityBuff[], selfBuffCtrls: ModifierCtrl[]) {
  let result: boolean | undefined = undefined;

  for (const { activated, index } of selfBuffCtrls) {
    if (activated) {
      const buff = findByIndex(buffs, index);

      if (buff && buff.infuseConfig) {
        if (buff.infuseConfig.overwritable) {
          result = false;
        } else {
          return true;
        }
      }
    }
  }

  return result;
}
