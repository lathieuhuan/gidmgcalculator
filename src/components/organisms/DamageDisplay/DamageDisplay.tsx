import { useState, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { CharInfo, DamageResult, Party } from "@Src/types";

// Consant
import { EStatDamageKey } from "@Src/constants";

// Hook
import { useTranslation } from "@Src/hooks";

// Util
import { finalTalentLv } from "@Src/utils";
import { getPartyData } from "@Data/controllers";
import { displayValue, getTableKeys } from "./utils";

// Component
import { CollapseSpace, tableStyles } from "@Components/atoms";
import { CompareTable } from "./CompareTable";

interface DamageDisplayProps {
  char: CharInfo;
  party: Party;
  damageResult: DamageResult;
  focus?: EStatDamageKey;
}
export function DamageDisplay({ char, party, damageResult, focus }: DamageDisplayProps) {
  const { t } = useTranslation();

  const [closedItems, setClosedItems] = useState<boolean[]>([]);
  const tableKeys = useMemo(() => getTableKeys(char.name), [char.name]);

  const toggleTable = (index: number) => () => {
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
        const isReactionDmg = key.main === "RXN";
        const talentLevel = !isReactionDmg ? finalTalentLv(char, key.main, getPartyData(party)) : 0;

        return (
          <div key={key.main} className="flex flex-col">
            <button
              className="mx-auto mb-2 pt-1 pb-0.5 px-4 flex items-center rounded-2xl bg-orange text-black font-bold"
              onClick={toggleTable(index)}
            >
              <span className="text-lg leading-none">{t(key.main)}</span>
              {talentLevel ? (
                <span className="ml-2 mb-0.5 px-1 py-0.5 rounded-sm bg-black/60 text-default text-sm leading-none">
                  {talentLevel}
                </span>
              ) : null}
              <FaChevronDown
                className={
                  "ml-2 text-sm text-black duration-150 ease-linear" +
                  (closedItems[index] ? " rotate-90" : "")
                }
              />
            </button>

            <CollapseSpace active={!closedItems[index]}>
              {key.subs.length === 0 ? (
                <div className="pb-2">
                  <p className="pt-2 pb-1 bg-darkblue-2 text-center text-lesser">
                    This talent does not deal damage.
                  </p>
                </div>
              ) : (
                <div className="custom-scrollbar">
                  <table className={"mb-2 w-full " + tableStyles.table}>
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
                          <th className={"text-lightgold " + tableStyles.th}>Avg.</th>
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
                              <td className={tableStyles.td + " text-lightgold"}>
                                {displayValue(average)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table>
                </div>
              )}
            </CollapseSpace>
          </div>
        );
      })}
    </div>
  );
}
