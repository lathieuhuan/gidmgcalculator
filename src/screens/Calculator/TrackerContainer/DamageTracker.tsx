import { Fragment, ReactNode } from "react";
import type {
  CalculatedDamageCluster,
  Infusion,
  TalentBuff,
  TrackerDamageRecord,
} from "@Src/types";

// Constant
import { keyMap } from "./constants";

// Component
import { Green } from "@Components/atoms";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { percentSign, round } from "@Src/utils";
import { renderDmgComponent, renderDmgValue } from "./utils";

interface DamageTrackerProps {
  records?: Record<string, TrackerDamageRecord>;
  calcDmgResult: CalculatedDamageCluster;
  defMultDisplay?: ReactNode;
  infusion?: Infusion;
}
export function DamageTracker({
  records = {},
  calcDmgResult,
  defMultDisplay,
  infusion,
}: DamageTrackerProps) {
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
        const cDmg = record.cDmg ? round(record.cDmg, 3) : 0;

        return (
          <div key={i}>
            <p className="font-medium">{t(attackName)}</p>
            <ul className="pl-4 text-lesser text-sm leading-6 list-disc">
              {renderTalentBuff(record.talentBuff)}

              <li>
                Non-crit <span className="text-orange font-semibold">{nonCritDmg}</span> = (
                {record.multFactors.map((factor, i) => {
                  return (
                    <Fragment key={i}>
                      {factor.desc ? t(factor.desc) + " " : null}
                      <Green>{factor.value}</Green>
                      {factor.talentMult ? (
                        <>
                          {" "}
                          <Green>*</Green> Talent Mult.{" "}
                          <Green>
                            {renderDmgValue(factor.talentMult, (value) => round(value, 2) + "%")}
                          </Green>
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

              {cDmg ? (
                <li>
                  Crit <span className="text-orange font-semibold">{renderDmgValue(crit)}</span> ={" "}
                  {nonCritDmg} <Green>*</Green> (<Green>1 +</Green> Crit DMG <Green>{cDmg}</Green>)
                </li>
              ) : null}

              {cDmg && record.cRate ? (
                <li>
                  Average{" "}
                  <span className="text-orange font-semibold">{renderDmgValue(average)}</span> ={" "}
                  {nonCritDmg} <Green>*</Green> (<Green>1 +</Green> Crit DMG <Green>{cDmg}</Green>
                  {renderDmgComponent({
                    desc: "Crit Rate",
                    value: record.cRate,
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

function renderTalentBuff(talentBuff: TalentBuff = {}) {
  const entries = Object.entries(talentBuff);

  if (!entries.length) {
    return null;
  }

  return (
    <li>
      <p className="text-lightgold">Exclusive</p>
      {entries.map(([key, record], i) => {
        return (
          <p key={i} className="list-disc">
            + {keyMap[key as keyof typeof keyMap]}: {record.desc}{" "}
            <Green>
              {record.value}
              {percentSign(key)}
            </Green>
          </p>
        );
      })}
    </li>
  );
}
