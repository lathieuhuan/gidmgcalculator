import {
  CharInfo,
  CustomDebuffCtrl,
  ElementModCtrl,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  SubArtModCtrl,
  Target,
  TotalAttribute,
  Tracker,
  DamageResult,
  TalentBuff,
  Vision,
  AttackElement,
  NormalAttack,
  ResistanceReduction,
  DamageTypes,
  AttackPatternBonus,
  AttackElementBonus,
  StatInfo,
} from "@Src/types";
import {
  AMPLIFYING_REACTIONS,
  ATTACK_ELEMENTS,
  ATTACK_PATTERNS,
  TRANSFORMATIVE_REACTIONS,
  VISION_TYPES,
} from "@Src/constants";
import { findArtifactSet, findCharacter } from "@Data/controllers";
import { applyToOneOrMany, bareLv, finalTalentLv, findByIndex, toMultiplier } from "@Src/utils";
import { applyModifier, pushOrMergeTrackerRecord } from "./utils";
import { TALENT_LV_MULTIPLIERS } from "@Data/characters/constants";
import { TrackerDamageRecord } from "./types";
import { BASE_REACTION_DAMAGE, TRANSFORMATIVE_REACTION_INFO } from "./constants";

function calcTalentStat(
  stat: StatInfo,
  defaultDmgTypes: DamageTypes,
  base: number | number[],
  char: CharInfo,
  vision: Vision,
  target: Target,
  elmtModCtrls: ElementModCtrl,
  talentBuff: TalentBuff,
  totalAttr: TotalAttribute,
  attPattBonus: AttackPatternBonus,
  attElmtBonus: AttackElementBonus,
  rxnBonus: ReactionBonus,
  resistReduct: ResistanceReduction,
  infusion: FinalInfusion
) {
  let record = {} as TrackerDamageRecord;
  const dmgTypes = stat.dmgTypes || defaultDmgTypes;
  const [attPatt, attElmt] = dmgTypes;

  if (base !== 0 && dmgTypes && dmgTypes[0] && dmgTypes[1] !== "various") {
    // #to-check: assign infusion[dmgTypes[0] not work
    const attInfusion: AttackElement | undefined = infusion[dmgTypes[0] as NormalAttack];
    const flat =
      (talentBuff.flat?.value || 0) + attPattBonus[dmgTypes[0]].flat + totalAttr[dmgTypes[1]];

    record.finalFlat = (record.finalFlat || 0) + flat;

    // CALCULATE DAMAGE BONUS MULTIPLIERS
    let normalMult = talentBuff.pct?.value || 0;
    let specialMult = 1;

    if (attPatt) {
      normalMult += attPattBonus[attPatt].pct;

      if (["NA", "CA", "PA"].includes(attPatt) && attElmt === "phys" && attInfusion) {
        normalMult += totalAttr[attInfusion];
      } else if (attElmt !== "various") {
        normalMult += totalAttr[attElmt];
      }
      specialMult = toMultiplier(attPattBonus[attPatt].specialMult);
    }
    normalMult = toMultiplier(normalMult + attPattBonus.all.pct);

    // CALCULATE REACTION MULTIPLIER
    let rxnMult = 1;
    const { ampRxn, infusion_ampRxn } = elmtModCtrls;

    if (
      ampRxn &&
      (attElmt !== "phys" || (attInfusion === vision && AMPLIFYING_REACTIONS.includes(ampRxn)))
    ) {
      rxnMult = rxnBonus[ampRxn];
    } //
    else if (
      infusion_ampRxn &&
      attInfusion !== vision &&
      AMPLIFYING_REACTIONS.includes(infusion_ampRxn)
    ) {
      rxnMult = rxnBonus[`infusion_${infusion_ampRxn}`];
    }

    // CALCULATE DEFENSE MULTIPLIER
    let defMult = 1;
    const charPart = bareLv(char.level) + 100;
    const defReduction = 1 - resistReduct.def / 100;

    if (attPatt) {
      defMult = 1 - attPattBonus[attPatt].defIgnore / 100;
    }
    defMult = charPart / (defReduction * defMult * (target.level + 100) + charPart);

    // CALCULATE RESISTANCE MULTIPLIER
    const resMult =
      attElmt !== "phys" && attElmt !== "various"
        ? resistReduct[vision]
        : attElmt === "phys" && attPatt && !["NA", "CA", "PA"].includes(attPatt)
        ? resistReduct.phys
        : attElmt === "various"
        ? 1
        : resistReduct[attInfusion];

    // CALCULATE CRITS
    const totalCrit = (type: "cRate" | "cDmg") => {
      return (
        totalAttr[type] +
        (talentBuff[type]?.value || 0) +
        (attPatt ? attPattBonus[attPatt][type] : 0) +
        attPattBonus.all[type]
      );
    };
    const xtraCritDmg = attElmt !== "various" ? attElmtBonus[attElmt].cDmg : 0;
    const cRate = Math.min(Math.max(totalCrit("cRate"), 0), 100) / 100;
    const cDmg = (totalCrit("cDmg") + xtraCritDmg) / 100;

    base = applyToOneOrMany(
      base,
      (n) => (n + flat) * normalMult * specialMult * rxnMult * defMult * resMult
    );

    record = {
      ...record,
      normalMult,
      specialMult,
      rxnMult,
      defMult,
      resMult,
      cRate,
      cDmg,
    };
    return {
      nonCrit: base,
      crit: applyToOneOrMany(base, (n) => n * (1 + cDmg)),
      average: applyToOneOrMany(base, (n) => n * (1 + cRate * cDmg)),
    };
  } //
  else if (!Array.isArray(base)) {
    let flat = 0;
    let normalMult = 1;

    if (stat.isHealing) {
      flat = talentBuff.flat?.value || 0;
      normalMult += totalAttr.healBn / 100;
    }
    base += flat;
    record.finalFlat += flat;

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
    return {
      nonCrit: base,
      crit: 0,
      average: base,
    };
  } else {
    return { nonCrit: 0, crit: 0, average: 0 };
  }
}

