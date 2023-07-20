import type {
  AttackElement,
  AttackElementBonus,
  AttacklementInfo,
  AttackElementInfoKey,
  AttackPatternBonus,
  AttackPatternBonusKey,
  AttackPatternInfo,
  AttributeStat,
  BuffModifierArgsWrapper,
  AppCharacter,
  ModifierCtrl,
  Reaction,
  ReactionBonus,
  ReactionBonusInfo,
  ReactionBonusInfoKey,
  CalcItemBuff,
} from "@Src/types";
import type { GetBuffedStatsArgs, UsedCode } from "./types";

import { appData } from "@Data/index";
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
import { RESONANCE_STAT } from "./constants";

import { findDataArtifactSet, findDataWeapon } from "@Data/controllers";
import { findByIndex } from "@Src/utils";
import {
  getArtifactSetBonuses,
  applyModifier,
  getQuickenBuffDamage,
  getRxnBonusesFromEM,
} from "@Src/utils/calculation";
import {
  addArtAttr,
  addWeaponSubStat,
  applyArtPassiveBuffs,
  applyWpPassiveBuffs,
  calcFinalTotalAttrs,
  initiateTotalAttr,
} from "./baseStats";
import { addTrackerRecord } from "./utils";

interface ApplySelfBuffs {
  isFinal: boolean;
  modifierArgs: BuffModifierArgsWrapper;
  charBuffCtrls: ModifierCtrl[];
  charData: AppCharacter;
}
function applySelfBuffs({ isFinal, modifierArgs, charBuffCtrls, charData }: ApplySelfBuffs) {
  const { char } = modifierArgs;
  const { innateBuffs = [], buffs = [] } = charData;

  for (const { src, isGranted, applyBuff, applyFinalBuff } of innateBuffs) {
    if (isGranted(char)) {
      const applyFn = !isFinal && applyBuff ? applyBuff : isFinal && applyFinalBuff ? applyFinalBuff : undefined;

      applyFn?.({
        desc: `Self / ${src}`,
        charBuffCtrls,
        ...modifierArgs,
      });
    }
  }

  for (const { index, activated, inputs = [] } of charBuffCtrls) {
    const buff = findByIndex(buffs, index);

    if (buff && (!buff.isGranted || buff.isGranted(char)) && activated) {
      const applyFn =
        !isFinal && buff.applyBuff ? buff.applyBuff : isFinal && buff.applyFinalBuff ? buff.applyFinalBuff : undefined;

      applyFn?.({
        desc: `Self / ${buff.src}`,
        toSelf: true,
        charBuffCtrls,
        inputs,
        ...modifierArgs,
      });
    }
  }
}

