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
} from "@Src/types";
import { findByIndex, toMult } from "@Src/utils";
import { findArtifactSet, findCharacter, findWeapon } from "@Data/controllers";
import {
  addArtAttr,
  addWpSubStat,
  applyArtPassiveBuffs,
  applyWpPassiveBuffs,
  calcFinalTotalAttrs,
  initiateTotalAttr,
} from "./baseStats";
import type { GetBuffedStatsArgs, UsedCode } from "./types";
import {
  applyModifier,
  getQuickenBuffDamage,
  getRxnBonusesFromEM,
  meltMult,
  pushOrMergeTrackerRecord,
  vaporizeMult,
} from "./utils";
import { RESONANCE_STAT } from "./constants";

interface ApplySelfBuffs {
  isFinal: boolean;
  modifierArgs: BuffModifierArgsWrapper;
  charBuffCtrls: ModifierCtrl[];
}
function applySelfBuffs({ isFinal, modifierArgs, charBuffCtrls }: ApplySelfBuffs) {
  const { char } = modifierArgs;
  const { innateBuffs = [], buffs = [] } = findCharacter(char) || {};

  for (const { src, isGranted, applyBuff, applyFinalBuff } of innateBuffs) {
    if (isGranted(char)) {
      const applyFn =
        !isFinal && applyBuff ? applyBuff : isFinal && applyFinalBuff ? applyFinalBuff : undefined;

      applyFn?.({ ...modifierArgs, charBuffCtrls, desc: `Self / ${src}` });
    }
  }

  for (const { index, activated, inputs } of charBuffCtrls) {
    const buff = findByIndex(buffs, index);

    if (buff && (!buff.isGranted || buff.isGranted(char)) && activated) {
      const applyFn =
        !isFinal && buff.applyBuff
          ? buff.applyBuff
          : isFinal && buff.applyFinalBuff
          ? buff.applyFinalBuff
          : undefined;

      const desc = `Self / ${buff.src}`;
      const validatedInputs = inputs || [];
      applyFn?.({ ...modifierArgs, charBuffCtrls, inputs: validatedInputs, toSelf: true, desc });
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
  elmtModCtrls: { resonances, reaction, infusion_reaction },
  party,
  partyData,
  customBuffCtrls,
  infusedElement,
  tracker,
}: GetBuffedStatsArgs) {
  const weaponData = findWeapon(weapon)!;
  const totalAttr = initiateTotalAttr({ char, weapon, weaponData, tracker });
  const artAttr = addArtAttr({ pieces, totalAttr, tracker });
  const usedWpMods: UsedCode[] = [];
  const usedArtMods: UsedCode[] = [];

  function isNewMod(isWeapon: boolean, wpCode: number, modIndex: number) {
    const usedMods = isWeapon ? usedWpMods : usedArtMods;
    const foundItem = usedMods.find((mod) => mod.itemCode === wpCode);

    if (foundItem && foundItem.modIndex === modIndex) {
      return false;
    } else {
      usedMods.push({ itemCode: wpCode, modIndex });
      return true;
    }
  }

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
    infusedElement,
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
  for (const { vision, activated, inputs } of resonances) {
    if (activated) {
      const { key, value } = RESONANCE_STAT[vision];
      let xtraValue = 0;
      const desc = `${vision} Resonance`;

      if (vision === "dendro" && inputs) {
        if (inputs[0]) xtraValue += 30;
        if (inputs[1]) xtraValue += 20;
      }

      applyModifier(desc, totalAttr, key, value + xtraValue, tracker);

      if (vision === "geo") {
        applyModifier(desc, attPattBonus, "all.pct", 15, tracker);
      }
    }
  }

  applySelfBuffs({ isFinal: false, modifierArgs, charBuffCtrls: selfBuffCtrls });

  // APPPLY TEAMMATE BUFFS
  for (const teammate of party) {
    if (!teammate) continue;
    const { name, weapon: weaponType, buffs = [] } = findCharacter(teammate)!;

    for (const { index, activated, inputs } of teammate.buffCtrls) {
      const buff = findByIndex(buffs, index);

      if (buff) {
        const applyFn = buff.applyBuff || buff.applyFinalBuff;
        if (activated && applyFn) {
          const desc = `${name} / ${buff.src}`;
          const validatedInputs = inputs || [];
          const wrapper = { charBuffCtrls: teammate.buffCtrls, inputs: validatedInputs, desc };
          applyFn({ ...modifierArgs, ...wrapper, toSelf: false });
        }
      } else {
        console.log(`buff #${index} of teammate ${name} not found`);
      }
    }

    // #to-check: should be applied before main weapon buffs?
    (() => {
      const { code, refi } = teammate.weapon;
      const { name, buffs = [] } = findWeapon({ code, type: weaponType }) || {};

      for (const { index, activated, inputs } of teammate.weapon.buffCtrls) {
        const buff = findByIndex(buffs, index);

        if (buff) {
          if (activated && isNewMod(true, code, index) && buff?.applyBuff) {
            buff.applyBuff({ ...modifierArgs, refi, inputs, desc: `${name} activated` });
          }
        } else {
          console.log(`buff #${index} of weapon #${code} not found`);
        }
      }
    })();

    (() => {
      const { code } = teammate.artifact;
      const { name, buffs = [] } = findArtifactSet({ code }) || {};

      for (const { index, activated, inputs } of teammate.artifact.buffCtrls) {
        const buff = findByIndex(buffs, index);

        if (buff) {
          if (activated && isNewMod(false, code, index) && buff.applyBuff) {
            buff.applyBuff({ ...modifierArgs, inputs, desc: `${name} / 4-Piece activated` });
          }
        } else {
          console.log(`buff #${index} of artifact #${code} not found`);
        }
      }
    })();
  }

  // APPLY WEAPON BUFFS
  for (const { activated, index, inputs } of wpBuffCtrls) {
    if (weaponData.buffs) {
      const { applyBuff } = findByIndex(weaponData.buffs, index) || {};
      if (activated && isNewMod(true, weaponData.code, index) && applyBuff) {
        const desc = `${weaponData.name} activated`;
        applyBuff({ ...modifierArgs, refi, inputs, desc });
      }
    } else {
      console.log(`buffs of main weapon not found`);
    }
  }

  // APPLY ARTIFACT BUFFS
  const mainArtCode = sets[0]?.code;
  if (mainArtCode) {
    for (const { index, activated, inputs } of artBuffCtrls) {
      const { name, buffs } = findArtifactSet({ code: mainArtCode }) || {};
      const { applyBuff } = buffs?.[index] || {};

      if (activated && isNewMod(false, mainArtCode, index) && applyBuff) {
        const desc = `${name} (self) / 4-Piece activated`;
        applyBuff({ ...modifierArgs, inputs, desc });
      }
    }
  }

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
  const meltBonus = toMult(rxnBonus.melt);
  const vapBonus = toMult(rxnBonus.vaporize);
  const { spread, aggravate } = getQuickenBuffDamage(char.level, totalAttr.em, rxnBonus);

  console.log(reaction, infusion_reaction);

  if (reaction === "spread" || infusion_reaction === "spread") {
    applyModifier("Spread reaction", attElmtBonus, "dendro.flat", spread, tracker);
  }
  if (reaction === "aggravate" || infusion_reaction === "aggravate") {
    applyModifier("Aggravate reaction", attElmtBonus, "electro.flat", aggravate, tracker);
  }

  rxnBonus.melt = meltMult(vision) * meltBonus;
  rxnBonus.vaporize = vaporizeMult(vision) * vapBonus;
  rxnBonus.infusion_melt = meltMult(infusedElement) * meltBonus;
  rxnBonus.infusion_vaporize = vaporizeMult(infusedElement) * vapBonus;

  return {
    totalAttr,
    attPattBonus,
    attElmtBonus,
    rxnBonus,
    artAttr,
  };
}
