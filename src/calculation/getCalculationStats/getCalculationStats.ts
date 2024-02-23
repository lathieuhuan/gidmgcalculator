import type {
  AttackElement,
  AttackElementInfoKey,
  AttackPatternBonusKey,
  AttributeStat,
  BuffInfoWrap,
  Reaction,
  ReactionBonusInfoKey,
  Teammate,
} from "@Src/types";
import type { GetCalculationStatsArgs, UsedEffect } from "../types";

import { $AppCharacter, $AppData } from "@Src/services";
import { AMPLIFYING_REACTIONS, CORE_STAT_TYPES, QUICKEN_REACTIONS, TRANSFORMATIVE_REACTIONS } from "@Src/constants";
import { RESONANCE_STAT } from "../constants";

// Util
import { applyPercent, findByIndex, isGranted, realParty, toArray, weaponSubStatValue } from "@Src/utils";
import { getArtifactSetBonuses, getQuickenBuffDamage, getRxnBonusesFromEM } from "@Src/utils/calculation";
import { applyModifier } from "../utils";
import { addArtifactAttributes, addTrackerRecord, initiateBonuses, initiateTotalAttr } from "./utils";
import applyAbilityBuff from "./applyAbilityBuff";
import applyArtifactBuff from "./applyArtifactBuff";
import applyWeaponBuff from "./applyWeaponBuff";

