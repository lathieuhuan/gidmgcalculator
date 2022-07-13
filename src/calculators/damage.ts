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
  TalentStatInfo,
  TalentBuff,
  Vision,
  AttackElement,
  NormalAttack,
  ResistanceReduction,
  DefenseIgnore,
  DamageTypes,
  AttackPatternBonus,
  AttackElementBonus,
} from "@Src/types";
import {
  AMPLIFYING_REACTIONS,
  ATTACK_PATTERNS,
  BASE_REACTION_DAMAGE,
  TALENT_TYPES,
  TRANSFORMATIVE_REACTIONS,
  TRANSFORMATIVE_REACTION_INFO,
  VISION_TYPES,
} from "@Src/constants";
import { findArtifactSet, findCharacter } from "@Data/controllers";
import { applyToOneOrMany, bareLv, finalTalentLv, findByIndex, toMultiplier } from "@Src/utils";
import { applyModifier, pushOrMergeTrackerRecord } from "./utils";
import { TALENT_LV_MULTIPLIERS } from "@Data/characters/constants";
import { TrackerDamageRecord } from "./types";

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
  resistReduct: ResistanceReduction,
  defIgnore: DefenseIgnore,
  selfDebuffCtrls: ModifierCtrl[],
  debuffs: AbilityDebuff[] | undefined,
  char: CharInfo,
  tracker: Tracker
) {
  for (const { activated, inputs, index } of selfDebuffCtrls) {
    const debuff = findByIndex(debuffs || [], index);

    if (activated && debuff && debuff.isGranted(char) && debuff.applyDebuff) {
      const desc = `Self / ${debuff.src}`;
      debuff.applyDebuff({ resistReduct, defIgnore, fromSelf: true, char, inputs, desc, tracker });
    }
  }
}

function applyPartyDebuffs(
  resistReduct: ResistanceReduction,
  defIgnore: DefenseIgnore,
  party: Party,
  tracker: Tracker
) {
  for (const tm of party) {
    if (!tm) {
      continue;
    }
    const { debuffs } = findCharacter(tm)!;
    for (const { activated, inputs, index } of tm.debuffCtrls) {
      const debuff = findByIndex(debuffs || [], index);

      if (activated && debuff && debuff.applyDebuff) {
        const desc = `${tm.name} / ${debuff.src}`;
        debuff.applyDebuff({ resistReduct, defIgnore, fromSelf: false, inputs, desc, tracker });
      }
    }
  }
}

