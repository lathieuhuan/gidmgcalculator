import { applyToOneOrMany, bareLv, toMult } from "@Src/utils";
import { CalculateItemArgs } from "../types";
import { getExclusiveBonus } from "./utils";

export function calculateItem({
  stat,
  attElmt,
  attPatt,
  base,
  char,
  target,
  totalAttr,
  attPattBonus,
  attElmtBonus,
  calcItemBonues,
  rxnMult,
  resistReduct,
  record,
}: CalculateItemArgs) {
  const itemFlatBonus = getExclusiveBonus(calcItemBonues, "flat");
  const itemPctBonus = getExclusiveBonus(calcItemBonues, "pct_");
  const itemMultPlusBonus = getExclusiveBonus(calcItemBonues, "multPlus");

  if (base !== 0 && !stat.type) {
    const flat =
      itemFlatBonus +
      attPattBonus.all.flat +
      (attPatt !== "none" ? attPattBonus[attPatt].flat : 0) +
      attElmtBonus[attElmt].flat;
    // CALCULATE DAMAGE BONUS MULTIPLIERS
    let normalMult = itemPctBonus + attPattBonus.all.pct_ + totalAttr[attElmt];
    let specialMult = itemMultPlusBonus + attPattBonus.all.multPlus;

    if (attPatt !== "none") {
      normalMult += attPattBonus[attPatt].pct_;
      specialMult += attPattBonus[attPatt].multPlus;
    }
    normalMult = toMult(normalMult);
    specialMult = toMult(specialMult);

    // CALCULATE DEFENSE MULTIPLIER
    let defMult = 1;
    const charPart = bareLv(char.level) + 100;
    const defReduction = 1 - resistReduct.def / 100;

    if (attPatt !== "none") {
      defMult = 1 - (attPattBonus[attPatt].defIgn_ + attPattBonus.all.defIgn_) / 100;
    }
    defMult = charPart / (defReduction * defMult * (target.level + 100) + charPart);

    // CALCULATE RESISTANCE MULTIPLIER
    const resMult = resistReduct[attElmt];

    // CALCULATE CRITS
    const totalCrit = (type: "cRate_" | "cDmg_") => {
      return (
        totalAttr[type] +
        getExclusiveBonus(calcItemBonues, type) +
        attPattBonus.all[type] +
        (attPatt !== "none" ? attPattBonus[attPatt][type] : 0) +
        attElmtBonus[attElmt][type]
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
      attElmt,
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
    if (stat.type === "healing") {
      base *= 1 + totalAttr.inHealB_ / 100;
    }
    return { nonCrit: base, crit: 0, average: base };
  }
  return { nonCrit: 0, crit: 0, average: 0 };
}
