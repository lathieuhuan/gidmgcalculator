import type {
  AttackElement,
  AttackElementBonus,
  AttackElementInfoKey,
  AttacklementInfo,
  AttackPatternBonus,
  AttackPatternBonusKey,
  AttackPatternInfo,
  AttributeStat,
  BuffModifierArgsWrapper,
  CalcItemBuff,
  Reaction,
  ReactionBonus,
  ReactionBonusInfo,
  ReactionBonusInfoKey,
} from "@Src/types";
import type { GetStatsArgs, UsedCode } from "../types";

import {
  AMPLIFYING_REACTIONS,
  ATTACK_ELEMENTS,
  ATTACK_ELEMENT_INFO_KEYS,
  ATTACK_PATTERNS,
  ATTACK_PATTERN_INFO_KEYS,
  QUICKEN_REACTIONS,
  REACTIONS,
  REACTION_BONUS_INFO_KEYS,
  TRANSFORMATIVE_REACTIONS,
} from "@Src/constants";
import { RESONANCE_STAT } from "../constants";

import { appData } from "@Data/index";
import { findDataArtifactSet, findDataWeapon } from "@Data/controllers";
import { findByIndex, toArray } from "@Src/utils";
import {
  applyModifier,
  getArtifactSetBonuses,
  getQuickenBuffDamage,
  getRxnBonusesFromEM,
} from "@Src/utils/calculation";
import {
  addArtifactAttributes,
  addWeaponSubStat,
  applySelfBuffs,
  addTrackerRecord,
  calcFinalTotalAttributes,
  initiateTotalAttr,
  checkFinal,
} from "./utils";
import { applyMainWeaponBuffs, applyWeaponAutoBuffs, applyWeaponBuff } from "./buffs-weapon";
import { applyArtifactAutoBuffs, applyArtifactBuff } from "./buffs-artifact";

