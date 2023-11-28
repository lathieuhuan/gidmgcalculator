import type {
  AttackElement,
  AttackElementInfoKey,
  AttackPatternBonusKey,
  AttributeStat,
  BuffModifierArgsWrapper,
  Reaction,
  ReactionBonusInfoKey,
  Teammate,
} from "@Src/types";
import type { GetCalculationStatsArgs } from "../types";

import { AMPLIFYING_REACTIONS, CORE_STAT_TYPES, QUICKEN_REACTIONS, TRANSFORMATIVE_REACTIONS } from "@Src/constants";
import { RESONANCE_STAT } from "../constants";

// Util
import { appData } from "@Src/data";
import { applyPercent, findByIndex, realParty, toArray, weaponSubStatValue } from "@Src/utils";
import {
  applyModifier,
  getArtifactSetBonuses,
  getQuickenBuffDamage,
  getRxnBonusesFromEM,
} from "@Src/utils/calculation";
import { addArtifactAttributes, addTrackerRecord, initiateBonuses, initiateTotalAttr, isFinalBonus } from "./utils";
import applyAbilityBuff from "./applyAbilityBuff";
import applyArtifactBuff from "./applyArtifactBuff";
import applyWeaponBuff from "./applyWeaponBuff";

export const getCalculationStats = ({
  char,
  charData,
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

  const weaponData = appData.getWeaponData(weapon.code)!;
  const totalAttr = initiateTotalAttr({ char, charData, weapon, weaponData, tracker });
  const { attPattBonus, attElmtBonus, rxnBonus, calcItemBuffs } = initiateBonuses();

  // const usedWeaponMods: UsedMod[] = [];
  // const usedArtifactMods: UsedMod[] = [];

  // const isNewMod = (isWeapon: boolean, itemCode: number, modIndex: number, target: string | string[]) => {
  //   const usedMods = isWeapon ? usedWeaponMods : usedArtifactMods;

  //   for (const mod of usedMods) {
  //     if (mod.itemCode !== itemCode || mod.modIndex !== modIndex) {
  //       return true;
  //     }
  //   }
  //   usedMods.push({ itemCode, modIndex, target });
  //   return false;
  // };

  const modifierArgs: BuffModifierArgsWrapper = {
    char,
    charData,
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
    const { innateBuffs = [], buffs = [] } = charData;

    for (const buff of innateBuffs) {
      applyAbilityBuff({
        description: `Self / ${buff.src}`,
        buff,
        inputs: [],
        modifierArgs,
        isFinal,
        fromSelf: true,
      });
    }
    for (const ctrl of charBuffCtrls) {
      const buff = findByIndex(buffs, ctrl.index);

      if (ctrl.activated && buff) {
        applyAbilityBuff({
          description: `Self / ${buff.src}`,
          buff,
          inputs: ctrl.inputs || [],
          modifierArgs,
          isFinal,
          fromSelf: true,
        });
      }
    }
  };

  const APPLY_WEAPON_AUTO_BUFFS = (isFinal: boolean) => {
    for (const autoBuff of weaponData.autoBuffs || []) {
      if (isFinal === isFinalBonus(autoBuff.stacks)) {
        applyWeaponBuff({
          description: `${weaponData.name} bonus`,
          buff: autoBuff,
          refi,
          inputs: [],
          modifierArgs,
        });
      }
    }
  };

  const APPLY_MAIN_WEAPON_BUFFS = (isFinal: boolean) => {
    if (!weaponData.buffs || !wpBuffCtrls?.length) return;
    const description = `${weaponData.name} activated`;

    for (const { activated, index, inputs = [] } of wpBuffCtrls) {
      const buff = findByIndex(weaponData.buffs, index);
      if (!activated || !buff) continue;

      if (isFinal === isFinalBonus(buff.stacks)) {
        applyWeaponBuff({ description, buff, refi, inputs, modifierArgs });
      }
      for (const buffBonus of buff.wpBonuses || []) {
        const bonus = {
          ...buffBonus,
          base: buffBonus.base ?? buff.base,
          stacks: buffBonus.stacks ?? buff.stacks,
        };

        if (isFinal === isFinalBonus(bonus.stacks)) {
          applyWeaponBuff({ description, buff: bonus, refi, inputs, modifierArgs });
        }
      }
    }
  };

  const APPLY_ARTIFACTS_AUTO_BUFFS = (isFinal: boolean) => {
    for (const { code, bonusLv } of setBonuses) {
      //
      for (let i = 0; i <= bonusLv; i++) {
        const data = appData.getArtifactSetData(code);

        if (!data) {
          console.log(`artifact #${code} not found`);
          continue;
        }
        const { artBonuses } = data.setBonuses?.[i] || {};

        if (artBonuses) {
          const description = `${data.name} / ${i * 2 + 2}-piece bonus`;

          for (const bonus of toArray(artBonuses)) {
            if (isFinal === isFinalBonus(bonus.stacks)) {
              applyArtifactBuff({ description, buff: bonus, modifierArgs });
            }
          }
        }
      }
    }
  };

  const APPLY_CUSTOM_BUFFS = () => {
    if (!customBuffCtrls?.length) return;
    const { totalAttr, attElmtBonus, attPattBonus, rxnBonus } = modifierArgs;

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
      const { name, buffs = [] } = appData.getCharData(teammate.name);

      for (const { index, activated, inputs = [] } of teammate.buffCtrls) {
        const buff = findByIndex(buffs, index);
        if (!activated || !buff) continue;

        applyAbilityBuff({
          description: `${name} / ${buff.src}`,
          buff,
          inputs,
          modifierArgs,
          fromSelf: false,
        });
      }

      // #to-check: should be applied before main weapon buffs?
      (() => {
        const { code, refi } = teammate.weapon;
        const { name, buffs = [] } = appData.getWeaponData(code) || {};

        for (const { index, activated, inputs = [] } of teammate.weapon.buffCtrls) {
          const buff = findByIndex(buffs, index);
          if (!activated || !buff) continue;

          applyWeaponBuff({ description: `${name} activated`, buff, inputs, refi, modifierArgs });

          for (const buffBonus of buff.wpBonuses || []) {
            const bonus = {
              ...buffBonus,
              base: buffBonus.base ?? buff.base,
              stacks: buffBonus.stacks ?? buff.stacks,
            };
            applyWeaponBuff({ description: `${name} activated`, buff: bonus, inputs, refi, modifierArgs });
          }
        }
      })();

      (() => {
        const { code } = teammate.artifact;
        const { name, buffs = [] } = appData.getArtifactSetData(code) || {};

        for (const { index, activated, inputs = [] } of teammate.artifact.buffCtrls) {
          const buff = findByIndex(buffs, index);
          if (!activated || !buff) continue;

          if (buff.artBonuses) {
            const description = `${name} / 4-Piece activated`;

            for (const bonus of toArray(buff.artBonuses)) {
              applyArtifactBuff({ description, buff: bonus, modifierArgs, inputs });
            }
          }
        }
      })();
    }
  };

  const mainArtifactData = setBonuses[0]?.code ? appData.getArtifactSetData(setBonuses[0].code) : undefined;
  const APLY_MAIN_ARTIFACT_BUFFS = (isFinal: boolean) => {
    if (!mainArtifactData) return;

    for (const ctrl of artBuffCtrls || []) {
      const buff = mainArtifactData.buffs?.[ctrl.index];
      if (!ctrl.activated || !buff) continue;

      const description = `${mainArtifactData.name} (self) / 4-piece activated`;

      for (const bonus of toArray(buff.artBonuses)) {
        if (isFinal === isFinalBonus(bonus.stacks)) {
          applyArtifactBuff({ description, buff: bonus, modifierArgs, inputs: ctrl.inputs });
        }
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

  const artAttr = addArtifactAttributes({ artifacts, totalAttr, tracker });

  // ========== ADD WEAPON SUBSTAT ==========
  if (weaponData.subStat) {
    const { type, scale } = weaponData.subStat;
    const value = weaponSubStatValue(scale, weapon.level);

    applyModifier(`${weaponData.name} sub-stat`, totalAttr, type, value, tracker);
  }

  APPLY_WEAPON_AUTO_BUFFS(false);
  APPLY_ARTIFACTS_AUTO_BUFFS(false);
  APPLY_CUSTOM_BUFFS();

  // APPLY RESONANCE BUFFS
  for (const { vision, activated, inputs } of resonances) {
    if (activated) {
      const { key, value } = RESONANCE_STAT[vision];
      let xtraValue = 0;
      const desc = `${vision} resonance`;

      if (vision === "dendro" && inputs) {
        if (inputs[0]) xtraValue += 30;
        if (inputs[1]) xtraValue += 20;
      }

      applyModifier(desc, totalAttr, key, value + xtraValue, tracker);

      if (vision === "geo") {
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
  APPLY_WEAPON_AUTO_BUFFS(true);
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
