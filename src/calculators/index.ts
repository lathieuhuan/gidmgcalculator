import { findCharacter, getPartyData } from "@Data/controllers";
import { NORMAL_ATTACKS } from "@Src/constants";
import type {
  AttackElement,
  CalcCharData,
  CharInfo,
  FinalInfusion,
  ModifierCtrl,
  Party,
  Tracker,
  UsersSetupCalcInfo,
  Vision,
} from "@Src/types";
import { findByIndex } from "@Src/utils";
import getBuffedStats from "./buffStats";

export default function calculateAll(
  {
    char,
    selfBuffCtrls,
    party,
    weapon,
    wpBuffCtrls,
    subWpComplexBuffCtrls,
    artInfo,
    artBuffCtrls,
    subArtBuffCtrls,
    elmtModCtrls,
    customBuffCtrls,
  }: UsersSetupCalcInfo,
  charData: CalcCharData,
  tracker?: Tracker
) {
  const finalInfusion = getFinalInfusion(char, selfBuffCtrls, charData.vision, party);
  const partyData = getPartyData(party);

  const buffedStats = getBuffedStats({
    char,
    charData,
    selfBuffCtrls,
    weapon,
    wpBuffCtrls,
    subWpComplexBuffCtrls,
    artInfo,
    artBuffCtrls,
    subArtBuffCtrls,
    elmtModCtrls,
    party,
    partyData,
    customBuffCtrls,
    infusion: finalInfusion,
    tracker,
  });
  return {
    finalInfusion,
    ...buffedStats,
  };
}

const INFUSE_PRIORITIES = ["pyro", "cryo", "electro", "anemo", "phys"] as const;

function getFinalInfusion(
  char: CharInfo,
  selfBuffCtrls: ModifierCtrl[],
  ownVision: Vision,
  party: Party
) {
  const selfInfusion = [];
  const charData = findCharacter(char)!;

  for (const ctrl of selfBuffCtrls) {
    const buff = findByIndex(charData.buffs!, ctrl.index);

    if (buff && buff.infuseConfig && ctrl.activated && (!buff.isGranted || buff.isGranted(char))) {
      const { range, overwritable } = buff.infuseConfig;
      selfInfusion.push({ range, overwritable });
    }
  }
  const tmInfusion = [];

  for (const teammate of party) {
    if (!teammate) {
      continue;
    }
    const { buffs, vision } = findCharacter(teammate)!;

    for (const ctrl of teammate.buffCtrls) {
      const buff = findByIndex(buffs || [], ctrl.index);

      if (buff && buff.infuseConfig && ctrl.activated) {
        const { range, appliable } = buff.infuseConfig;

        if (!appliable || appliable(charData)) {
          tmInfusion.push({ vision, range });
        }
      }
    }
  }
  const result = {} as FinalInfusion;

  for (const type of NORMAL_ATTACKS) {
    const contenders: AttackElement[] = ["phys"];
    let isDone = false;

    for (const infusion of selfInfusion) {
      if (infusion.range.includes(type)) {
        if (!infusion.overwritable) {
          result[type] = ownVision;
          isDone = true;
          break;
        } else if (!contenders.includes(ownVision)) {
          contenders.unshift(ownVision);
        }
      }
    }
    if (!isDone) {
      const getIndex = (elmt: string) => {
        return INFUSE_PRIORITIES.indexOf(elmt as typeof INFUSE_PRIORITIES[number]);
      };

      for (const infusion of tmInfusion) {
        for (const index in contenders) {
          if (getIndex(infusion.vision) < getIndex(contenders[index])) {
            // no need infusion.range yet
            contenders.splice(+index, 0, infusion.vision);
            break;
          }
        }
      }
      result[type] = contenders[0];
    }
  }
  return result;
}
