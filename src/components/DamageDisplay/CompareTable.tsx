import cn from "classnames";
import { FaLongArrowAltUp } from "react-icons/fa";
import { EStatDamageKey } from "@Src/constants";

import { selectComparedIndexes, selectStandardIndex } from "@Store/uiSlice";
import { selectSetupManageInfos } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";

import { tableStyles } from "@Src/styled-components";
import { displayValue, TableKey } from "./utils";

interface CompareTableProps {
  focus: EStatDamageKey;
  tableKey: TableKey;
}
export function CompareTable({ focus, tableKey: { main, subs } }: CompareTableProps) {
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const allDmgResult = useSelector((state) => state.calculator.allDmgResult);
  const comparedIndexes = useSelector(selectComparedIndexes);
  const standardIndex = useSelector(selectStandardIndex);
  const otherSetupIs = comparedIndexes.filter((i) => i !== standardIndex);

  return (
    <tbody>
      <tr className={tableStyles.row}>
        <th className={tableStyles.th} />
        <th className={tableStyles.th}>{setupManageInfos[standardIndex].name}</th>

        {otherSetupIs.map((index, i) => (
          <th key={i} className={tableStyles.th}>
            {setupManageInfos[index].name}
          </th>
        ))}
      </tr>

      {subs.map((name, i) => {
        const standardValue = allDmgResult[standardIndex][main][name][focus];
        const standardIsArray = Array.isArray(standardValue);

        return (
          <tr key={i} className={tableStyles.row}>
            <td className={tableStyles.td}>{name}</td>
            <td className={tableStyles.td}>{displayValue(standardValue)}</td>

            {otherSetupIs.map((index, j) => {
              const thisValue = allDmgResult[index][main][name][focus];
              const thisIsArray = Array.isArray(thisValue);
              let diff = 0;

              if (thisIsArray && standardIsArray) {
                diff = thisValue[0] - standardValue[0];
              } else if (!thisIsArray && !standardIsArray) {
                diff = thisValue - standardValue;
              }

              const percenttDiff =
                Math.round(
                  (Math.abs(diff) * 1000) / (standardIsArray ? standardValue[0] : standardValue)
                ) / 10;

              return (
                <td
                  key={j}
                  className={cn("relative group", tableStyles.td, diff && "pr-5")}
                  style={{ minWidth: diff ? "5rem" : "auto" }}
                >
                  {displayValue(thisValue)}

                  {diff ? (
                    <>
                      <FaLongArrowAltUp
                        className={cn(
                          "absolute top-1/2 right-1.5 -translate-y-1/2",
                          diff > 0 ? "text-green" : "text-red-400 rotate-180"
                        )}
                      />
                      <span
                        className={cn(
                          "absolute bottom-1/2 right-5 z-10 mb-2.5 pt-1 px-2 pb-0.5 rounded font-bold bg-black shadow-white-glow hidden group-hover:block",
                          diff > 0 ? "text-green" : "text-red-400"
                        )}
                      >
                        {(diff > 0 ? "+" : "-") + percenttDiff + "%"}
                      </span>
                    </>
                  ) : null}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
