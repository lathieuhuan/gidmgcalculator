import cn from "classnames";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

import type { DamageResult } from "@Src/types";
import { CollapseSpace } from "@Components/collapse";
import { tableStyles } from "@Src/styled-components";
import { displayValue, getKeys } from "./utils";

interface DamageDisplayProps {
  charName: string;
  damageResult: DamageResult;
  tableBody?: JSX.Element;
}
export function DamageDisplay({ charName, damageResult, tableBody }: DamageDisplayProps) {
  const [closedItems, setClosedItems] = useState<boolean[]>([]);
  const tableKeys = getKeys(charName);

  const toggle = (index: number) => {
    setClosedItems((prev) => {
      const newC = [...prev];
      newC[index] = !newC[index];
      return newC;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {tableKeys.map((key, index) => {
        const standardValues = damageResult[key.main];

        return (
          <div key={key.main} className="flex flex-col">
            <button
              className="mx-auto px-4 mb-2 flex items-center rounded-2xl bg-orange"
              onClick={() => toggle(index)}
            >
              <p className="text-h5 font-bold text-black">{key.main}</p>
              <FaChevronDown
                className={cn(
                  "ml-2 text-subtitle-1 text-black duration-150 ease-linear",
                  closedItems[index] && "rotate-90"
                )}
              />
            </button>
            <CollapseSpace active={!closedItems[index]}>
              <div className="custom-scrollbar">
                <table className={cn("mb-2 w-full", tableStyles)}>
                  <colgroup>
                    <col className="w-34" />
                    <col />
                    <col />
                    <col />
                  </colgroup>
                  {tableBody || (
                    <tbody>
                      <tr className={tableStyles.row}>
                        <th className={tableStyles.th} />
                        <th className={tableStyles.th}>Non-crit</th>
                        <th className={tableStyles.th}>Crit</th>
                        <th className={cn("text-lightgold", tableStyles.th)}>Avg.</th>
                      </tr>
                      {key.subs.map((subKey, i) => {
                        const { nonCrit, crit, average } = standardValues[subKey] || {};
                        return (
                          <tr key={subKey} className={tableStyles.row}>
                            <td className={tableStyles.td}>{subKey}</td>
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
            </CollapseSpace>
          </div>
        );
      })}
    </div>
  );
}