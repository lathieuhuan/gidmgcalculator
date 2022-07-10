import {
  CalcCharData,
  CharInfo,
  CustomDebuffCtrl,
  ElementModCtrl,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  DebuffMultiplier,
  SkillBonus,
  SubArtModCtrl,
  Target,
  TotalAttribute,
  Tracker,
  AbilityDebuff,
  DamageResult,
  TalentStatInfo,
  TalentBuff,
  Vision,
  AttackDamageType,
  AttackElement,
} from "@Src/types";
import {
  AMPLIFYING_ELEMENTS,
  AMPLIFYING_REACTIONS,
  ATTACK_DAMAGE_TYPES,
  DEBUFFS_MULTIPLIER_KEYS,
  TALENT_TYPES,
} from "@Src/constants";
import { findArtifactSet, findCharacter } from "@Data/controllers";
import { bareLv, finalTalentLv, findByIndex, toMultiplier } from "@Src/utils";
import { applyModifier, pushOrMergeTrackerRecord } from "./utils";
import { TALENT_LV_MULTIPLIERS } from "@Data/characters/constants";
import { DamageTypes, TrackerDamageRecord } from "./types";

function applyCustomDebuffs(
  debuffMult: DebuffMultiplier,
  customDebuffCtrls: CustomDebuffCtrl[],
  tracker: Tracker
) {
  for (const { type, value } of customDebuffCtrls) {
    debuffMult[type] += value;
    pushOrMergeTrackerRecord(tracker, type, "Custom Debuff", value);
  }
}

function applySelfDebuffs(
  debuffMult: DebuffMultiplier,
  partyData: PartyData,
  selfDebuffCtrls: ModifierCtrl[],
  debuffs: AbilityDebuff[] | undefined,
  char: CharInfo,
  tracker: Tracker
) {
  for (const { activated, inputs, index } of selfDebuffCtrls) {
    const debuff = findByIndex(debuffs || [], index);

    if (activated && debuff && debuff.isGranted(char) && debuff.applyDebuff) {
      const desc = `Self / ${debuff.src}`;
      debuff.applyDebuff({ debuffMult, fromSelf: true, char, inputs, desc, tracker });
    }
  }
}

function applyPartyDebuffs(debuffMult: DebuffMultiplier, party: Party, tracker: Tracker) {
  for (const tm of party) {
    if (!tm) {
      continue;
    }
    const { debuffs } = findCharacter(tm)!;
    for (const { activated, inputs, index } of tm.debuffCtrls) {
      const debuff = findByIndex(debuffs || [], index);

      if (activated && debuff && debuff.applyDebuff) {
        const desc = `${tm.name} / ${debuff.src}`;
        debuff.applyDebuff({ debuffMult, fromSelf: false, inputs, desc });
      }
    }
  }
}

function applyArtDebuffs(
  debuffMult: DebuffMultiplier,
  subArtDebuffCtrls: SubArtModCtrl[],
  tracker: Tracker
) {
  for (const { activated, code, index, inputs } of subArtDebuffCtrls) {
    if (activated) {
      const { name, debuffs } = findArtifactSet({ code })!;
      const desc = `${name} / 4-Piece activated`;
      debuffs![index].addPntes({ debuffMult, inputs, desc, tracker });
    }
  }
}

function applyResonanceDebuffs(
  debuffMult: DebuffMultiplier,
  elmtModCtrls: ElementModCtrl,
  tracker: Tracker
) {
  const geoRsn = elmtModCtrls.resonance.find((rsn) => rsn.vision === "geo");
  if (geoRsn && geoRsn.activated) {
    applyModifier("Geo Resonance", debuffMult, "geo_rd", 20, tracker);
  }
  if (elmtModCtrls.superconduct) {
    applyModifier("Superconduct", debuffMult, "phys_rd", 40, tracker);
  }
}

