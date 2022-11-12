import type {
  CharInfo,
  CustomDebuffCtrl,
  ElementModCtrl,
  FinalInfusion,
  ModifierCtrl,
  Party,
  PartyData,
  ReactionBonus,
  Target,
  TotalAttribute,
  Tracker,
  DamageResult,
  TalentBuff,
  Vision,
  NormalAttack,
  ResistanceReduction,
  DamageTypes,
  AttackPatternBonus,
  AttackElementBonus,
  StatInfo,
  CharData,
  ArtifactDebuffCtrl,
} from "@Src/types";
import {
  AMPLIFYING_REACTIONS,
  ATTACK_ELEMENTS,
  ATTACK_PATTERNS,
  TRANSFORMATIVE_REACTIONS,
} from "@Src/constants";
import { applyToOneOrMany, bareLv, finalTalentLv, findByIndex, toMult } from "@Src/utils";

import { findArtifactSet, findCharacter } from "@Data/controllers";
import { TALENT_LV_MULTIPLIERS } from "@Data/characters/constants";
import { charModIsInUse } from "@Data/characters/utils";
import { getNilouA4BuffValue, nilouA1isOn } from "@Data/characters/hydro/Nilou";

import { TrackerDamageRecord } from "./types";
import { applyModifier, getDefaultStatInfo, pushOrMergeTrackerRecord } from "./utils";
import { BASE_REACTION_DAMAGE, TRANSFORMATIVE_REACTION_INFO } from "./constants";

interface CalcTalentStatArgs {
  stat: StatInfo;
  defaultDmgTypes: DamageTypes;
  base: number | number[];
  char: CharInfo;
  vision: Vision;
  target: Target;
  elmtModCtrls: ElementModCtrl;
  talentBuff: TalentBuff;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  rxnBonus: ReactionBonus;
  resistReduct: ResistanceReduction;
  infusion: FinalInfusion;
}
function calcTalentDamage({
  stat,
  defaultDmgTypes,
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
  infusion,
}: CalcTalentStatArgs) {
  let record = {} as TrackerDamageRecord;
  const [attPatt, attElmt] = stat.dmgTypes || defaultDmgTypes;

  if (base !== 0 && !stat.notAttack) {
    const attInfusion = attPatt ? infusion[attPatt as NormalAttack] : undefined;

    const flat =
      (talentBuff.flat?.value || 0) +
      (attPatt ? attPattBonus[attPatt].flat : 0) +
      (attElmt === "various" ? 0 : attElmtBonus[attElmt].flat);

    record.finalFlat = flat;

    // CALCULATE DAMAGE BONUS MULTIPLIERS
    let normalMult = talentBuff.pct?.value || 0;
    let specialMult = 1;

    if (attPatt) {
      normalMult += attPattBonus[attPatt].pct;

      specialMult = toMult(attPattBonus[attPatt].specialMult);
    }
    if (attPatt && ["NA", "CA", "PA"].includes(attPatt) && attElmt === "phys" && attInfusion) {
      normalMult += totalAttr[attInfusion];
    } else if (attElmt !== "various") {
      normalMult += totalAttr[attElmt];
    }
    normalMult = toMult(normalMult + attPattBonus.all.pct);

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
        : !attInfusion || attElmt === "various"
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
    return { nonCrit: base, crit: 0, average: base };
  }
  return { nonCrit: 0, crit: 0, average: 0 };
}

