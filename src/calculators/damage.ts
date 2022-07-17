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
  AbilityDebuff,
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
  ATTACK_PATTERNS,
  TRANSFORMATIVE_REACTIONS,
  VISION_TYPES,
} from "@Src/constants";
import { findArtifactSet, findCharacter } from "@Data/controllers";
import { applyToOneOrMany, bareLv, finalTalentLv, findByIndex, toMultiplier } from "@Src/utils";
import { applyModifier, pushOrMergeTrackerRecord } from "./utils";
import { TALENT_LV_MULTIPLIERS } from "@Data/characters/constants";
import { TrackerDamageRecord, Wrapper3 } from "./types";
import { BASE_REACTION_DAMAGE, TRANSFORMATIVE_REACTION_INFO } from "./constants";

function applyCustomDebuffs(
  resistReduct: ResistanceReduction,
  customDebuffCtrls: CustomDebuffCtrl[],
  tracker: Tracker
) {
  for (const { type, value } of customDebuffCtrls) {
    resistReduct[type] += value;
    pushOrMergeTrackerRecord(tracker, type, "Custom Debuff", value);
  }
}

function applySelfDebuffs(
  wrapper3: Wrapper3,
  selfDebuffCtrls: ModifierCtrl[],
  debuffs: AbilityDebuff[] | undefined,
  char: CharInfo,
  tracker: Tracker
) {
  for (const { activated, inputs, index } of selfDebuffCtrls) {
    const debuff = findByIndex(debuffs || [], index);

    if (activated && debuff && debuff.isGranted(char) && debuff.applyDebuff) {
      const desc = `Self / ${debuff.src}`;
      debuff.applyDebuff({ ...wrapper3, fromSelf: true, char, inputs, desc, tracker });
    }
  }
}

function applyPartyDebuffs(wrapper3: Wrapper3, party: Party, tracker: Tracker) {
  for (const tm of party) {
    if (!tm) {
      continue;
    }
    const { debuffs } = findCharacter(tm)!;
    for (const { activated, inputs, index } of tm.debuffCtrls) {
      const debuff = findByIndex(debuffs || [], index);

      if (activated && debuff && debuff.applyDebuff) {
        const desc = `${tm.name} / ${debuff.src}`;
        debuff.applyDebuff({ ...wrapper3, fromSelf: false, inputs, desc, tracker });
      }
    }
  }
}

function applyArtDebuffs(
  resistReduct: ResistanceReduction,
  subArtDebuffCtrls: SubArtModCtrl[],
  tracker: Tracker
) {
  for (const { activated, code, index, inputs } of subArtDebuffCtrls) {
    if (activated) {
      const { name, debuffs } = findArtifactSet({ code })!;
      const desc = `${name} / 4-Piece activated`;
      debuffs![index].applyDebuff({ resistReduct, inputs, desc, tracker });
    }
  }
}

function applyResonanceDebuffs(
  resistReduct: ResistanceReduction,
  elmtModCtrls: ElementModCtrl,
  tracker: Tracker
) {
  const geoRsn = elmtModCtrls.resonance.find((rsn) => rsn.vision === "geo");
  if (geoRsn && geoRsn.activated) {
    applyModifier("Geo Resonance", resistReduct, "geo", 20, tracker);
  }
  if (elmtModCtrls.superconduct) {
    applyModifier("Superconduct", resistReduct, "phys", 40, tracker);
  }
}

function calcResistanceReduction(resistReduct: ResistanceReduction, target: Target) {
  for (const key of [...VISION_TYPES]) {
    let RES = (target[key] - resistReduct[key]) / 100;
    resistReduct[key] = RES < 0 ? 1 - RES / 2 : RES >= 0.75 ? 1 / (4 * RES + 1) : 1 - RES;
  }
}

function getBaseDamage(
  totalAttr: TotalAttribute,
  statInfo: StatInfo,
  level: number,
  talentBuff: TalentBuff
): [number | number[], TrackerDamageRecord] {
  //
  const { baseStatType = "atk", baseMult, multType, flat } = statInfo;
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
    return [pcts.map(baseDamage), record];
  }
  const pct = finalMult(baseMult);
  record.finalMult = pct;

  return [baseDamage(pct), record];
}

function getDamageBonusMult(
  talentBuff: TalentBuff,
  [attPatt, attElmt]: DamageTypes,
  totalAttr: TotalAttribute,
  attPattBonus: AttackPatternBonus,
  attInfusion: AttackElement | undefined
) {
  let normal = talentBuff.pct?.value || 0;
  let special = 1;

  if (attPatt) {
    normal += attPattBonus[attPatt].pct;

    if (["NA", "CA", "PA"].includes(attPatt) && attElmt === "phys" && attInfusion) {
      normal += totalAttr[attInfusion];
    } else if (attElmt !== "various") {
      normal += totalAttr[attElmt];
    }
    special = toMultiplier(attPattBonus[attPatt].specialMult);
  }
  return [toMultiplier(normal + attPattBonus.all.pct), special];
}

function getReactionMult(
  elmtModCtrls: ElementModCtrl,
  attElmt: AttackElement,
  attInfusion: AttackElement,
  rxnBonus: ReactionBonus,
  vision: Vision
) {
  const { ampRxn, naAmpRxn } = elmtModCtrls;
  if (
    ampRxn &&
    (attElmt !== "phys" || (attInfusion === vision && AMPLIFYING_REACTIONS.includes(ampRxn)))
  ) {
    return rxnBonus[ampRxn];
  }
  if (naAmpRxn && attInfusion !== vision && AMPLIFYING_REACTIONS.includes(naAmpRxn)) {
    return rxnBonus[`na_${naAmpRxn}`];
  }
  return 1;
}

