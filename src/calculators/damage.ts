import { findArtifactSet, findCharacter } from "@Data/controllers";
import { DEBUFFS_MULTIPLIER_KEYS } from "@Src/constants";
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
} from "@Src/types";
import { findByIndex, findByName } from "@Src/utils";
import { applyModifier, pushOrMergeTrackerRecord } from "./utils";

function applyCustomDebuffs(
  rdMult: DebuffMultiplier,
  customDebuffCtrls: CustomDebuffCtrl[],
  tracker: Tracker
) {
  for (const { type, value } of customDebuffCtrls) {
    rdMult[type] += value;
    pushOrMergeTrackerRecord(tracker, type, "Custom Debuff", value);
  }
}

function applySelfDebuffs(
  rdMult: DebuffMultiplier,
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
      debuff.applyDebuff({ rdMult, fromSelf: true, char, inputs, desc, tracker });
    }
  }
}

function applyPartyDebuffs(rdMult: DebuffMultiplier, party: Party, tracker: Tracker) {
  for (const tm of party) {
    if (!tm) {
      continue;
    }
    const { debuffs } = findCharacter(tm)!;
    for (const { activated, inputs, index } of tm.debuffCtrls) {
      const debuff = findByIndex(debuffs || [], index);

      if (activated && debuff && debuff.applyDebuff) {
        const desc = `${tm.name} / ${debuff.src}`;
        debuff.applyDebuff({ rdMult, fromSelf: false, inputs, desc });
      }
    }
  }
}

function applyArtDebuffs(
  rdMult: DebuffMultiplier,
  subArtDebuffCtrls: SubArtModCtrl[],
  tracker: Tracker
) {
  for (const { activated, code, index, inputs } of subArtDebuffCtrls) {
    if (activated) {
      const { name, debuffs } = findArtifactSet({ code })!;
      const desc = `${name} / 4-Piece activated`;
      debuffs![index].addPntes({ rdMult, inputs, desc, tracker });
    }
  }
}

function applyResonanceDebuffs(
  rdMult: DebuffMultiplier,
  elmtModCtrls: ElementModCtrl,
  tracker: Tracker
) {
  const geoRsn = elmtModCtrls.resonance.find((rsn) => rsn.vision === "geo");
  if (geoRsn && geoRsn.activated) {
    applyModifier("Geo Resonance", rdMult, "geo_rd", 20, tracker);
  }
  if (elmtModCtrls.superconduct) {
    applyModifier("Superconduct", rdMult, "phys_rd", 40, tracker);
  }
}

function getBaseDmg(ATTRs, dmgPiece, level, tlBnes) {
  const { baseMult, multType, baseFlat, flatType } = dmgPiece;
  const statT = dmgPiece.baseSType || "ATK";
  const xtraMult = pickTlBn(tlBnes, "mult");
  const flatBn = baseFlat ? baseFlat * tlLvMults[flatType][level] : 0;
  const values = [ATTRs[statT], statT];

  const totalPct = (thisMult) => thisMult * tlLvMults[multType][level] + xtraMult;
  const baseDmg = (thisPct) => {
    let result = (ATTRs[statT] * thisPct) / 100;
    values[3] = flatBn;
    return result + flatBn;
  };
  if (Array.isArray(baseMult)) {
    const pcts = baseMult.map(totalPct);
    values[2] = pcts;
    return [pcts.map(baseDmg), values];
  }
  const pct = totalPct(baseMult);
  values[2] = pct;
  return [baseDmg(pct), values];
}

function getTotalFlat(tlBnes, hitBnes, [attPatt, attElmt]) {
  return pickTlBn(tlBnes, "flat") + (hitBnes[attPatt]?.flat || 0) + (hitBnes[attElmt]?.flat || 0);
}

function getDmgBnMult(tlBnes, [attPatt, attElmt], hitBnes, inf, ATTRs) {
  let normal = pickTlBn(tlBnes, "pct") + (hitBnes[attPatt]?.pct || 0);
  if (NAs.includes(attPatt) && attElmt === "Physical" && inf !== "Physical") {
    normal += ATTRs[inf + " DMG Bonus"];
  } else {
    normal += hitBnes[attElmt]?.pct || 0;
  }
  let special = 1; // attPatt can be null
  if (attPatt && hitBnes[attPatt]?.sMult) {
    special += hitBnes[attPatt].sMult / 100;
  }
  return [toMult(hitBnes.All.pct + normal), special];
}

function getRxnMult(elmtMCs, attElmt, inf, rxnBnes, vision) {
  const { ampRxn, naAmpRxn } = elmtMCs;
  if (
    ampRxn &&
    (attElmt === "Elemental" || (inf === vision && ampRxnTrigElmts[ampRxn].includes(inf)))
  ) {
    return rxnBnes[ampRxn];
  } else if (naAmpRxn && inf !== vision && ampRxnTrigElmts[naAmpRxn].includes(inf)) {
    return rxnBnes["na" + naAmpRxn];
  }
  return 1;
}

function getReduction(char, target, rdMult, [attPatt, attElmt], vision, inf) {
  const defMult = getDefMult(char.level, target.Level, rdMult, attPatt);
  if (attElmt === "Elemental") {
    return [defMult, rdMult[`${vision}_rd`]];
  } else if (attElmt === "Physical" && !NAs.includes(attPatt)) {
    return [defMult, rdMult.Physical_rd];
  } else if (attElmt === "Various") {
    return [defMult, 1];
  }
  return [defMult, rdMult[`${inf}_rd`]];
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
  const rdMult = {} as DebuffMultiplier;
  for (const key of DEBUFFS_MULTIPLIER_KEYS) {
    rdMult[key] = 0;
  }
  const { activeTalents, vision, debuffs } = findCharacter(char)!;

  applyCustomDebuffs(rdMult, customDebuffCtrls, tracker);
  applySelfDebuffs(rdMult, partyData, selfDebuffCtrls, debuffs, char, tracker);
  applyPartyDebuffs(rdMult, party, tracker);
  applyArtDebuffs(rdMult, subArtDebuffCtrls, tracker);
  applyResonanceDebuffs(rdMult, elmtModCtrls, tracker);

  for (const key of physAndElmts) {
    rdMult[`${key}_rd`] = getResMult(target, rdMult, key);
  }

  const finalResult = {};
  actvTalents.forEach((talent) => {
    const { type } = talent;
    const level = getFinalTlLv(char, talent, partyData);
    finalResult[type] = {};
    if (tracker) tracker[type] = {};

    for (const piece of talent.stats) {
      if (piece.noCalc) continue;
      const { dmgTypes, getTlBnes } = piece;
      let tlBnes;
      if (getTlBnes) {
        tlBnes = getTlBnes({ char, charData, selfMCs, ATTRs, partyData });
      }
      tlBnes = tlBnes || {};
      let [base, values] = getBaseDmg(ATTRs, piece, level, tlBnes);

      if (base && dmgTypes) {
        const inf = infusion[dmgTypes[0]];
        const flat = getTotalFlat(tlBnes, hitBnes, dmgTypes);
        addOrInit(values, 3, flat);
        const [normal, special] = getDmgBnMult(tlBnes, dmgTypes, hitBnes, inf, ATTRs);
        const rxn = getRxnMult(elmtMCs, dmgTypes[1], inf, rxnBnes, vision);
        const [def, res] = getReduction(char, target, rdMult, dmgTypes, vision, inf);
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
    const res = dmgType !== "Various" ? rdMult[`${dmgType}_rd`] : 1;
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
