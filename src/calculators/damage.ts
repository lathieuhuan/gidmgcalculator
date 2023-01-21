import type {
  DamageResult,
  ResistanceReduction,
  DebuffModifierArgsWrapper,
  TrackerDamageRecord,
} from "@Src/types";
import type { CalcTalentStatArgs, GetDamageArgs } from "./types";

// Constant
import {
  ATTACK_ELEMENTS,
  ATTACK_PATTERNS,
  TRANSFORMATIVE_REACTIONS,
  BASE_REACTION_DAMAGE,
} from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { TRANSFORMATIVE_REACTION_INFO } from "./constants";

// Util
import { findDataArtifactSet, findDataCharacter } from "@Data/controllers";
import {
  applyToOneOrMany,
  bareLv,
  findByIndex,
  toMult,
  getTalentDefaultInfo,
  turnArray,
} from "@Src/utils";
import { finalTalentLv, applyModifier, getAmplifyingMultiplier } from "@Src/utils/calculation";

function calcTalentDamage({
  stat,
  attElmt,
  attPatt,
  base,
  char,
  target,
  talentBuff,
  totalAttr,
  attPattBonus,
  attElmtBonus,
  rxnMult,
  resistReduct,
  record,
}: CalcTalentStatArgs) {
  if (base !== 0 && !stat.notAttack) {
    const flat =
      (talentBuff.flat?.value || 0) +
      attPattBonus.all.flat +
      (attPatt !== "none" ? attPattBonus[attPatt].flat : 0) +
      (attElmt !== "various" ? attElmtBonus[attElmt].flat : 0);

    // CALCULATE DAMAGE BONUS MULTIPLIERS
    let normalMult = (talentBuff.pct?.value || 0) + attPattBonus.all.pct;
    let specialMult = 1;

    if (attPatt !== "none") {
      normalMult += attPattBonus[attPatt].pct;
      specialMult = toMult(attPattBonus[attPatt].specialMult);
    }
    if (attElmt !== "various") {
      normalMult += totalAttr[attElmt];
    }
    normalMult = toMult(normalMult);

    // CALCULATE DEFENSE MULTIPLIER
    let defMult = 1;
    const charPart = bareLv(char.level) + 100;
    const defReduction = 1 - resistReduct.def / 100;

    if (attPatt !== "none") {
      defMult = 1 - attPattBonus[attPatt].defIgnore / 100;
    }
    defMult = charPart / (defReduction * defMult * (target.level + 100) + charPart);

    // CALCULATE RESISTANCE MULTIPLIER
    const resMult = attElmt === "various" ? 1 : resistReduct[attElmt];

    // CALCULATE CRITS
    const totalCrit = (type: "cRate" | "cDmg") => {
      return (
        totalAttr[type] +
        (talentBuff[type]?.value || 0) +
        attPattBonus.all[type] +
        (attPatt !== "none" ? attPattBonus[attPatt][type] : 0) +
        (attElmt !== "various" && type === "cDmg" ? attElmtBonus[attElmt][type] : 0)
      );
    };
    const cRate = Math.min(Math.max(totalCrit("cRate"), 0), 100) / 100;
    const cDmg = totalCrit("cDmg") / 100;

    base = applyToOneOrMany(
      base,
      (n) => (n + flat) * normalMult * specialMult * rxnMult * defMult * resMult
    );

    record.totalFlat = flat;
    record.normalMult = normalMult;
    record.specialMult = specialMult;
    record.rxnMult = rxnMult;
    record.defMult = defMult;
    record.resMult = resMult;
    record.cRate = cRate;
    record.cDmg = cDmg;

    return {
      nonCrit: base,
      crit: applyToOneOrMany(base, (n) => n * (1 + cDmg)),
      average: applyToOneOrMany(base, (n) => n * (1 + cRate * cDmg)),
    };
  } //
  else if (!Array.isArray(base)) {
    let flat = 0;
    let normalMult = 1;

    switch (stat.notAttack) {
      case "healing":
        flat = talentBuff.flat?.value || 0;
        normalMult += totalAttr.healBn / 100;
        break;
      case "shield":
        normalMult += (talentBuff.pct?.value || 0) / 100;
        break;
    }
    base += flat;
    record.totalFlat = (record.totalFlat || 0) + flat;

    if (normalMult !== 1) {
      base *= normalMult;
      record.normalMult = normalMult;
    }
    if (stat.getLimit) {
      const limit = stat.getLimit({ totalAttr });
      if (base > limit) {
        base = limit;
        record.note = ` (limited to ${limit})`;
      }
    }
    return { nonCrit: base, crit: 0, average: base };
  }
  return { nonCrit: 0, crit: 0, average: 0 };
}