function getReductionMult(
  char: CharInfo,
  target: Target,
  resistReduct: ResistanceReduction,
  attPattBonus: AttackPatternBonus,
  [attPatt, attElmt]: DamageTypes,
  vision: Vision,
  attInfusion: AttackElement
) {
  const charPart = bareLv(char.level) + 100;
  const defReduction = 1 - resistReduct.def / 100;
  let defMult = 1;
  if (attPatt) {
    defMult = 1 - attPattBonus[attPatt].defIgnore / 100;
  }
  defMult = charPart / (defReduction * defMult * (target.level + 100) + charPart);

  if (attElmt !== "phys" && attElmt !== "various") {
    return [defMult, resistReduct[vision]];
  } else if (attElmt === "phys" && attPatt && !["NA", "CA", "PA"].includes(attPatt)) {
    return [defMult, resistReduct.phys];
  } else if (attElmt === "various") {
    return [defMult, 1];
  }
  return [defMult, resistReduct[attInfusion]];
}

function getCrit(
  totalAttr: TotalAttribute,
  talentBuff: TalentBuff,
  [attPatt, attElmt]: DamageTypes,
  attPattBonus: AttackPatternBonus,
  attElmtBonus: AttackElementBonus
) {
  const subTotal = (type: "cRate" | "cDmg") => {
    return (
      totalAttr[type] +
      (talentBuff[type]?.value || 0) +
      (attPatt ? attPattBonus[attPatt][type] : 0) +
      attPattBonus.all[type]
    );
  };
  const xtraCritDmg = attElmt !== "various" ? attElmtBonus[attElmt].cDmg : 0;
  return {
    Rate: Math.min(Math.max(subTotal("cRate"), 0), 100) / 100,
    Dmg: (subTotal("cDmg") + xtraCritDmg) / 100,
  };
}

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

  if (base !== 0 && dmgTypes && dmgTypes[0] && dmgTypes[1] !== "various") {
    // #to-check: assign infusion[dmgTypes[0] not work
    const attInfusion: AttackElement | undefined = infusion[dmgTypes[0] as NormalAttack];
    const flat =
      (talentBuff.flat?.value || 0) + attPattBonus[dmgTypes[0]].flat + totalAttr[dmgTypes[1]];

    record.finalFlat = (record.finalFlat || 0) + flat;

    const [normalMult, specialMult] = getDamageBonusMult(
      talentBuff,
      dmgTypes,
      totalAttr,
      attPattBonus,
      attInfusion
    );
    const rxnMult = getReactionMult(elmtModCtrls, dmgTypes[1], attInfusion, rxnBonus, vision);
    const [defMult, resMult] = getReductionMult(
      char,
      target,
      resistReduct,
      attPattBonus,
      dmgTypes,
      vision,
      attInfusion
    );
    base = applyToOneOrMany(
      base,
      (n) => (n + flat) * normalMult * specialMult * rxnMult * defMult * resMult
    );
    const c = getCrit(totalAttr, talentBuff, dmgTypes, attPattBonus, attElmtBonus);

    record = {
      ...record,
      normalMult,
      specialMult,
      rxnMult,
      defMult,
      resMult,
      cRate: c.Rate,
      cDmg: c.Dmg,
    };
    return {
      nonCrit: base,
      crit: applyToOneOrMany(base, (n) => n * (1 + c.Dmg)),
      average: applyToOneOrMany(base, (n) => n * (1 + c.Rate * c.Dmg)),
    };
  } else if (!Array.isArray(base)) {
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
  const resistReduct = { phys: 0 } as ResistanceReduction;

  for (const key of VISION_TYPES) {
    resistReduct[key] = 0;
  }
  const { activeTalents, weapon, vision, debuffs } = findCharacter(char)!;
  const wrapper3 = { resistReduct, attPattBonus };

  const finalResult = {} as DamageResult;

  applyCustomDebuffs(resistReduct, customDebuffCtrls, tracker);
  applySelfDebuffs(wrapper3, selfDebuffCtrls, debuffs, char, tracker);
  applyPartyDebuffs(wrapper3, party, tracker);
  applyArtDebuffs(resistReduct, subArtDebuffCtrls, tracker);
  applyResonanceDebuffs(resistReduct, elmtModCtrls, tracker);
  calcResistanceReduction(resistReduct, target);

  ATTACK_PATTERNS.forEach((attPatt) => {
    const talent = activeTalents[attPatt];
    const resultKey = attPatt === "ES" || attPatt === "EB" ? attPatt : "NAs";
    const level = finalTalentLv(char, resultKey, partyData);

    finalResult[resultKey] = {};
    if (tracker) tracker[resultKey] = {};

    for (const stat of talent.stats) {
      let talentBuff: TalentBuff = {};

      if (stat.getTalentBuff) {
        talentBuff =
          stat.getTalentBuff({ char, selfBuffCtrls, selfDebuffCtrls, totalAttr, partyData }) || {};
      }
      let [base, record] = getBaseDamage(totalAttr, stat, level, talentBuff);

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
        tracker[attPatt][stat.name] = { record, talentBuff };
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
