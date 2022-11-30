import type { ReactNode } from "react";
import type { TrackerDamageRecord } from "@Calculators/types";
import type { CalculatedDamageCluster, TalentBuff } from "@Src/types";
import { Green } from "@Src/styled-components";
import { percentSign, round2, round3 } from "@Src/utils";
import { useTranslation } from "@Hooks/useTranslation";
import { renderDmgComponent, renderDmgValue } from "./utils";
import { keyMap } from "./constants";

interface DamageTrackerProps {
  records?: Record<string, TrackerDamageRecord>;
  calcDmgResult: CalculatedDamageCluster;
  defMultDisplay?: ReactNode;
}
export function DamageTracker({ records = {}, calcDmgResult, defMultDisplay }: DamageTrackerProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      {defMultDisplay}

      {Object.entries(records).map(([attackName, record], i) => {
        const { nonCrit = 0, crit = 0, average = 0 } = calcDmgResult[attackName] || {};

        if (!nonCrit) {
          return null;
        }

        const nonCritDmg = renderDmgValue(nonCrit);
        const cDmg = round3(record.cDmg || 0);

        return (
          <div key={i}>
            <p className="font-medium">{t(attackName)}</p>
            <ul className="pl-4 text-lesser text-sm leading-6 list-disc">
              {renderTalentBuff(record.talentBuff)}

              <li>
                Non-crit <span className="text-orange font-semibold">{nonCritDmg}</span> = (
                {record.baseStatType ? t(record.baseStatType) + " " : null}
                <Green>{record.baseValue}</Green>
                {record.talentMult ? (
                  <>
                    {" "}
                    <Green>*</Green> Talent Mult.{" "}
                    <Green>
                      {renderDmgValue(record.talentMult, (value) => round2(value) + "%")}
                    </Green>
                  </>
                ) : null}
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
                  processor: (value) => round2(value * 100) + "%",
                })}
                {renderDmgComponent({
                  desc: "Special Mult.",
                  value: record.specialMult,
                  nullValue: 1,
                  processor: round3,
                })}
                {renderDmgComponent({
                  desc: "Reaction Mult.",
                  value: record.rxnMult,
                  nullValue: 1,
                  processor: round3,
                })}
                {renderDmgComponent({
                  desc: "DEF Mult.",
                  value: record.defMult,
                  processor: round3,
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
                    processor: round3,
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