function calcResistanceDebuffMult(debuffMult: DebuffMultiplier, target: Target) {
  for (const key of ATTACK_DAMAGE_TYPES) {
    let RES = (target[`${key}_res`] - debuffMult[`${key}_rd`]) / 100;
    debuffMult[`${key}_rd`] = RES < 0 ? 1 - RES / 2 : RES >= 0.75 ? 1 / (4 * RES + 1) : 1 - RES;
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
  skillBonuses: SkillBonus,
  attInfusion: AttackDamageType,
  totalAttrs: TotalAttribute
) {
  let normal = (talentBuff.pct?.value || 0) + (skillBonuses[attPatt]?.pct || 0);
  if (["NA", "CA", "PA"].includes(attPatt) && attElmt === "phys" && attInfusion !== "phys") {
    normal += totalAttrs[`${attInfusion}_`];
  } else if (attElmt) {
    normal += skillBonuses[attElmt].pct;
  }
  let special = attPatt === "" ? 1 : toMultiplier(skillBonuses[attPatt].specialMult);
  return [toMultiplier(normal + skillBonuses.all.pct), special];
}

function getReactionMult(
  elmtModCtrls: ElementModCtrl,
  attElmt: AttackElement,
  attInfusion: AttackDamageType,
  rxnBonuses: ReactionBonus,
  vision: Vision
) {
  const { ampRxn, naAmpRxn } = elmtModCtrls;
  if (
    ampRxn &&
    (attElmt === "elmt" || (attInfusion === vision && AMPLIFYING_REACTIONS.includes(ampRxn)))
  ) {
    return rxnBonuses[ampRxn];
  }
  if (naAmpRxn && attInfusion !== vision && AMPLIFYING_REACTIONS.includes(naAmpRxn)) {
    return rxnBonuses[`na_${naAmpRxn}`];
  }
  return 1;
}

function getReduction(
  char: CharInfo,
  target: Target,
  debuffMult: DebuffMultiplier,
  [attPatt, attElmt]: DamageTypes,
  vision: Vision,
  attInfusion: AttackDamageType
) {
  const charPart = bareLv(char.level) + 100;
  const defReduction = 1 - debuffMult.def_rd / 100;
  let defIgnore = 1;
  if (attPatt !== "" && debuffMult[`${attPatt}_ig`]) {
    defIgnore = 1 - debuffMult[`${attPatt}_ig`] / 100;
  }
  const defMult = charPart / (defReduction * defIgnore * (target.level + 100) + charPart);

  if (attElmt === "elmt") {
    return [defMult, debuffMult[`${vision}_rd`]];
  } else if (attElmt === "phys" && !["NA", "CA", "PA"].includes(attPatt)) {
    return [defMult, debuffMult.phys_rd];
  } else if (attElmt === "various") {
    return [defMult, 1];
  }
  return [defMult, debuffMult[`${attInfusion}_rd`]];
}

function getCrit(ATTRs, tlBnes, [attPatt, attElmt], hitBnes) {
  const total = (type) =>
    ATTRs[lib[type]] +
    pickTlBn(tlBnes, type) +
    (hitBnes[attPatt]?.[type] || 0) +
    (hitBnes[attElmt]?.[type] || 0);
  return {
    Rate: Math.min(Math.max(hitBnes.All.cRate + total("cRate"), 0), 100) / 100,
    Dmg: total("cDmg") / 100,
  };
}

export default function getDmg(
  char: CharInfo,
  charData: CalcCharData,
  selfBuffCtrls: ModifierCtrl[],
  selfDebuffCtrls: ModifierCtrl[],
  party: Party,
  partyData: PartyData,
  subArtDebuffCtrls: SubArtModCtrl[],
  totalAttrs: TotalAttribute,
  skillBonuses: SkillBonus,
  rxnBonuses: ReactionBonus,
  customDebuffCtrls: CustomDebuffCtrl[],
  infusion: FinalInfusion,
  elmtModCtrls: ElementModCtrl,
  target: Target,
  tracker: Tracker
) {
  const debuffMult = {} as DebuffMultiplier;
  for (const key of DEBUFFS_MULTIPLIER_KEYS) {
    debuffMult[key] = 0;
  }
  const { activeTalents, vision, debuffs } = findCharacter(char)!;
  const finalResult = {} as DamageResult;

  applyCustomDebuffs(debuffMult, customDebuffCtrls, tracker);
  applySelfDebuffs(debuffMult, partyData, selfDebuffCtrls, debuffs, char, tracker);
  applyPartyDebuffs(debuffMult, party, tracker);
  applyArtDebuffs(debuffMult, subArtDebuffCtrls, tracker);
  applyResonanceDebuffs(debuffMult, elmtModCtrls, tracker);
  calcResistanceDebuffMult(debuffMult, target);

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

      if (base && dmgTypes) {
        // #to-check: assign infusion[dmgTypes[0] not work
        const attInfusion: AttackDamageType | undefined =
          infusion[dmgTypes[0] as keyof typeof infusion];
        const flat =
          (talentBuff.flat?.value || 0) +
          skillBonuses[dmgTypes[0]].flat +
          skillBonuses[dmgTypes[1]].flat;

        record.finalFlat = (record.finalFlat || 0) + flat;

        const [normal, special] = getDamageBonusMult(
          talentBuff,
          dmgTypes,
          skillBonuses,
          attInfusion,
          totalAttrs
        );

        const rxn = getReactionMult(elmtModCtrls, dmgTypes[1], attInfusion, rxnBonuses, vision);
        const [def, res] = getReduction(char, target, debuffMult, dmgTypes, vision, inf);
        base = calcDmg(base, dmgFormula(flat, normal, special, rxn, def, res));
        const c = getCrit(ATTRs, tlBnes, dmgTypes, hitBnes);

        finalResult[type][piece.name] = {
          "Non-crit": base,
          Crit: calcDmg(base, (n) => n * (1 + c.Dmg)),
          Average: calcDmg(base, (n) => n * (1 + c.Rate * c.Dmg)),
        };
        values.push(normal, special, rxn, def, res, c.Rate, c.Dmg);
      } else {
        let flat = 0;
        let normal = 1;
        if (piece.isHealing) {
          flat = pickTlBn(tlBnes, "flat");
          normal += ATTRs["Healing Bonus"] / 100;
        }
        base += flat;
        values[3] += flat;
        if (normal !== 1) {
          base *= normal;
          values.push(normal);
        }
        if (piece.getLimit) {
          const limit = piece.getLimit({ ATTRs });
          if (base > limit) {
            base = limit;
            values[11] = ` (limited to ${limit})`;
          }
        }
        finalResult[type][piece.name] = {
          "Non-crit": base,
          Crit: 0,
          Average: base,
        };
      }
      if (tracker) {
        tracker[type][piece.name] = { values, tlBnes };
      }
    }
  });

  finalResult["Reactions DMG"] = {};
  if (tracker) tracker.Reactions = {};
  for (const rxn in tfmRxns) {
    let base = baseRxnDmg[bareLv(char.level)];
    const normal = tfmRxns[rxn].mult;
    const special = 1 + rxnBnes[rxn] / 100;
    const { dmgType } = tfmRxns[rxn];
    const res = dmgType !== "Various" ? debuffMult[`${dmgType}_rd`] : 1;
    base *= normal * special * res;
    finalResult["Reactions DMG"][rxn] = {
      "Non-crit": base,
      Crit: 0,
      Average: base,
    };
    if (tracker) {
      tracker.Reactions[rxn] = [normal, special, res];
    }
  }
  return finalResult;
}