export default function getDamage({
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
  infusion,
  elmtModCtrls: { reaction, infuse_reaction, resonances, superconduct },
  target,
  tracker,
}: GetDamageArgs) {
  const resistReduct = { def: 0 } as ResistanceReduction;

  for (const key of ATTACK_ELEMENTS) {
    resistReduct[key] = 0;
  }
  const { activeTalents, weaponType, vision, debuffs } = dataChar;
  const modifierArgs: DebuffModifierArgsWrapper = {
    char,
    resistReduct,
    attPattBonus,
    partyData,
    tracker,
  };

  // APPLY CUSTOM DEBUFFS
  for (const { type, value } of customDebuffCtrls) {
    applyModifier("Custom Debuff", resistReduct, type, value, tracker);
  }

  // APPLY SELF DEBUFFS
  for (const { activated, inputs = [], index } of selfDebuffCtrls) {
    const debuff = findByIndex(debuffs || [], index);

    if (
      activated &&
      debuff &&
      (!debuff.isGranted || debuff.isGranted(char)) &&
      debuff.applyDebuff
    ) {
      debuff.applyDebuff({
        desc: `Self / ${debuff.src}`,
        fromSelf: true,
        inputs,
        ...modifierArgs,
      });
    }
  }

  // APPLY PARTY DEBUFFS
  for (const teammate of party) {
    if (teammate) {
      const { debuffs = [] } = findDataCharacter(teammate)!;
      for (const { activated, inputs = [], index } of teammate.debuffCtrls) {
        const debuff = findByIndex(debuffs, index);

        if (activated && debuff?.applyDebuff) {
          debuff.applyDebuff({
            desc: `${teammate.name} / ${debuff.src}`,
            fromSelf: false,
            inputs,
            ...modifierArgs,
          });
        }
      }
    }
  }

  // APPLY ARTIFACT DEBUFFS
  for (const { activated, code, index, inputs = [] } of artDebuffCtrls) {
    if (activated) {
      const { name, debuffs = [] } = findDataArtifactSet({ code }) || {};
      if (name) {
        debuffs[index]?.applyDebuff({
          desc: `${name} / 4-piece activated`,
          inputs,
          ...modifierArgs,
        });
      }
    }
  }

  // APPLY RESONANCE DEBUFFS
  const geoRsn = resonances.find((rsn) => rsn.vision === "geo");
  if (geoRsn && geoRsn.activated) {
    applyModifier("Geo resonance", resistReduct, "geo", 20, tracker);
  }
  if (superconduct) {
    applyModifier("Superconduct", resistReduct, "phys", 40, tracker);
  }

  // CALCULATE RESISTANCE REDUCTION
  for (const key of [...ATTACK_ELEMENTS]) {
    let RES = (target.resistances[key] - resistReduct[key]) / 100;
    resistReduct[key] = RES < 0 ? 1 - RES / 2 : RES >= 0.75 ? 1 / (4 * RES + 1) : 1 - RES;
  }

  const finalResult = {
    NAs: {},
    ES: {},
    EB: {},
    RXN: {},
  } as DamageResult;

  if (tracker) {
    tracker.NAs = {};
    tracker.ES = {};
    tracker.EB = {};
    tracker.RXN = {};
  }

  ATTACK_PATTERNS.forEach((ATT_PATT) => {
    const talent = activeTalents[ATT_PATT];
    const resultKey = ATT_PATT === "ES" || ATT_PATT === "EB" ? ATT_PATT : "NAs";
    const defaultInfo = getTalentDefaultInfo(resultKey, weaponType, vision, ATT_PATT);
    const { multScale = defaultInfo.scale, multAttributeType = defaultInfo.attributeType } = talent;
    const level = finalTalentLv({
      dataChar,
      talentType: resultKey,
      char,
      partyData,
    });

    for (const stat of talent.stats) {
      const talentBuff = stat.getTalentBuff
        ? stat.getTalentBuff({
            char,
            charData,
            selfBuffCtrls,
            selfDebuffCtrls,
            totalAttr,
            partyData,
          })
        : {};

      // DMG TYPES & AMPLIFYING REACTION MULTIPLIER
      const attPatt = stat.attPatt || ATT_PATT;
      let attElmt = stat.subAttPatt === "FCA" ? vision : stat.attElmt || defaultInfo.attElmt;
      let actualReaction = reaction;
      let rxnMult = 1;

      // check and infused
      if (resultKey === "NAs" && attElmt === "phys" && infusion.element !== "phys") {
        attElmt = infusion.element;

        if (infusion.isCustom) {
          actualReaction = infuse_reaction;
        }
      }

      // deal elemental dmg and want amplify reaction
      if (
        attElmt !== "various" &&
        attElmt !== "phys" &&
        (actualReaction === "melt" || actualReaction === "vaporize")
      ) {
        rxnMult = getAmplifyingMultiplier(attElmt, rxnBonus)[actualReaction];
      }

      let bases = [];
      const { flatFactor } = stat;
      const record = {
        multFactors: [],
        normalMult: 1,
        talentBuff,
      } as TrackerDamageRecord;

      // CALCULATE BASE DAMAGE
      for (const factor of turnArray(stat.multFactors)) {
        const {
          root,
          attributeType = multAttributeType,
          scale = multScale,
        } = typeof factor === "number" ? { root: factor } : factor;

        const finalMult =
          root * (scale ? TALENT_LV_MULTIPLIERS[scale][level] : 1) + (talentBuff.mult?.value || 0);

        let flatBonus = 0;

        if (flatFactor) {
          const { root, scale = defaultInfo.flatFactorScale } =
            typeof flatFactor === "number" ? { root: flatFactor } : flatFactor;

          flatBonus = root * (scale ? TALENT_LV_MULTIPLIERS[scale][level] : 1);
        }

        record.multFactors.push({
          value: totalAttr[attributeType],
          desc: attributeType,
          talentMult: finalMult,
        });
        record.totalFlat = flatBonus;

        bases.push((totalAttr[attributeType] * finalMult) / 100 + flatBonus);
      }

      if (stat.isWholeFactor) {
        bases = [bases.reduce((accumulator, base) => accumulator + base, 0)];
      }

      // TALENT DMG
      if (resultKey === "NAs" && disabledNAs && !stat.notAttack) {
        finalResult[resultKey][stat.name] = {
          nonCrit: 0,
          crit: 0,
          average: 0,
        };
      } else {
        finalResult[resultKey][stat.name] = calcTalentDamage({
          stat,
          attPatt,
          attElmt,
          base: bases.length > 1 ? bases : bases[0],
          char,
          target,
          talentBuff,
          totalAttr,
          attPattBonus,
          attElmtBonus,
          rxnMult,
          resistReduct,
          record,
        });
      }
      if (tracker) {
        tracker[resultKey][stat.name] = record;
      }
    }
  });

  const baseRxnDmg = BASE_REACTION_DAMAGE[bareLv(char.level)];

  for (const rxn of TRANSFORMATIVE_REACTIONS) {
    const { mult, dmgType } = TRANSFORMATIVE_REACTION_INFO[rxn];
    const normalMult = 1 + rxnBonus[rxn].pct / 100;
    const resMult = dmgType !== "various" ? resistReduct[dmgType] : 1;
    const baseValue = baseRxnDmg * mult;
    const nonCrit = baseValue * normalMult * resMult;
    const cDmg = rxnBonus[rxn].cDmg / 100;
    const cRate = rxnBonus[rxn].cRate / 100;

    finalResult.RXN[rxn] = {
      nonCrit,
      crit: cDmg ? nonCrit * (1 + cDmg) : 0,
      average: cRate ? nonCrit * (1 + cDmg * cRate) : 0,
    };

    if (tracker) {
      tracker.RXN[rxn] = {
        multFactors: [{ value: Math.round(baseValue), desc: "Base DMG" }],
        normalMult,
        resMult,
        cDmg,
        cRate,
      };
    }
  }

  return finalResult;
}