export default function getDamage(
  char: CharInfo,
  selfBuffCtrls: ModifierCtrl[],
  selfDebuffCtrls: ModifierCtrl[],
  party: Party,
  partyData: PartyData,
  subArtDebuffCtrls: SubArtModCtrl[],
  totalAttr: TotalAttribute,
  attPattBonus: AttackPatternBonus,
  attElmtBonus: AttackElementBonus,
  rxnBonus: ReactionBonus,
  customDebuffCtrls: CustomDebuffCtrl[],
  infusion: FinalInfusion,
  elmtModCtrls: ElementModCtrl,
  target: Target,
  tracker: Tracker
) {
  const resistReduct = { def: 0 } as ResistanceReduction;

  for (const key of ATTACK_ELEMENTS) {
    resistReduct[key] = 0;
  }
  const { activeTalents, weapon, vision, debuffs } = findCharacter(char)!;
  const wrapper3 = { resistReduct, attPattBonus };

  const finalResult = {} as DamageResult;

  // APPLY CUSTOM DEBUFFS
  for (const { type, value } of customDebuffCtrls) {
    resistReduct[type] += value;
    pushOrMergeTrackerRecord(tracker, type, "Custom Debuff", value);
  }

  // APPLY SELF DEBUFFS
  for (const { activated, inputs, index } of selfDebuffCtrls) {
    const debuff = findByIndex(debuffs || [], index);

    if (activated && debuff && debuff.isGranted(char) && debuff.applyDebuff) {
      const desc = `Self / ${debuff.src}`;
      debuff.applyDebuff({ ...wrapper3, fromSelf: true, char, inputs, desc, tracker });
    }
  }

  // APPLY PARTY DEBUFFS
  for (const teammate of party) {
    if (teammate) {
      const { debuffs } = findCharacter(teammate)!;
      for (const { activated, inputs, index } of teammate.debuffCtrls) {
        const debuff = findByIndex(debuffs || [], index);

        if (activated && debuff && debuff.applyDebuff) {
          const desc = `${teammate} / ${debuff.src}`;
          debuff.applyDebuff({ ...wrapper3, fromSelf: false, inputs, desc, tracker });
        }
      }
    }
  }

  // APPLY ARTIFACT DEBUFFS
  for (const { activated, code, index, inputs } of subArtDebuffCtrls) {
    if (activated) {
      const { name, debuffs } = findArtifactSet({ code })!;
      const desc = `${name} / 4-Piece activated`;
      debuffs![index].applyDebuff({ resistReduct, inputs, desc, tracker });
    }
  }

  // APPLY RESONANCE DEBUFFS
  const geoRsn = elmtModCtrls.resonance.find((rsn) => rsn.vision === "geo");
  if (geoRsn && geoRsn.activated) {
    applyModifier("Geo Resonance", resistReduct, "geo", 20, tracker);
  }
  if (elmtModCtrls.superconduct) {
    applyModifier("Superconduct", resistReduct, "phys", 40, tracker);
  }

  // CALCULATE RESISTANCE REDUCTION
  for (const key of [...ATTACK_ELEMENTS]) {
    let RES = (target[key] - resistReduct[key]) / 100;
    resistReduct[key] = RES < 0 ? 1 - RES / 2 : RES >= 0.75 ? 1 / (4 * RES + 1) : 1 - RES;
  }

  finalResult.NAs = {};
  if (tracker) tracker.NAs = {};

  ATTACK_PATTERNS.forEach((attPatt) => {
    const talent = activeTalents[attPatt];
    const resultKey = attPatt === "ES" || attPatt === "EB" ? attPatt : "NAs";
    const level = finalTalentLv(char, resultKey, partyData);

    if (resultKey !== "NAs") {
      finalResult[resultKey] = {};
      if (tracker) tracker[resultKey] = {};
    }

    for (const stat of talent.stats) {
      let talentBuff: TalentBuff = {};

      if (stat.getTalentBuff) {
        talentBuff =
          stat.getTalentBuff({ char, selfBuffCtrls, selfDebuffCtrls, totalAttr, partyData }) || {};
      }

      // CALCULATE BASE DAMAGE
      let base;
      const { baseStatType = "atk", baseMult, multType, flat } = stat;
      const xtraMult = talentBuff.mult?.value || 0;
      const record = {
        baseValue: totalAttr[baseStatType],
        baseStatType,
      } as TrackerDamageRecord;

      const finalMult = (base: number) => base * TALENT_LV_MULTIPLIERS[multType][level] + xtraMult;

      const baseDamage = (pct: number) => {
        const result = (totalAttr[baseStatType] * pct) / 100;
        const flatBonus = flat ? flat.base * TALENT_LV_MULTIPLIERS[flat.type][level] : 0;

        record.finalFlat = flatBonus;
        return result + flatBonus;
      };

      if (Array.isArray(baseMult)) {
        const pcts = baseMult.map(finalMult);

        record.finalMult = pcts;
        base = pcts.map(baseDamage);
      } //
      else {
        const pct = finalMult(baseMult);

        record.finalMult = pct;
        base = baseDamage(pct);
      }

      finalResult[resultKey][stat.name] = calcTalentStat(
        stat,
        [attPatt, weapon === "catalyst" ? vision : "phys"],
        base,
        char,
        vision,
        target,
        elmtModCtrls,
        talentBuff,
        totalAttr,
        attPattBonus,
        attElmtBonus,
        rxnBonus,
        resistReduct,
        infusion
      );
      if (tracker) {
        tracker[resultKey][stat.name] = { record, talentBuff };
      }
    }
  });

  finalResult.RXN = {};
  if (tracker) tracker.RXN = {};

  for (const rxn of TRANSFORMATIVE_REACTIONS) {
    let base = BASE_REACTION_DAMAGE[bareLv(char.level)];
    const { mult: normalMult, dmgType } = TRANSFORMATIVE_REACTION_INFO[rxn];

    const specialMult = 1 + rxnBonus[rxn] / 100;
    const resMult = dmgType !== "various" ? resistReduct[dmgType] : 1;

    base *= normalMult * specialMult * resMult;

    finalResult.RXN[rxn] = { nonCrit: base, crit: 0, average: base };
    if (tracker) {
      tracker.RXN[rxn] = {
        record: {
          normalMult,
          specialMult,
          resMult,
        },
      };
    }
  }
  return finalResult;
}