export default function getBuffedStats({
  char,
  charData,
  selfBuffCtrls,
  weapon,
  wpBuffCtrls,
  artifacts,
  artBuffCtrls,
  elmtModCtrls: { resonances, reaction, infuse_reaction },
  party,
  partyData,
  customBuffCtrls,
  infusedElement,
  tracker,
}: GetBuffedStatsArgs) {
  const weaponData = findDataWeapon(weapon)!;
  const totalAttr = initiateTotalAttr({ char, charData, weapon, weaponData, tracker });
  const artAttr = addArtAttr({ artifacts, totalAttr, tracker });
  const setBonuses = getArtifactSetBonuses(artifacts);
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
  const { refi } = weapon;

  addWeaponSubStat({ totalAttr, weaponData, wpLevel: weapon.level, tracker });
  applyWpPassiveBuffs({ isFinal: false, weaponData, refi, modifierArgs });
  applyArtPassiveBuffs({ isFinal: false, setBonuses, modifierArgs });

  // APPLY CUSTOM BUFFS
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

  applySelfBuffs({
    isFinal: false,
    modifierArgs,
    charBuffCtrls: selfBuffCtrls,
    charData,
  });

  // APPPLY TEAMMATE BUFFS

  for (const teammate of party) {
    if (!teammate) continue;
    const { name, weaponType, buffs = [] } = appData.getCharData(teammate.name);

    for (const { index, activated, inputs = [] } of teammate.buffCtrls) {
      if (!activated) continue;

      const buff = findByIndex(buffs, index);

      if (buff) {
        buff.applyBuff?.({
          desc: `${name} / ${buff.src}`,
          toSelf: false,
          inputs,
          charBuffCtrls: teammate.buffCtrls,
          ...modifierArgs,
        });
        buff.applyFinalBuff?.({
          desc: `${name} / ${buff.src}`,
          toSelf: false,
          inputs,
          charBuffCtrls: teammate.buffCtrls,
          ...modifierArgs,
        });
      } else {
        console.log(`buff #${index} of teammate ${name} not found`);
      }
    }

    // #to-check: should be applied before main weapon buffs?
    (() => {
      const { code, refi } = teammate.weapon;
      const { name, buffs = [] } = findDataWeapon({ code, type: weaponType }) || {};

      for (const { index, activated, inputs = [] } of teammate.weapon.buffCtrls) {
        const buff = findByIndex(buffs, index);

        if (buff) {
          if (activated && isNewMod(true, code, index) && buff?.applyBuff) {
            buff.applyBuff({
              desc: `${name} activated`,
              refi,
              inputs,
              ...modifierArgs,
            });
          }
        } else {
          console.log(`buff #${index} of weapon #${code} not found`);
        }
      }
    })();

    (() => {
      const { code } = teammate.artifact;
      const { name, buffs = [] } = findDataArtifactSet({ code }) || {};

      for (const { index, activated, inputs = [] } of teammate.artifact.buffCtrls) {
        const buff = findByIndex(buffs, index);

        if (buff) {
          if (activated && isNewMod(false, code, index) && buff.applyBuff) {
            buff.applyBuff({
              desc: `${name} / 4-Piece activated`,
              inputs,
              ...modifierArgs,
            });
          }
        } else {
          console.log(`buff #${index} of artifact #${code} not found`);
        }
      }
    })();
  }

  // APPLY WEAPON BUFFS
  for (const { activated, index, inputs = [] } of wpBuffCtrls) {
    if (weaponData.buffs) {
      const { applyBuff } = findByIndex(weaponData.buffs, index) || {};
      if (activated && isNewMod(true, weaponData.code, index) && applyBuff) {
        applyBuff({
          desc: `${weaponData.name} activated`,
          refi,
          inputs,
          ...modifierArgs,
        });
      }
    } else {
      console.log(`buffs of main weapon not found`);
    }
  }

  // APPLY ARTIFACT BUFFS
  const mainArtCode = setBonuses[0]?.code;
  if (mainArtCode) {
    for (const { index, activated, inputs = [] } of artBuffCtrls) {
      const { name, buffs } = findDataArtifactSet({ code: mainArtCode }) || {};
      const { applyBuff } = buffs?.[index] || {};

      if (activated && isNewMod(false, mainArtCode, index) && applyBuff) {
        applyBuff({
          desc: `${name} (self) / 4-piece activated`,
          inputs,
          ...modifierArgs,
        });
      }
    }
  }

  calcFinalTotalAttrs(totalAttr);

  applyArtPassiveBuffs({ isFinal: true, setBonuses, modifierArgs });
  applyWpPassiveBuffs({ isFinal: true, weaponData, refi, modifierArgs });

  // APPLY WEAPON FINAL BUFFS
  for (const { activated, index, inputs = [] } of wpBuffCtrls) {
    if (activated && weaponData.buffs) {
      const { applyFinalBuff } = findByIndex(weaponData.buffs, index) || {};

      if (applyFinalBuff) {
        applyFinalBuff({
          desc: `${weaponData.name} activated`,
          refi,
          inputs,
          ...modifierArgs,
        });
      }
    } else if (!weaponData.buffs) {
      console.log(`final buffs of main weapon not found`);
    }
  }

  applySelfBuffs({
    isFinal: true,
    modifierArgs,
    charBuffCtrls: selfBuffCtrls,
    charData,
  });

  // APPLY ARTIFACT FINAL BUFFS
  for (const ctrl of artBuffCtrls) {
    const { name, buffs } = findDataArtifactSet({ code: setBonuses[0].code }) || {};
    const { applyFinalBuff } = buffs?.[ctrl.index] || {};

    if (ctrl.activated && applyFinalBuff) {
      applyFinalBuff({
        desc: `${name} (self) / 4-piece activated`,
        ...modifierArgs,
      });
    }
  }

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
}