export const getCalculationStats = ({
  char,
  appChar,
  selfBuffCtrls,
  weapon,
  wpBuffCtrls,
  artifacts,
  artBuffCtrls,
  elmtModCtrls,
  party,
  partyData = [],
  customBuffCtrls,
  infusedElement,
  tracker,
}: GetCalculationStatsArgs) => {
  const { resonances = [], reaction, infuse_reaction } = elmtModCtrls || {};
  const { refi } = weapon;
  const setBonuses = getArtifactSetBonuses(artifacts);

  const appWeapon = $AppData.getWeapon(weapon.code)!;
  const totalAttr = initiateTotalAttr({ char, appChar, weapon, appWeapon, tracker });
  const { attPattBonus, attElmtBonus, rxnBonus, calcItemBuffs } = initiateBonuses();

  // const usedWeaponMods: UsedMod[] = [];
  const usedArtifactEffects: UsedEffect[] = [];

  const isNewArtifactEffect = (itemCode: number, modIndex: number, effectTarget: string | string[]) => {
    const effectTargets = toArray(effectTarget);
    for (const effect of usedArtifactEffects) {
      if (
        effect.itemCode !== itemCode ||
        effect.modIndex !== modIndex ||
        effectTargets.every((item) => !effect.effectTargets.includes(item))
      ) {
        return true;
      }
    }
    usedArtifactEffects.push({ itemCode, modIndex, effectTargets });
    return false;
  };

  const infoWrap: BuffInfoWrap = {
    char,
    appChar,
    partyData,
    totalAttr,
    attPattBonus,
    attElmtBonus,
    calcItemBuffs,
    rxnBonus,
    infusedElement,
    tracker,
  };

  const APPLY_SELF_BUFFS = (isFinal: boolean) => {
    const charBuffCtrls = selfBuffCtrls || [];
    const { innateBuffs = [], buffs = [] } = appChar;

    for (const buff of innateBuffs) {
      if (isGranted(buff, char)) {
        applyAbilityBuff({
          description: `Self / ${buff.src}`,
          buff,
          infoWrap,
          inputs: [],
          fromSelf: true,
          isFinal,
        });
      }
    }
    for (const ctrl of charBuffCtrls) {
      const buff = findByIndex(buffs, ctrl.index);

      if (ctrl.activated && buff && isGranted(buff, char)) {
        applyAbilityBuff({
          description: `Self / ${buff.src}`,
          buff,
          infoWrap,
          inputs: ctrl.inputs || [],
          fromSelf: true,
          isFinal,
        });
      }
    }
  };

  const APPLY_WEAPON_BONUSES = (isFinal: boolean) => {
    if (appWeapon.bonuses) {
      applyWeaponBuff({
        description: `${appWeapon.name} bonus`,
        buff: {
          effects: appWeapon.bonuses,
        },
        refi,
        inputs: [],
        infoWrap,
        isFinal,
      });
    }
  };

  const APPLY_MAIN_WEAPON_BUFFS = (isFinal: boolean) => {
    if (!appWeapon.buffs || !wpBuffCtrls?.length) return;

    for (const ctrl of wpBuffCtrls) {
      const buff = findByIndex(appWeapon.buffs, ctrl.index);

      if (ctrl.activated && buff) {
        applyWeaponBuff({
          description: `${appWeapon.name} activated`,
          buff,
          infoWrap,
          inputs: ctrl.inputs ?? [],
          refi,
          isFinal,
        });
      }
    }
  };

  const APPLY_ARTIFACTS_AUTO_BUFFS = (isFinal: boolean) => {
    for (const { code, bonusLv } of setBonuses) {
      //
      for (let i = 0; i <= bonusLv; i++) {
        const data = $AppData.getArtifactSet(code);
        const buff = data?.setBonuses?.[i];

        if (buff && buff.effects) {
          applyArtifactBuff({
            description: `${data.name} / ${i * 2 + 2}-piece bonus`,
            buff: {
              effects: buff.effects,
            },
            infoWrap,
            inputs: [],
            isFinal,
          });
        }
      }
    }
  };

  const APPLY_CUSTOM_BUFFS = () => {
    if (!customBuffCtrls?.length) return;
    const { totalAttr, attElmtBonus, attPattBonus, rxnBonus } = infoWrap;

    const applyToTotalAttr = (type: string, value: number) => {
      const key = type as AttributeStat;

      totalAttr[key] += value;
      addTrackerRecord(tracker?.totalAttr[key], "Custom buff", value);
    };

    for (const { category, type, subType, value } of customBuffCtrls) {
      switch (category) {
        case "totalAttr": {
          applyToTotalAttr(type, value);
        }
        case "attElmtBonus": {
          if (subType === "pct_") {
            applyToTotalAttr(type, value);
          } else if (subType) {
            const key = type as AttackElement;
            const subKey = subType as AttackElementInfoKey;

            attElmtBonus[key][subKey] += value;
            addTrackerRecord(tracker?.attElmtBonus[`${key}.${subKey}`], "Custom buff", value);
          }
          break;
        }
        case "attPattBonus": {
          if (subType) {
            const key = type as AttackPatternBonusKey;

            attPattBonus[key][subType] += value;
            addTrackerRecord(tracker?.attPattBonus[`${key}.${subType}`], "Custom buff", value);
          }
          break;
        }
        case "rxnBonus": {
          const key = type as Reaction;
          const subKey = subType as ReactionBonusInfoKey;

          rxnBonus[key][subKey] += value;
          addTrackerRecord(tracker?.rxnBonus[`${key}.${subKey}`], "Custom buff", value);
          break;
        }
      }
    }
  };

  const APPLY_TEAMMATE_BUFFS = (party: Teammate[]) => {
    for (const teammate of party) {
      const { name, buffs = [] } = $AppCharacter.get(teammate.name);

      for (const { index, activated, inputs = [] } of teammate.buffCtrls) {
        const buff = findByIndex(buffs, index);
        if (!activated || !buff) continue;

        applyAbilityBuff({
          description: `${name} / ${buff.src}`,
          buff,
          infoWrap,
          inputs,
          fromSelf: false,
        });
      }

      // #to-check: should be applied before main weapon buffs?
      (() => {
        const { code, refi } = teammate.weapon;
        const { name, buffs = [] } = $AppData.getWeapon(code) || {};

        for (const ctrl of teammate.weapon.buffCtrls) {
          const buff = findByIndex(buffs, ctrl.index);

          if (ctrl.activated && buff) {
            applyWeaponBuff({
              description: `${name} activated`,
              buff,
              infoWrap,
              inputs: ctrl.inputs ?? [],
              refi,
            });
          }
        }
      })();

      (() => {
        const { code } = teammate.artifact;
        const { name, buffs = [] } = $AppData.getArtifactSet(code) || {};

        for (const ctrl of teammate.artifact.buffCtrls) {
          const buff = findByIndex(buffs, ctrl.index);

          if (ctrl.activated && buff) {
            applyArtifactBuff({
              description: `${name} / 4-Piece activated`,
              buff,
              infoWrap,
              inputs: ctrl.inputs ?? [],
            });
          }
        }
      })();
    }
  };

  const mainArtifactData = setBonuses[0]?.code ? $AppData.getArtifactSet(setBonuses[0].code) : undefined;
  const APLY_MAIN_ARTIFACT_BUFFS = (isFinal: boolean) => {
    if (!mainArtifactData) return;

    for (const ctrl of artBuffCtrls || []) {
      const buff = mainArtifactData.buffs?.[ctrl.index];

      if (ctrl.activated && buff) {
        applyArtifactBuff({
          description: `${mainArtifactData.name} (self) / 4-piece activated`,
          buff,
          infoWrap,
          inputs: ctrl.inputs ?? [],
          isFinal,
        });
      }
    }
  };

  const CALC_FINAL_TOTAL_ATTRIBUTES = () => {
    for (const type of CORE_STAT_TYPES) {
      totalAttr[type] += applyPercent(totalAttr[`base_${type}`], totalAttr[`${type}_`]);
      totalAttr[`${type}_`] = 0;
    }
  };

  APPLY_SELF_BUFFS(false);

  const artAttr = addArtifactAttributes(artifacts, totalAttr, tracker);

  // ========== ADD WEAPON SUBSTAT ==========
  if (appWeapon.subStat) {
    const { type, scale } = appWeapon.subStat;
    const value = weaponSubStatValue(scale, weapon.level);
    applyModifier(`${appWeapon.name} sub-stat`, totalAttr, type, value, tracker);
  }

  APPLY_WEAPON_BONUSES(false);
  APPLY_ARTIFACTS_AUTO_BUFFS(false);
  APPLY_CUSTOM_BUFFS();

  // APPLY RESONANCE BUFFS
  for (const { vision: elementType, activated, inputs } of resonances) {
    if (activated) {
      const { key, value } = RESONANCE_STAT[elementType];
      let xtraValue = 0;
      const desc = `${elementType} resonance`;

      if (elementType === "dendro" && inputs) {
        if (inputs[0]) xtraValue += 30;
        if (inputs[1]) xtraValue += 20;
      }

      applyModifier(desc, totalAttr, key, value + xtraValue, tracker);

      if (elementType === "geo") {
        applyModifier(desc, attPattBonus, "all.pct_", 15, tracker);
      }
    }
  }

  // APPPLY TEAMMATE BUFFS
  APPLY_TEAMMATE_BUFFS(realParty(party));

  APPLY_MAIN_WEAPON_BUFFS(false);
  APLY_MAIN_ARTIFACT_BUFFS(false);

  totalAttr.hp += totalAttr.base_hp;
  totalAttr.atk += totalAttr.base_atk;
  totalAttr.def += totalAttr.base_def;

  CALC_FINAL_TOTAL_ATTRIBUTES();
  APPLY_ARTIFACTS_AUTO_BUFFS(true);
  APPLY_WEAPON_BONUSES(true);
  APPLY_MAIN_WEAPON_BUFFS(true);
  CALC_FINAL_TOTAL_ATTRIBUTES();
  APPLY_SELF_BUFFS(true);
  CALC_FINAL_TOTAL_ATTRIBUTES();
  APLY_MAIN_ARTIFACT_BUFFS(true);

  // CALCULATE FINAL REACTION BONUSES
  const { transformative, amplifying, quicken } = getRxnBonusesFromEM(totalAttr.em);

  for (const rxn of TRANSFORMATIVE_REACTIONS) {
    rxnBonus[rxn].pct_ += transformative;
  }
  for (const rxn of AMPLIFYING_REACTIONS) {
    rxnBonus[rxn].pct_ += amplifying;
  }
  for (const rxn of QUICKEN_REACTIONS) {
    rxnBonus[rxn].pct_ += quicken;
  }
  const { spread, aggravate } = getQuickenBuffDamage(char.level, rxnBonus);

  if (reaction === "spread" || infuse_reaction === "spread") {
    applyModifier("Spread reaction", attElmtBonus, "dendro.flat", spread, tracker);
  }
  if (reaction === "aggravate" || infuse_reaction === "aggravate") {
    applyModifier("Aggravate reaction", attElmtBonus, "electro.flat", aggravate, tracker);
  }

  return {
    totalAttr,
    attPattBonus,
    attElmtBonus,
    calcItemBuffs,
    rxnBonus,
    artAttr,
  };
};