const init = () => {
  // INIT ATTACK DAMAGE BONUSES
  const attPattBonus = {} as AttackPatternBonus;
  const attElmtBonus = {} as AttackElementBonus;

  for (const pattern of [...ATTACK_PATTERNS, "all"] as const) {
    attPattBonus[pattern] = {} as AttackPatternInfo;

    for (const key of ATTACK_PATTERN_INFO_KEYS) {
      attPattBonus[pattern][key] = 0;
    }
  }

  for (const element of ATTACK_ELEMENTS) {
    attElmtBonus[element] = {} as AttacklementInfo;

    for (const key of ATTACK_ELEMENT_INFO_KEYS) {
      attElmtBonus[element][key] = 0;
    }
  }

  // INIT REACTION BONUS
  const rxnBonus = {} as ReactionBonus;
  for (const rxn of REACTIONS) {
    rxnBonus[rxn] = {} as ReactionBonusInfo;

    for (const key of REACTION_BONUS_INFO_KEYS) {
      rxnBonus[rxn][key] = 0;
    }
  }

  const calcItemBuffs: CalcItemBuff[] = [];

  return {
    attPattBonus,
    attElmtBonus,
    rxnBonus,
    calcItemBuffs,
  };
};

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
}: GetStatsArgs) => {
  const { resonances = [], reaction, infuse_reaction } = elmtModCtrls || {};
  const { refi } = weapon;
  const setBonuses = getArtifactSetBonuses(artifacts);

  const weaponData = findDataWeapon(weapon)!;
  const artSet1Data = setBonuses[0] ? findDataArtifactSet({ code: setBonuses[0].code }) : undefined;
  const artSet2Data = setBonuses[1] ? findDataArtifactSet({ code: setBonuses[1].code }) : undefined;
  const totalAttr = initiateTotalAttr({ char, charData, weapon, weaponData, tracker });

  const { attPattBonus, attElmtBonus, rxnBonus, calcItemBuffs } = init();
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

  applySelfBuffs({
    isFinal: false,
    modifierArgs,
    charBuffCtrls: selfBuffCtrls,
    charData,
  });

  const artAttr = addArtifactAttributes({ artifacts, totalAttr, tracker });
  const usedWpMods: UsedCode[] = [];
  const usedArtMods: UsedCode[] = [];

  function isNewMod(isWeapon: boolean, itemCode: number, modIndex: number) {
    const usedMods = isWeapon ? usedWpMods : usedArtMods;
    const foundItem = usedMods.find((mod) => mod.itemCode === itemCode);

    if (foundItem && foundItem.modIndex === modIndex) {
      return false;
    } else {
      usedMods.push({ itemCode, modIndex });
      return true;
    }
  }

  addWeaponSubStat({ totalAttr, weaponData, wpLevel: weapon.level, tracker });
  applyWeaponAutoBuffs({ isFinal: false, weaponData, refi, modifierArgs });
  applyArtifactAutoBuffs({ isFinal: false, setBonuses, modifierArgs });

  // APPLY CUSTOM BUFFS
  if (customBuffCtrls?.length) {
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
  }

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
  if (party?.length) {
    for (const teammate of party) {
      if (!teammate) continue;
      const { name, weaponType, buffs = [] } = appData.getCharData(teammate.name);

      for (const { index, activated, inputs = [] } of teammate.buffCtrls) {
        if (!activated) continue;
        const buff = findByIndex(buffs, index);

        if (!buff) {
          console.log(`buff #${index} of teammate ${name} not found`);
          continue;
        }

        buff.applyBuff?.({
          desc: `${name} / ${buff.src}`,
          fromSelf: false,
          inputs,
          charBuffCtrls: teammate.buffCtrls,
          ...modifierArgs,
        });
        buff.applyFinalBuff?.({
          desc: `${name} / ${buff.src}`,
          fromSelf: false,
          inputs,
          charBuffCtrls: teammate.buffCtrls,
          ...modifierArgs,
        });
      }

      // #to-check: should be applied before main weapon buffs?
      (() => {
        const { code, refi } = teammate.weapon;
        const { name, buffs = [] } = findDataWeapon({ code, type: weaponType }) || {};

        for (const { index, activated, inputs = [] } of teammate.weapon.buffCtrls) {
          if (!activated || !isNewMod(true, code, index)) continue;
          const buff = findByIndex(buffs, index);

          if (!buff) {
            console.log(`buff #${index} of weapon #${code} not found`);
            continue;
          }

          applyWeaponBuff({ description: `${name} activated`, buff, inputs, refi, modifierArgs });

          for (const buffBonus of buff.buffBonuses || []) {
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
        const { name, buffs = [] } = findDataArtifactSet({ code }) || {};

        for (const { index, activated, inputs = [] } of teammate.artifact.buffCtrls) {
          if (!activated || !isNewMod(false, code, index)) continue;
          const buff = findByIndex(buffs, index);

          if (!buff) {
            console.log(`buff #${index} of artifact #${code} not found`);
            continue;
          }

          if (buff.bonuses) {
            const description = `${name} / 4-Piece activated`;

            for (const bonus of toArray(buff.bonuses)) {
              applyArtifactBuff({ description, buff: bonus, modifierArgs, inputs });
            }
          }
        }
      })();
    }
  }

  // APPLY WEAPON BUFFS
  if (wpBuffCtrls?.length) {
    applyMainWeaponBuffs({ isFinal: false, weaponData, refi, wpBuffCtrls, modifierArgs });
  }

  const applyMainArtifactBuffs = (isFinal: boolean) => {
    if (!artSet1Data) return;

    for (const ctrl of artBuffCtrls || []) {
      if (!ctrl.activated || !isNewMod(false, artSet1Data.code, ctrl.index)) continue;
      const buff = artSet1Data.buffs?.[ctrl.index];

      if (buff) {
        const description = `${artSet1Data.name} (self) / 4-piece activated`;

        for (const bonus of toArray(buff.bonuses)) {
          if (isFinal === checkFinal(bonus.stacks)) {
            applyArtifactBuff({ description, buff: bonus, modifierArgs, inputs: ctrl.inputs });
          }
        }
      }
    }
  };

  // APPLY ARTIFACT BUFFS
  applyMainArtifactBuffs(false);

  totalAttr.hp += totalAttr.base_hp;
  totalAttr.atk += totalAttr.base_atk;
  totalAttr.def += totalAttr.base_def;

  calcFinalTotalAttributes(totalAttr);

  applyArtifactAutoBuffs({ isFinal: true, setBonuses, modifierArgs });
  applyWeaponAutoBuffs({ isFinal: true, weaponData, refi, modifierArgs });

  // APPLY WEAPON FINAL BUFFS
  if (wpBuffCtrls?.length) {
    applyMainWeaponBuffs({ isFinal: true, weaponData, refi, wpBuffCtrls, modifierArgs });
  }

  calcFinalTotalAttributes(totalAttr);

  applySelfBuffs({ isFinal: true, modifierArgs, charBuffCtrls: selfBuffCtrls, charData });

  // APPLY ARTIFACT FINAL BUFFS
  applyMainArtifactBuffs(true);

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
