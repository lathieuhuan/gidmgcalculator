import {
  AMPLIFYING_REACTIONS,
  ATTACK_ELEMENTS,
  ATTACK_PATTERNS,
  ATTACK_PATTERN_INFO_KEYS,
  REACTIONS,
  TRANSFORMATIVE_REACTIONS,
} from "@Src/constants";
import {
  AttackElementBonus,
  AttackPatternBonus,
  AttackPatternBonusKey,
  AttackPatternInfo,
  AttributeStat,
  BuffModifierArgsWrapper,
  ModifierCtrl,
  Reaction,
  ReactionBonus,
  Weapon,
} from "@Src/types";
import { findByIndex, toMultiplier } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import {
  addArtAttr,
  addWpSubStat,
  applyArtPassiveBuffs,
  applyWpPassiveBuffs,
  calcFinalTotalAttrs,
  initiateTotalAttr,
} from "./baseStats";
import type { GetBuffedStatsArgs } from "./types";
import {
  applyModifier,
  getQuickenBuffDamage,
  getRxnBonusesFromEM,
  meltMult,
  pushOrMergeTrackerRecord,
  vaporizeMult,
} from "./utils";
import { RESONANCE_STAT } from "./constants";
import { current } from "@reduxjs/toolkit";

interface ApplySelfBuffs {
  isFinal: boolean;
  modifierArgs: BuffModifierArgsWrapper;
  charBuffCtrls: ModifierCtrl[];
}
function applySelfBuffs({ isFinal, modifierArgs, charBuffCtrls }: ApplySelfBuffs) {
  const { char } = modifierArgs;
  const { innateBuffs = [], buffs = [] } = findCharacter(char) || {};

  if (!isFinal) {
    for (const { src, isGranted, applyBuff } of innateBuffs) {
      if (isGranted(char) && applyBuff) {
        applyBuff({ ...modifierArgs, charBuffCtrls, desc: `Self / ${src}` });
      }
    }
  }

  for (const { index, activated, inputs } of charBuffCtrls) {
    const buff = findByIndex(buffs, index);

    if (buff && (!buff.isGranted || buff.isGranted(char)) && activated) {
      let applyFn: Function | undefined;

      if (!isFinal && buff.applyBuff) {
        applyFn = buff.applyBuff;
      } else if (isFinal && buff.applyFinalBuff) {
        applyFn = buff.applyFinalBuff;
      } else {
        continue;
      }

      const desc = `Self / ${buff.src}`;
      const validatedInputs = inputs || buff.inputConfig?.initialValues || [];
      applyFn({ ...modifierArgs, charBuffCtrls, inputs: validatedInputs, toSelf: true, desc });
    }
  }
}

