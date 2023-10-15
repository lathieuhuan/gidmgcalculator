import type {
  DamageResult,
  ResistanceReduction,
  DebuffModifierArgsWrapper,
  TrackerDamageRecord,
  NormalAttack,
  CalcItemBonus,
  AttackElement,
} from "@Src/types";
import type { GetDamageArgs } from "../types";

// Constant
import {
  ATTACK_ELEMENTS,
  ATTACK_PATTERNS,
  TRANSFORMATIVE_REACTIONS,
  BASE_REACTION_DAMAGE,
  VISION_TYPES,
} from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { TRANSFORMATIVE_REACTION_INFO } from "../constants";

// Util
import { appData } from "@Data/index";
import { bareLv, findByIndex, getTalentDefaultInfo, toArray } from "@Src/utils";
import { finalTalentLv, applyModifier, getAmplifyingMultiplier } from "@Src/utils/calculation";
import { getExclusiveBonus } from "./utils";
import { calculateItem } from "./calculateItem";

export default function getDamage({
  char,
  charData,
  selfDebuffCtrls,
  artDebuffCtrls,
  party,
  partyData,
  disabledNAs,
  totalAttr,
  attPattBonus,
  attElmtBonus,
  calcItemBuffs,
  rxnBonus,
  customDebuffCtrls,
  infusion,
  elmtModCtrls: { reaction, infuse_reaction, resonances, superconduct, absorption },
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
      const { name, debuffs = [] } = appData.getArtifactSetData(code) || {};

      if (debuffs[index]) {
        const { value, path, inputIndex = 0 } = debuffs[index].penalties;
        const elementIndex = inputs?.[inputIndex] ?? 0;
        const finalPath = path === "input_element" ? VISION_TYPES[elementIndex] : path;
        applyModifier(`${name} / 4-piece activated`, resistReduct, finalPath, value, tracker);
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

  const finalResult: DamageResult = {
    NAs: {},
    ES: {},
    EB: {},
    RXN: {},
  };

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
      let attElmt =
        (stat.subAttPatt === "FCA" ? vision : stat.attElmt === "absorb" ? absorption : stat.attElmt) ??
        defaultInfo.attElmt;
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
      if (attElmt !== "phys" && (actualReaction === "melt" || actualReaction === "vaporize")) {
        rxnMult = getAmplifyingMultiplier(attElmt, rxnBonus)[actualReaction];
      }

      let bases = [];
      const { id, flatFactor } = stat;
      const calcItemBonues = id
        ? calcItemBuffs.reduce<CalcItemBonus[]>((bonuses, buff) => {
            if (Array.isArray(buff.ids) ? buff.ids.includes(id) : buff.ids === id) {
              bonuses.push(buff.bonus);
            }
            return bonuses;
          }, [])
        : [];
      const itemBonusMult = getExclusiveBonus(calcItemBonues, "mult_");

      const record = {
        multFactors: [],
        normalMult: 1,
        exclusives: calcItemBonues,
      } as TrackerDamageRecord;

      // CALCULATE BASE DAMAGE
      for (const factor of toArray(stat.multFactors)) {
        const {
          root,
          attributeType = multAttributeType,
          scale = multScale,
        } = typeof factor === "number" ? { root: factor } : factor;

        const finalMult =
          root * (scale ? TALENT_LV_MULTIPLIERS[scale][level] : 1) + itemBonusMult + attPattBonus[ATT_PATT].mult_;

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
        finalResult[resultKey][stat.name] = calculateItem({
          stat,
          attPatt,
          attElmt,
          base: bases.length > 1 ? bases : bases[0],
          char,
          target,
          totalAttr,
          attPattBonus,
          attElmtBonus,
          calcItemBonues,
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
    const resMult = dmgType !== "absorb" ? resistReduct[dmgType] : 1;
    const baseValue = baseRxnDmg * mult;
    const nonCrit = baseValue * normalMult * resMult;
    const cDmg_ = rxnBonus[rxn].cDmg_ / 100;
    const cRate_ = rxnBonus[rxn].cRate_ / 100;

    finalResult.RXN[rxn] = {
      nonCrit,
      crit: cDmg_ ? nonCrit * (1 + cDmg_) : 0,
      average: cRate_ ? nonCrit * (1 + cDmg_ * cRate_) : 0,
      attElmt: dmgType,
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