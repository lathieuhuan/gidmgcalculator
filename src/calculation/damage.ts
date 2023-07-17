import type {
  DamageResult,
  ResistanceReduction,
  DebuffModifierArgsWrapper,
  TrackerDamageRecord,
  NormalAttack,
} from "@Src/types";
import type { CalcPatternStatArgs, GetDamageArgs } from "./types";

// Constant
import { ATTACK_ELEMENTS, ATTACK_PATTERNS, TRANSFORMATIVE_REACTIONS, BASE_REACTION_DAMAGE } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { TRANSFORMATIVE_REACTION_INFO } from "./constants";

// Util
import { findDataArtifactSet } from "@Data/controllers";
import { appData } from "@Data/index";
import { applyToOneOrMany, bareLv, findByIndex, toMult, getTalentDefaultInfo, turnArray } from "@Src/utils";
import { finalTalentLv, applyModifier, getAmplifyingMultiplier } from "@Src/utils/calculation";
import { getItemBonus } from "./utils";

function calcItem({
  stat,
  attElmt,
  attPatt,
  base,
  char,
  target,
  totalAttr,
  attPattBonus,
  attElmtBonus,
  calcItemBonuses,
  rxnMult,
  resistReduct,
  record,
}: CalcPatternStatArgs) {
  const itemFlatBonus = getItemBonus(calcItemBonuses, "flat");
  const itemPctBonus = getItemBonus(calcItemBonuses, "pct_");

  if (base !== 0 && !stat.type) {
    const flat =
      itemFlatBonus +
      attPattBonus.all.flat +
      (attPatt !== "none" ? attPattBonus[attPatt].flat : 0) +
      (attElmt !== "various" ? attElmtBonus[attElmt].flat : 0);

    // CALCULATE DAMAGE BONUS MULTIPLIERS
    let normalMult = itemPctBonus + attPattBonus.all.pct_;
    let specialMult = 1;

    if (attPatt !== "none") {
      normalMult += attPattBonus[attPatt].pct_;
      specialMult = toMult(attPattBonus[attPatt].multPlus);
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
      defMult = 1 - (attPattBonus[attPatt].defIgn_ + attPattBonus.all.defIgn_) / 100;
    }
    defMult = charPart / (defReduction * defMult * (target.level + 100) + charPart);

    // CALCULATE RESISTANCE MULTIPLIER
    const resMult = attElmt === "various" ? 1 : resistReduct[attElmt];

    // CALCULATE CRITS
    const totalCrit = (type: "cRate_" | "cDmg_") => {
      return (
        totalAttr[type] +
        getItemBonus(calcItemBonuses, type) +
        attPattBonus.all[type] +
        (attPatt !== "none" ? attPattBonus[attPatt][type] : 0) +
        (attElmt !== "various" ? attElmtBonus[attElmt][type] : 0)
      );
    };
    const cRate_ = Math.min(Math.max(totalCrit("cRate_"), 0), 100) / 100;
    const cDmg_ = totalCrit("cDmg_") / 100;

    base = applyToOneOrMany(base, (n) => (n + flat) * normalMult * specialMult * rxnMult * defMult * resMult);

    record.totalFlat = flat;
    record.normalMult = normalMult;
    record.specialMult = specialMult;
    record.rxnMult = rxnMult;
    record.defMult = defMult;
    record.resMult = resMult;
    record.cRate_ = cRate_;
    record.cDmg_ = cDmg_;

    return {
      nonCrit: base,
      crit: applyToOneOrMany(base, (n) => n * (1 + cDmg_)),
      average: applyToOneOrMany(base, (n) => n * (1 + cRate_ * cDmg_)),
    };
  } //
  else if (!Array.isArray(base)) {
    let flat = 0;
    let normalMult = 1;

    switch (stat.type) {
      case "healing":
        flat = itemFlatBonus;
        normalMult += totalAttr.healB_ / 100;
        break;
      case "shield":
        normalMult += itemPctBonus / 100;
        break;
    }
    base += flat;
    record.totalFlat = (record.totalFlat || 0) + flat;

    if (normalMult !== 1) {
      base *= normalMult;
      record.normalMult = normalMult;
    }
    return { nonCrit: base, crit: 0, average: base };
  }
  return { nonCrit: 0, crit: 0, average: 0 };
}

