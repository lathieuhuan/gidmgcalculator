import cn from "classnames";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { CharInfo, DamageResult, Party } from "@Src/types";

import { EStatDamageKey } from "@Src/constants";
import { displayValue, getKeys } from "./utils";

import { CollapseSpace } from "@Components/collapse";
import { tableStyles } from "@Src/styled-components";
import { CompareTable } from "./CompareTable";
import { finalTalentLv } from "@Src/utils";
import { getPartyData } from "@Data/controllers";
import { useTranslation } from "@Hooks/useTranslation";

interface DamageDisplayProps {
  char: CharInfo;
  party: Party;
  damageResult: DamageResult;
  focus?: EStatDamageKey;
}
export function DamageDisplay({ char, party, damageResult, focus }: DamageDisplayProps) {
  const { t } = useTranslation();

  const [closedItems, setClosedItems] = useState<boolean[]>([]);
  const tableKeys = getKeys(char.name);

  if (char.name === "Nilou") {
    tableKeys[tableKeys.length - 1].subs.unshift("bountifulCore" as any);
  }

  const toggle = (index: number) => {
    setClosedItems((prev) => {
      const newC = [...prev];
      newC[index] = !newC[index];
      return newC;
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      {tableKeys.map((key, index) => {
        const standardValues = damageResult[key.main];
        const withDamage = key.subs.length !== 0;
        const isReactionDmg = key.main === "RXN";
        const talentLevel = !isReactionDmg ? finalTalentLv(char, key.main, getPartyData(party)) : 0;

        return (
          <div key={key.main} className="flex flex-col">
            <button
              className="mx-auto mb-2 pt-1 pb-0.5 px-4 flex items-center rounded-2xl bg-orange text-black font-bold"
              onClick={() => toggle(index)}
            >
              <span className="text-lg leading-none">{t(key.main)}</span>
              {talentLevel ? (
                <span className="ml-2 mb-0.5 px-1 py-0.5 rounded-sm bg-black/60 text-default text-sm leading-none">
                  {talentLevel}
                </span>
              ) : null}
              <FaChevronDown
                className={cn(
                  "ml-2 text-subtitle-1 text-black duration-150 ease-linear",
                  closedItems[index] ? "rotate-90" : ""
                )}
              />
            </button>

            <CollapseSpace active={!closedItems[index]}>
              {withDamage ? (
                <div className="custom-scrollbar">
                  <table className={cn("mb-2 w-full", tableStyles.table)}>
                    <colgroup>
                      <col className="w-34" />
                      <col />
                      <col />
                      <col />
                    </colgroup>
                    {focus ? (
                      <CompareTable focus={focus} tableKey={key} />
                    ) : (
                      <tbody>
                        <tr className={tableStyles.row}>
                          <th className={tableStyles.th} />
                          <th className={tableStyles.th}>Non-crit</th>
                          <th className={tableStyles.th}>Crit</th>
                          <th className={cn("text-lightgold", tableStyles.th)}>Avg.</th>
                        </tr>

                        {key.subs.map((subKey, i) => {
                          const { nonCrit, crit, average } = standardValues[subKey] || {};

                          return nonCrit === undefined ? null : (
                            <tr key={subKey} className={tableStyles.row}>
                              <td className={tableStyles.td}>
                                {isReactionDmg ? t(subKey) : subKey}
                              </td>
                              <td className={tableStyles.td}>{displayValue(nonCrit)}</td>
                              <td className={tableStyles.td}>{displayValue(crit)}</td>
                              <td className={cn("text-lightgold", tableStyles.td)}>
                                {displayValue(average)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table>
                </div>
              ) : (
                <div className="mb-2 pt-2 pb-1 flex-center bg-darkblue-2">
                  <p>This talent does not deal damage.</p>
                </div>
              )}
            </CollapseSpace>
          </div>
        );
      })}
    </div>
  );
}