export default function getBuffedStats({
  char,
  charData,
  selfBuffCtrls,
  weapon,
  wpBuffCtrls,
  artInfo: { pieces, sets },
  artBuffCtrls,
  subArtBuffCtrls,
  elmtModCtrls,
  party,
  partyData,
  customBuffCtrls,
  infusion,
  tracker,
}: GetBuffedStatsArgs) {
  const weaponData = findWeapon(weapon)!;
  const totalAttr = initiateTotalAttr({ char, weapon, weaponData, tracker });
  const artAttr = addArtAttr({ pieces, totalAttr, tracker });

  // INIT ATTACK DAMAGE BONUSES
  const attPattBonus = {} as AttackPatternBonus;
  const attElmtBonus = {} as AttackElementBonus;

  const initAttPattBonusField = () => {
    let result = {} as AttackPatternInfo;
    for (const key of ATTACK_PATTERN_INFO_KEYS) {
      result[key] = 0;
    }
    return result;
  };
  for (const pattern of ATTACK_PATTERNS) {
    attPattBonus[pattern] = initAttPattBonusField();
  }
  attPattBonus.all = initAttPattBonusField();

  for (const element of ATTACK_ELEMENTS) {
    attElmtBonus[element] = { cDmg: 0, flat: 0 };
  }

  // INIT REACTION BONUS
  const rxnBonus = {} as ReactionBonus;
  for (const rxn of REACTIONS) {
    rxnBonus[rxn] = 0;
  }

  const modifierArgs: BuffModifierArgsWrapper = {
    char,
    charData,
    partyData,
    totalAttr,
    attPattBonus,
    attElmtBonus,
    rxnBonus,
    infusion,
    tracker,
  };
  const { refi } = weapon;

  addWpSubStat({ totalAttr, weaponData, wpLevel: weapon.level, tracker });
  applyWpPassiveBuffs({ isFinal: false, weaponData, refi, modifierArgs });
  applyArtPassiveBuffs({ isFinal: false, sets, modifierArgs });

  // APPLY CUSTOM BUFFS
  for (const { category, type, value } of customBuffCtrls) {
    if (category === 2) {
      const key = type as AttackPatternBonusKey;
      attPattBonus[key].pct += value;
      // pushOrMergeTrackerRecord(tracker?.[key], "pct", "Custom Buff", value);
    } else {
      if (category < 2) {
        const key = type as AttributeStat;
        totalAttr[key] += value;
      } else {
        const key = type as Reaction;
        rxnBonus[key] += value;
      }
      // pushOrMergeTrackerRecord(tracker, type as string, "Custom Buff", value);
    }
  }

  // APPLY RESONANCE BUFFS
  for (const rsn of elmtModCtrls.resonances) {
    if (rsn.activated) {
      const { key, value } = RESONANCE_STAT[rsn.vision];
      let xtraValue = 0;
      const desc = `${rsn.vision} Resonance`;

      if (rsn.vision === "dendro" && rsn.inputs) {
        if (rsn.inputs[0]) xtraValue += 30;
        if (rsn.inputs[1]) xtraValue += 20;
      }

      applyModifier(desc, totalAttr, key, value + xtraValue, tracker);

      if (rsn.vision === "geo") {
        applyModifier(desc, attPattBonus, "all.pct", 15, tracker);
      }
    }
  }

  // APPLY WEAPON BUFFS
  for (const { activated, index, inputs } of wpBuffCtrls) {
    if (weaponData.buffs) {
      const { applyBuff } = findByIndex(weaponData.buffs, index) || {};
      if (activated && applyBuff) {
        applyBuff({ ...modifierArgs, refi, inputs, desc: `${weaponData.name} activated` });
      }
    } else {
      console.log(`buffs of main weapon not found`);
    }
  }

  // APPLY ARTIFACT BUFFS
  for (const { activated, code, index, inputs } of subArtBuffCtrls) {
    if (activated) {
      const { name, buffs } = findArtifactSet({ code }) || {};
      const desc = `${name} / 4-Piece activated`;
      buffs?.[index].applyBuff?.({ ...modifierArgs, inputs, desc });
    }
  }
  for (const { index, activated, inputs } of artBuffCtrls) {
    const { name, buffs } = findArtifactSet({ code: sets[0].code }) || {};
    const { applyBuff } = buffs?.[index] || {};

    if (activated && applyBuff) {
      const desc = `${name} (self) / 4-Piece activated`;
      applyBuff({ ...modifierArgs, inputs, desc });
    }
  }

  // APPPLY TEAMMATE BUFFS
  for (const teammate of party) {
    if (!teammate) continue;
    const { weapon: weaponType, buffs = [] } = findCharacter(teammate)!;

    for (const { index, activated, inputs } of teammate.buffCtrls) {
      const buff = findByIndex(buffs, index);
      if (!buff) continue;

      const applyFn = buff.applyBuff || buff.applyFinalBuff;
      if (activated && applyFn) {
        const desc = `${teammate} / ${buff.src}`;
        const validatedInputs = inputs || buff.inputConfig?.initialValues || [];
        const wrapper = { charBuffCtrls: teammate.buffCtrls, inputs: validatedInputs, desc };
        applyFn({ ...modifierArgs, ...wrapper, toSelf: false });
      }
    }

    // #to-check: should be applied before main weapon buffs?
    const { code, refi, buffCtrls } = teammate.weapon;
    const { name: weaponName, buffs: weaponBuffs = [] } = findWeapon({ code, type: weaponType })!;
    for (const { index, activated, inputs } of buffCtrls) {
      const buff = findByIndex(weaponBuffs, index);

      if (activated && buff?.applyBuff) {
        buff.applyBuff({ ...modifierArgs, refi, inputs, desc: `${weaponName} activated` });
      } else {
        console.log(`weapon buff #${index} of weapon #${code} not found`);
      }
    }
  }

  applySelfBuffs({ isFinal: false, modifierArgs, charBuffCtrls: selfBuffCtrls });
  calcFinalTotalAttrs(totalAttr);

  applyArtPassiveBuffs({ isFinal: true, sets, modifierArgs });
  applyWpPassiveBuffs({ isFinal: true, weaponData, refi, modifierArgs });

  // APPLY WEAPON FINAL BUFFS
  for (const { activated, index, inputs } of wpBuffCtrls) {
    if (activated && weaponData.buffs) {
      const { applyFinalBuff } = findByIndex(weaponData.buffs, index) || {};
      if (applyFinalBuff) {
        applyFinalBuff({ totalAttr, refi, desc: `${weaponData.name} activated`, inputs, tracker });
      }
    } else if (!weaponData.buffs) {
      console.log(`final buffs of main weapon not found`);
    }
  }

  applySelfBuffs({ isFinal: true, modifierArgs, charBuffCtrls: selfBuffCtrls });

  // APPLY ARTIFACT FINAL BUFFS
  for (const ctrl of artBuffCtrls) {
    const { name, buffs } = findArtifactSet({ code: sets[0].code }) || {};
    const { applyFinalBuff } = buffs?.[ctrl.index] || {};

    if (ctrl.activated && applyFinalBuff) {
      const desc = `${name} (self) / 4-Piece activated`;
      applyFinalBuff({ totalAttr, attPattBonus, desc, tracker });
    }
  }

  // CALCULATE FINAL REACTION BONUSES
  const { transformative, amplifying } = getRxnBonusesFromEM(totalAttr.em);
  const { vision } = charData;

  for (const rxn of TRANSFORMATIVE_REACTIONS) {
    rxnBonus[rxn] += transformative;
  }
  for (const rxn of AMPLIFYING_REACTIONS) {
    rxnBonus[rxn] += amplifying;
  }
  const meltBonus = toMultiplier(rxnBonus.melt);
  const vapBonus = toMultiplier(rxnBonus.vaporize);

  rxnBonus.melt = meltMult(vision) * meltBonus;
  rxnBonus.vaporize = vaporizeMult(vision) * vapBonus;

  if (infusion.NA !== vision) {
    rxnBonus.infusion_melt = meltMult(infusion.NA) * meltBonus;
    rxnBonus.infusion_vaporize = vaporizeMult(infusion.NA) * vapBonus;
  }

  const { spread, aggravate } = getQuickenBuffDamage(char.level, totalAttr.em, rxnBonus);

  if (elmtModCtrls.spread) {
    applyModifier("Spread reaction", attElmtBonus, "dendro.flat", spread, tracker);
  }
  if (elmtModCtrls.aggravate && charData.vision === "electro") {
    applyModifier("Aggravate reaction", attElmtBonus, "electro.flat", aggravate, tracker);
  }

  return {
    totalAttr,
    attPattBonus,
    attElmtBonus,
    rxnBonus,
    artAttr,
  };
}
