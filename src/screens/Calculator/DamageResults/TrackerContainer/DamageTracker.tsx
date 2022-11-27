import type { ReactNode } from "react";
import type { TrackerDamageRecord } from "@Calculators/types";
import type { CalculatedDamageCluster, TalentBuff } from "@Src/types";
import { Green } from "@Src/styled-components";
import { percentSign, round2, round3 } from "@Src/utils";
import { renderDmgComponent, renderDmgValue } from "./utils";
import { keyMap } from "./constants";

interface DamageTrackerProps {
  records?: Record<string, TrackerDamageRecord>;
  calcDmgResult: CalculatedDamageCluster;
  defMultDisplay: ReactNode;
}
export function DamageTracker({ records = {}, calcDmgResult, defMultDisplay }: DamageTrackerProps) {
  return (
    <div className="space-y-1">
      {defMultDisplay}

      {Object.entries(records).map(([attackName, record], i) => {
        const { nonCrit = 0, crit = 0, average = 0 } = calcDmgResult[attackName] || {};
        const nonCritDmg = renderDmgValue(nonCrit);
        const cDmg = round3(record.cDmg || 0);

        if (!nonCritDmg) {
          return null;
        }

        return (
          <div key={i}>
            <p className="font-medium">{attackName}</p>
            <ul className="pl-4 text-lesser text-sm leading-6 list-disc">
              {renderTalentBuff(record.talentBuff)}

              <li>
                Non-crit <span className="text-orange font-semibold">{nonCritDmg}</span>{" "}
                {record.finalMult ? (
                  <>
                    {" "}
                    = ({record.baseStatType.toUpperCase()} <Green>{record.baseValue}</Green>{" "}
                    <Green>*</Green> Talent Mult.{" "}
                    <Green>
                      {renderDmgValue(record.finalMult, (value) => round2(value) + "%")}
                    </Green>
                    {renderDmgComponent({
                      desc: "Flat Bonus",
                      value: record.finalFlat,
                      sign: "+",
                      processor: Math.round,
                    })}
                    )
                  </>
                ) : null}
                {renderDmgComponent({
                  desc: "Percent Mult.",
                  value: record.normalMult * 100,
                  processor: (value) => round2(value) + "%",
                })}
                {renderDmgComponent({
                  desc: "Special Mult.",
                  value: record.specialMult || 1,
                  nullValue: 1,
                  processor: round3,
                })}
                {renderDmgComponent({
                  desc: "Reaction Mult.",
                  value: record.rxnMult || 1,
                  nullValue: 1,
                  processor: round3,
                })}
                {renderDmgComponent({
                  desc: "DEF Mult.",
                  value: round3(record.defMult || 0),
                })}
                {renderDmgComponent({
                  desc: "RES Mult.",
                  value: record.resMult || 0,
                })}
                {record.note}
              </li>

              {crit ? (
                <li>
                  Crit <span className="text-orange font-semibold">{renderDmgValue(crit)}</span> ={" "}
                  {nonCritDmg} <Green>*</Green> (<Green>1 +</Green> Crit DMG <Green>{cDmg}</Green>)
                </li>
              ) : null}

              {average !== nonCrit && (
                <li>
                  Average{" "}
                  <span className="text-orange font-semibold">{renderDmgValue(average)}</span> ={" "}
                  {nonCritDmg} <Green>*</Green> (<Green>1 +</Green> Crit DMG <Green>{cDmg}</Green>{" "}
                  <Green>*</Green> Crit Rate <Green>{round3(record.cRate || 0)}</Green>)
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function renderTalentBuff(talentBuff: TalentBuff) {
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