interface GetDamageArgs {
  char: CharInfo;
  charData: CharData;
  selfBuffCtrls: ModifierCtrl[];
  selfDebuffCtrls: ModifierCtrl[];
  artDebuffCtrls: ArtifactDebuffCtrl[];
  party: Party;
  partyData: PartyData;
  totalAttr: TotalAttribute;
  attPattBonus: AttackPatternBonus;
  attElmtBonus: AttackElementBonus;
  rxnBonus: ReactionBonus;
  customDebuffCtrls: CustomDebuffCtrl[];
  infusion: FinalInfusion;
  elmtModCtrls: ElementModCtrl;
  target: Target;
  tracker: Tracker;
}
export default function getDamage({
  char,
  charData,
  selfBuffCtrls,
  selfDebuffCtrls,
  artDebuffCtrls,
  party,
  partyData,
  totalAttr,
  attPattBonus,
  attElmtBonus,
  rxnBonus,
  customDebuffCtrls,
  infusion,
  elmtModCtrls,
  target,
  tracker,
}: GetDamageArgs) {
  const resistReduct = { def: 0 } as ResistanceReduction;

  for (const key of ATTACK_ELEMENTS) {
    resistReduct[key] = 0;
  }
  const { activeTalents, weapon, vision, debuffs } = findCharacter(char)!;
  const wrapper3 = { char, resistReduct, attPattBonus, partyData, tracker };

  // APPLY CUSTOM DEBUFFS
  for (const { type, value } of customDebuffCtrls) {
    resistReduct[type] += value;
    pushOrMergeTrackerRecord(tracker, type, "Custom Debuff", value);
  }

  // APPLY SELF DEBUFFS
  for (const { activated, inputs, index } of selfDebuffCtrls) {
    const debuff = findByIndex(debuffs || [], index);

    if (
      activated &&
      debuff &&
      (!debuff.isGranted || debuff.isGranted(char)) &&
      debuff.applyDebuff
    ) {
      const desc = `Self / ${debuff.src}`;
      const validatedInputs = inputs || [];
      debuff.applyDebuff({ ...wrapper3, fromSelf: true, inputs: validatedInputs, desc });
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
          const validatedInputs = inputs || [];
          debuff.applyDebuff({ ...wrapper3, fromSelf: false, inputs: validatedInputs, desc });
        }
      }
    }
  }

  // APPLY ARTIFACT DEBUFFS
  for (const { activated, code, index, inputs } of artDebuffCtrls) {
    if (activated) {
      const { name, debuffs = [] } = findArtifactSet({ code }) || {};
      if (name) {
        const desc = `${name} / 4-Piece activated`;
        debuffs[index]?.applyDebuff({ resistReduct, inputs, desc, tracker });
      }
    }
  }

  // APPLY RESONANCE DEBUFFS
  const geoRsn = elmtModCtrls.resonances.find((rsn) => rsn.vision === "geo");
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

  ATTACK_PATTERNS.forEach((attPatt) => {
    const talent = activeTalents[attPatt];
    const resultKey = attPatt === "ES" || attPatt === "EB" ? attPatt : "NAs";
    const defaultInfo = getDefaultStatInfo(resultKey, weapon, vision);
    const level = finalTalentLv(char, resultKey, partyData);

    for (const stat of talent.stats) {
      let talentBuff: TalentBuff = {};

      if (stat.getTalentBuff) {
        talentBuff =
          stat.getTalentBuff({
            char,
            charData,
            selfBuffCtrls,
            selfDebuffCtrls,
            totalAttr,
            partyData,
          }) || {};
      }

      // CALCULATE BASE DAMAGE
      let base;
      const {
        baseStatType = "atk",
        multBase,
        isStatic,
        multType = defaultInfo.multType,
        flat,
      } = stat;
      const xtraMult = talentBuff.mult?.value || 0;
      const record = {
        baseValue: totalAttr[baseStatType],
        baseStatType,
      } as TrackerDamageRecord;

      const finalMult = (multBase: number) =>
        multBase * (isStatic ? 1 : TALENT_LV_MULTIPLIERS[multType][level]) + xtraMult;

      const baseDamage = (percent: number) => {
        const result = (totalAttr[baseStatType] * percent) / 100;
        const flatBonus = flat
          ? flat.base * (isStatic ? 1 : TALENT_LV_MULTIPLIERS[flat.type][level])
          : 0;

        record.finalFlat = flatBonus;
        return result + flatBonus;
      };

      if (Array.isArray(multBase)) {
        const percents = multBase.map(finalMult);

        record.finalMult = percents;
        base = percents.map(baseDamage);
      } //
      else {
        const percent = finalMult(multBase);

        record.finalMult = percent;
        base = baseDamage(percent);
      }

      finalResult[resultKey][stat.name] = calcTalentDamage({
        stat,
        defaultDmgTypes: [attPatt, defaultInfo.attElmt],
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
        infusion,
      });
      if (tracker) {
        tracker[resultKey][stat.name] = { record, talentBuff };
      }
    }
  });

  const baseRxnDmg = BASE_REACTION_DAMAGE[bareLv(char.level)];
  // Special reaction buffs, one of its kind
  let nilouA4BuffValue = 0;
  let nahidaC2isInUse = false;

  switch (charData.name) {
    case "Nilou": {
      const { buffs } = findCharacter(char) || {};
      if (
        buffs &&
        nilouA1isOn(partyData, charData) &&
        charModIsInUse(buffs, char, selfBuffCtrls, 0)
      ) {
        nilouA4BuffValue = getNilouA4BuffValue(totalAttr.hp);
      }
      break;
    }
    case "Nahida":
      const { buffs } = findCharacter(char) || {};
      if (buffs && charModIsInUse(buffs, char, selfBuffCtrls, 3)) {
        nahidaC2isInUse = true;
      }
      break;
  }

  for (const teammate of party) {
    if (!teammate) {
      continue;
    }
    switch (teammate.name) {
      case "Nilou":
        const { activated, inputs = [] } = findByIndex(teammate.buffCtrls, 0) || {};

        if (nilouA1isOn(partyData, charData) && activated) {
          nilouA4BuffValue = getNilouA4BuffValue(inputs[0] || 0);
        }
        break;
      case "Nahida": {
        nahidaC2isInUse = !!findByIndex(teammate.buffCtrls, 3)?.activated;
        break;
      }
    }
  }

  for (const rxn of TRANSFORMATIVE_REACTIONS) {
    const { mult: normalMult, dmgType } = TRANSFORMATIVE_REACTION_INFO[rxn];

    const specialPercent = rxnBonus[rxn] + (rxn === "bloom" ? nilouA4BuffValue : 0);
    const specialMult = 1 + specialPercent / 100;
    const resMult = dmgType !== "various" ? resistReduct[dmgType] : 1;
    const base = baseRxnDmg * normalMult * specialMult * resMult;

    finalResult.RXN[rxn] = { nonCrit: base, crit: 0, average: base };

    if (tracker) {
      tracker.RXN[rxn] = {
        record: { normalMult, specialMult, resMult },
      };
    }
  }

  if (nahidaC2isInUse) {
    for (const rxn of ["burning", "bloom", "hyperbloom", "burgeon"] as const) {
      const { [rxn]: rxnDmg } = finalResult.RXN;

      rxnDmg.crit = applyToOneOrMany(rxnDmg.nonCrit, (n) => n * 2);
      rxnDmg.average = applyToOneOrMany(rxnDmg.nonCrit, (n) => n * 1.2);

      if (tracker) {
        tracker.RXN[rxn].record.cRate = 0.2;
        tracker.RXN[rxn].record.cDmg = 1;
      }
    }
  }

  return finalResult;
}