function applyArtDebuffs(
  resistReduct: ResistanceReduction,
  defIgnore: DefenseIgnore,
  subArtDebuffCtrls: SubArtModCtrl[],
  tracker: Tracker
) {
  for (const { activated, code, index, inputs } of subArtDebuffCtrls) {
    if (activated) {
      const { name, debuffs } = findArtifactSet({ code })!;
      const desc = `${name} / 4-Piece activated`;
      debuffs![index].applyDebuff({ resistReduct, defIgnore, inputs, desc, tracker });
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
  totalAttrs: TotalAttribute,
  statInfo: TalentStatInfo,
  level: number,
  talentBuff: TalentBuff
): [number | number[], TrackerDamageRecord] {
  //
  const { baseStatType = "atk", baseMult, multType, flat } = statInfo;
  const xtraMult = talentBuff.mult?.value || 0;
  const record = {
    baseValue: totalAttrs[baseStatType],
    baseStatType,
  } as TrackerDamageRecord;

  const finalMult = (base: number) => base * TALENT_LV_MULTIPLIERS[multType][level] + xtraMult;

  const baseDamage = (pct: number) => {
    const result = (totalAttrs[baseStatType] * pct) / 100;
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
  totalAttrs: TotalAttribute,
  attPattBonuses: AttackPatternBonus,
  attInfusion: AttackElement | undefined
) {
  let normal = talentBuff.pct?.value || 0;
  let special = 1;

  if (attPatt) {
    normal += attPattBonuses[attPatt].pct;

    if (["NA", "CA", "PA"].includes(attPatt) && attElmt === "phys" && attInfusion) {
      normal += totalAttrs[attInfusion];
    } else if (attElmt !== "various") {
      normal += totalAttrs[attElmt];
    }
    special = toMultiplier(attPattBonuses[attPatt].specialMult);
  }
  return [toMultiplier(normal + attPattBonuses.all.pct), special];
}

function getReactionMult(
  elmtModCtrls: ElementModCtrl,
  attElmt: AttackElement,
  attInfusion: AttackElement,
  rxnBonuses: ReactionBonus,
  vision: Vision
) {
  const { ampRxn, naAmpRxn } = elmtModCtrls;
  if (
    ampRxn &&
    (attElmt !== "phys" || (attInfusion === vision && AMPLIFYING_REACTIONS.includes(ampRxn)))
  ) {
    return rxnBonuses[ampRxn];
  }
  if (naAmpRxn && attInfusion !== vision && AMPLIFYING_REACTIONS.includes(naAmpRxn)) {
    return rxnBonuses[`na_${naAmpRxn}`];
  }
  return 1;
}

function getReductionMult(
  char: CharInfo,
  target: Target,
  resistReduct: ResistanceReduction,
  defIgnore: DefenseIgnore,
  [attPatt, attElmt]: DamageTypes,
  vision: Vision,
  attInfusion: AttackElement
) {
  const charPart = bareLv(char.level) + 100;
  const defReduction = 1 - resistReduct.def / 100;
  let defMult = 1;
  if (attPatt && defIgnore[attPatt]) {
    defMult = 1 - defIgnore[attPatt] / 100;
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
  totalAttrs: TotalAttribute,
  talentBuff: TalentBuff,
  [attPatt, attElmt]: DamageTypes,
  attPattBonuses: AttackPatternBonus,
  attElmtBonuses: AttackElementBonus
) {
  const total = (type: "cRate" | "cDmg") => {
    return (
      totalAttrs[type] +
      (talentBuff[type]?.value || 0) +
      (attPatt ? attPattBonuses[attPatt][type] : 0) +
      (attElmt !== "various" && type === "cDmg" ? attElmtBonuses[attElmt][type] : 0) +
      attPattBonuses.all[type]
    );
  };
  return {
    Rate: Math.min(Math.max(total("cRate"), 0), 100) / 100,
    Dmg: total("cDmg") / 100,
  };
}

export default function getDamage(
  char: CharInfo,
  selfBuffCtrls: ModifierCtrl[],
  selfDebuffCtrls: ModifierCtrl[],
  party: Party,
  partyData: PartyData,
  subArtDebuffCtrls: SubArtModCtrl[],
  totalAttrs: TotalAttribute,
  attPattBonuses: AttackPatternBonus,
  attElmtBonuses: AttackElementBonus,
  rxnBonuses: ReactionBonus,
  customDebuffCtrls: CustomDebuffCtrl[],
  infusion: FinalInfusion,
  elmtModCtrls: ElementModCtrl,
  target: Target,
  tracker: Tracker
) {
  const resistReduct = {
    phys: 0,
  } as ResistanceReduction;
  const defIgnore = {} as DefenseIgnore;

  for (const key of VISION_TYPES) {
    resistReduct[key] = 0;
  }
  for (const key of ATTACK_PATTERNS) {
    defIgnore[key] = 0;
  }

  const { activeTalents, vision, debuffs } = findCharacter(char)!;
  const finalResult = {} as DamageResult;

  applyCustomDebuffs(resistReduct, customDebuffCtrls, tracker);
  applySelfDebuffs(resistReduct, defIgnore, selfDebuffCtrls, debuffs, char, tracker);
  applyPartyDebuffs(resistReduct, defIgnore, party, tracker);
  applyArtDebuffs(resistReduct, defIgnore, subArtDebuffCtrls, tracker);
  applyResonanceDebuffs(resistReduct, elmtModCtrls, tracker);
  calcResistanceReduction(resistReduct, target);

  activeTalents.forEach((talent, i) => {
    const type = TALENT_TYPES[i];
    const level = finalTalentLv(char, type, partyData);
    finalResult[type] = {};
    if (tracker) tracker[type] = {};

    for (const stat of talent.stats) {
      if (stat.noCalc) {
        continue;
      }
      let talentBuff: TalentBuff = {};
      const { dmgTypes, getTalentBuff } = stat;

      if (getTalentBuff) {
        talentBuff =
          getTalentBuff({ char, selfBuffCtrls, selfDebuffCtrls, totalAttrs, partyData }) || {};
      }
      let [base, record] = getBaseDamage(totalAttrs, stat, level, talentBuff);

      if (base && dmgTypes && dmgTypes[0] && dmgTypes[1] !== "various") {
        // #to-check: assign infusion[dmgTypes[0] not work
        const attInfusion: AttackElement | undefined = infusion[dmgTypes[0] as NormalAttack];
        const flat =
          (talentBuff.flat?.value || 0) +
          attPattBonuses[dmgTypes[0]].flat +
          totalAttrs[dmgTypes[1]];

        record.finalFlat = (record.finalFlat || 0) + flat;

        const [normalMult, specialMult] = getDamageBonusMult(
          talentBuff,
          dmgTypes,
          totalAttrs,
          attPattBonuses,
          attInfusion
        );
        const rxnMult = getReactionMult(elmtModCtrls, dmgTypes[1], attInfusion, rxnBonuses, vision);
        const [defMult, resMult] = getReductionMult(
          char,
          target,
          resistReduct,
          defIgnore,
          dmgTypes,
          vision,
          attInfusion
        );
        base = applyToOneOrMany(
          base,
          (n) => (n + flat) * normalMult * specialMult * rxnMult * defMult * resMult
        );
        const c = getCrit(totalAttrs, talentBuff, dmgTypes, attPattBonuses, attElmtBonuses);

        finalResult[type][stat.name] = {
          nonCrit: base,
          crit: applyToOneOrMany(base, (n) => n * (1 + c.Dmg)),
          average: applyToOneOrMany(base, (n) => n * (1 + c.Rate * c.Dmg)),
        };
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
      } else if (!Array.isArray(base)) {
        let flat = 0;
        let normalMult = 1;

        if (stat.isHealing) {
          flat = talentBuff.flat?.value || 0;
          normalMult += totalAttrs.healBn / 100;
        }
        base += flat;
        record.finalFlat += flat;

        if (normalMult !== 1) {
          base *= normalMult;
          record.normalMult = normalMult;
        }
        if (stat.getLimit) {
          const limit = stat.getLimit({ totalAttrs });
          if (base > limit) {
            base = limit;
            record.note = ` (limited to ${limit})`;
          }
        }
        finalResult[type][stat.name] = {
          nonCrit: base,
          crit: 0,
          average: base,
        };
      }
      if (tracker) {
        tracker[type][stat.name] = { record, talentBuff };
      }
    }
  });

  finalResult.RXN = {};
  if (tracker) tracker.RXN = {};

  for (const rxn of TRANSFORMATIVE_REACTIONS) {
    let base = BASE_REACTION_DAMAGE[bareLv(char.level)];
    const { mult: normalMult, dmgType } = TRANSFORMATIVE_REACTION_INFO[rxn];

    const specialMult = 1 + rxnBonuses[rxn] / 100;
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
