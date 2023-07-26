import { Fragment, ReactNode } from "react";

import type { CalculatedDamageCluster, Infusion, CalcItemBonus, TrackerDamageRecord } from "@Src/types";
import { useTranslation } from "@Src/hooks";

// Util
import { percentSign, round } from "@Src/utils";
import { renderDmgComponent, renderDmgValue } from "./utils";

// Component
import { Green } from "@Src/pure-components";

interface DamageTrackerProps {
  records?: Record<string, TrackerDamageRecord>;
  calcDmgResult: CalculatedDamageCluster;
  defMultDisplay?: ReactNode;
  infusion?: Infusion;
}
export function DamageTracker({ records = {}, calcDmgResult, defMultDisplay, infusion }: DamageTrackerProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      {defMultDisplay}

      {infusion && infusion.element !== "phys" && (
        <div>
          <p className="text-lightgold">Infusion:</p>
          <ul className="pl-4 list-disc">
            <li className="capitalize">
              Element: <span className={`text-${infusion.element}`}>{infusion.element}</span>
            </li>
            {infusion.range?.length ? (
              <li>Infused attack types: {infusion.range.map((att) => t(att)).join(", ")}</li>
            ) : null}
          </ul>
        </div>
      )}

      {Object.entries(records).map(([attackName, record], i) => {
        const { nonCrit = 0, crit = 0, average = 0 } = calcDmgResult[attackName] || {};

        if (!nonCrit) {
          return null;
        }

        const nonCritDmg = renderDmgValue(nonCrit);
        const cDmg_ = record.cDmg_ ? round(record.cDmg_, 3) : 0;

        return (
          <div key={i}>
            <p className="font-medium">{t(attackName)}</p>
            <ul className="pl-4 text-lesser text-sm leading-6 list-disc">
              {renderExclusiveBonuses(record.exclusives, t)}

              <li>
                Non-crit <span className="text-orange font-semibold">{nonCritDmg}</span> = (
                {record.multFactors.map((factor, i) => {
                  return (
                    <Fragment key={i}>
                      {factor.desc ? t(factor.desc) + " " : null}
                      <Green>{Math.round(factor.value)}</Green>
                      {factor.talentMult ? (
                        <>
                          {" "}
                          <Green>*</Green> Talent Mult.{" "}
                          <Green>{renderDmgValue(factor.talentMult, (value) => round(value, 2) + "%")}</Green>
                        </>
                      ) : null}
                      {record.multFactors[i + 1] ? " + " : ""}
                    </Fragment>
                  );
                })}
                {renderDmgComponent({
                  desc: "Flat Bonus",
                  value: record.totalFlat,
                  sign: "+",
                  processor: Math.round,
                })}
                )
                {renderDmgComponent({
                  desc: "Percent Mult.",
                  value: record.normalMult,
                  processor: (value) => round(value * 100, 2) + "%",
                })}
                {renderDmgComponent({
                  desc: "Special Mult.",
                  value: record.specialMult,
                  nullValue: 1,
                  processor: (value) => round(value, 3),
                })}
                {renderDmgComponent({
                  desc: "Reaction Mult.",
                  value: record.rxnMult,
                  nullValue: 1,
                  processor: (value) => round(value, 3),
                })}
                {renderDmgComponent({
                  desc: "DEF Mult.",
                  value: record.defMult,
                  processor: (value) => round(value, 3),
                })}
                {renderDmgComponent({
                  desc: "RES Mult.",
                  value: record.resMult,
                })}
                {record.note}
              </li>

              {cDmg_ ? (
                <li>
                  Crit <span className="text-orange font-semibold">{renderDmgValue(crit)}</span> = {nonCritDmg}{" "}
                  <Green>*</Green> (<Green>1 +</Green> Crit DMG <Green>{cDmg_}</Green>)
                </li>
              ) : null}

              {cDmg_ && record.cRate_ ? (
                <li>
                  Average <span className="text-orange font-semibold">{renderDmgValue(average)}</span> = {nonCritDmg}{" "}
                  <Green>*</Green> (<Green>1 +</Green> Crit DMG <Green>{cDmg_}</Green>
                  {renderDmgComponent({
                    desc: "Crit Rate",
                    value: record.cRate_,
                    nullValue: null,
                    processor: (value) => round(value, 3),
                  })}
                  )
                </li>
              ) : null}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function renderExclusiveBonuses(bonuses: CalcItemBonus[] = [], t: (str: string) => string) {
  if (!bonuses.length) {
    return null;
  }
  return (
    <li>
      <p className="text-lightgold">Exclusive</p>
      {bonuses.map((bonus, i) => {
        return Object.entries(bonus).map(([key, record]) => {
          return (
            <p key={i} className="list-disc">
              + {t(key)}: {record.desc}{" "}
              <Green>
                {record.value}
                {percentSign(key)}
              </Green>
            </p>
          );
        });
      })}
    </li>
  );
}