export default function getDamage({
  char,
  charData,
  selfBuffCtrls,
  selfDebuffCtrls,
  artDebuffCtrls,
  party,
  partyData,
  disabledNAs,
  totalAttr,
  attPattBonus,
  attElmtBonus,
  calcItemBonuses,
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
  const { calcListConfig, calcList, weaponType, vision, debuffs } = charData;
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

    if (activated && debuff && (!debuff.isGranted || debuff.isGranted(char)) && debuff.applyDebuff) {
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
      const { debuffs = [] } = appData.getCharData(teammate.name);
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
    const resultKey = ATT_PATT === "ES" || ATT_PATT === "EB" ? ATT_PATT : "NAs";
    const defaultInfo = getTalentDefaultInfo(resultKey, weaponType, vision, ATT_PATT);
    const config = calcListConfig?.[ATT_PATT] || {};
    const { multScale = defaultInfo.scale, multAttributeType = defaultInfo.attributeType } = config;
    const level = finalTalentLv({ charData, talentType: resultKey, char, partyData });

    for (const stat of calcList[ATT_PATT]) {
      // DMG TYPES & AMPLIFYING REACTION MULTIPLIER
      const attPatt = stat.attPatt || ATT_PATT;
      let attElmt = stat.subAttPatt === "FCA" ? vision : stat.attElmt || defaultInfo.attElmt;
      let actualReaction = reaction;
      let rxnMult = 1;

      // check and infused
      if (
        resultKey === "NAs" &&
        attElmt === "phys" &&
        infusion.element !== "phys" &&
        infusion.range.includes(ATT_PATT as NormalAttack)
      ) {
        attElmt = infusion.element;

        if (infusion.isCustom) {
          actualReaction = infuse_reaction;
        }
      }

      // deal elemental dmg and want amplify reaction
      if (attElmt !== "various" && attElmt !== "phys" && (actualReaction === "melt" || actualReaction === "vaporize")) {
        rxnMult = getAmplifyingMultiplier(attElmt, rxnBonus)[actualReaction];
      }

      let bases = [];
      const { id, flatFactor } = stat;
      const itemBonuses = id
        ? calcItemBonuses.filter((bonus) => (Array.isArray(bonus.ids) ? bonus.ids.includes(id) : bonus.ids === id))
        : [];
      const itemBonusMult = itemBonuses.reduce((total, bonus) => total + (bonus.bonus.mult_?.value || 0), 0);

      const record = {
        multFactors: [],
        normalMult: 1,
        itemBonuses,
      } as TrackerDamageRecord;

      // CALCULATE BASE DAMAGE
      for (const factor of turnArray(stat.multFactors)) {
        const {
          root,
          attributeType = multAttributeType,
          scale = multScale,
        } = typeof factor === "number" ? { root: factor } : factor;

        const finalMult = root * (scale ? TALENT_LV_MULTIPLIERS[scale][level] : 1) + itemBonusMult;

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

      if (stat.multFactorsAreOne) {
        bases = [bases.reduce((accumulator, base) => accumulator + base, 0)];
      }

      // TALENT DMG
      if (resultKey === "NAs" && disabledNAs && !stat.type) {
        finalResult[resultKey][stat.name] = {
          nonCrit: 0,
          crit: 0,
          average: 0,
        };
      } else {
        finalResult[resultKey][stat.name] = calcItem({
          stat,
          attPatt,
          attElmt,
          base: bases.length > 1 ? bases : bases[0],
          char,
          target,
          totalAttr,
          attPattBonus,
          attElmtBonus,
          calcItemBonuses: itemBonuses,
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
    const normalMult = 1 + rxnBonus[rxn].pct_ / 100;
    const resMult = dmgType !== "various" ? resistReduct[dmgType] : 1;
    const baseValue = baseRxnDmg * mult;
    const nonCrit = baseValue * normalMult * resMult;
    const cDmg_ = rxnBonus[rxn].cDmg_ / 100;
    const cRate_ = rxnBonus[rxn].cRate_ / 100;

    finalResult.RXN[rxn] = {
      nonCrit,
      crit: cDmg_ ? nonCrit * (1 + cDmg_) : 0,
      average: cRate_ ? nonCrit * (1 + cDmg_ * cRate_) : 0,
    };

    if (tracker) {
      tracker.RXN[rxn] = {
        multFactors: [{ value: Math.round(baseValue), desc: "Base DMG" }],
        normalMult,
        resMult,
        cDmg_,
        cRate_,
      };
    }
  }

  return finalResult;
}
