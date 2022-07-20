import { findCharacter, getPartyData } from "@Data/controllers";
import { NORMAL_ATTACKS } from "@Src/constants";
import type {
  AttackElement,
  CalcArtInfo,
  CalcCharData,
  CalcWeapon,
  CharInfo,
  CustomBuffCtrl,
  CustomDebuffCtrl,
  ElementModCtrl,
  FinalInfusion,
  ModifierCtrl,
  Party,
  SubArtModCtrl,
  SubWeaponComplexBuffCtrl,
  Target,
  Tracker,
  Vision,
} from "@Src/types";
import { findByIndex } from "@Src/utils";
import getBuffedStats from "./buffStats";
import getDamage from "./damage";

export const charDataSelect = "code name nation vision weapon";

export default function calculateAll(
  char: CharInfo,
  charData: CalcCharData,
  selfBuffCtrls: ModifierCtrl[],
  selfDebuffCtrls: ModifierCtrl[],
  party: Party,
  weapon: CalcWeapon,
  wpBuffCtrls: ModifierCtrl[],
  subWpComplexBuffCtrls: SubWeaponComplexBuffCtrl,
  artInfo: CalcArtInfo,
  artBuffCtrls: ModifierCtrl[],
  subArtBuffCtrls: SubArtModCtrl[],
  subArtDebuffCtrls: SubArtModCtrl[],
  elmtModCtrls: ElementModCtrl,
  customBuffCtrls: CustomBuffCtrl[],
  customDebuffCtrls: CustomDebuffCtrl[],
  target: Target,
  tracker?: Tracker
) {
  const finalInfusion = getFinalInfusion(char, selfBuffCtrls, charData.vision, party);
  const partyData = getPartyData(party);

  const [totalAttr, attPattBonus, attElmtBonus, rxnBonus, artAttrs] = getBuffedStats(
    char,
    charData,
    selfDebuffCtrls,
    weapon,
    wpBuffCtrls,
    subWpComplexBuffCtrls,
    artInfo,
    artBuffCtrls,
    subArtBuffCtrls,
    elmtModCtrls.resonance,
    party,
    partyData,
    customBuffCtrls,
    finalInfusion,
    tracker
  );
  const damage = getDamage(
    char,
    selfBuffCtrls,
    selfDebuffCtrls,
    party,
    partyData,
    subArtDebuffCtrls,
    totalAttr,
    attPattBonus,
    attElmtBonus,
    rxnBonus,
    customDebuffCtrls,
    finalInfusion,
    elmtModCtrls,
    target,
    tracker
  );
  return [
    finalInfusion,
    totalAttr,
    attPattBonus,
    attElmtBonus,
    rxnBonus,
    artAttrs,
    damage,
  ] as const;
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

    if (buff && buff.infuseConfig && ctrl.activated && buff.isGranted(char)) {
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
        const { range, isAppliable } = buff.infuseConfig;

        if (!isAppliable || isAppliable(charData)) {
          tmInfusion.push({ vision, range });
        }
      }
    }
  }
  const result = {} as FinalInfusion;

  topLoop: for (const type of NORMAL_ATTACKS) {
    const contenders: AttackElement[] = ["phys"];

    for (const infusion of selfInfusion) {
      if (infusion.range.includes(type)) {
        if (!infusion.overwritable) {
          result[type] = ownVision;
          break topLoop;
        } else if (!contenders.includes(ownVision)) {
          contenders.unshift(ownVision);
        }
      }
    }
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
  return result;
}
