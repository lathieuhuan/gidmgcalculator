import clsx from "clsx";
import { FaLongArrowAltUp } from "react-icons/fa";

// Constant
import { EStatDamageKey } from "@Src/constants";

// Selector
import {
  selectComparedIds,
  selectStandardId,
  selectSetupManageInfos,
} from "@Store/calculatorSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";

// Util
import { findById } from "@Src/utils";
import { displayValue, type TableKey } from "./utils";

// Component
import { tableStyles } from "@Components/atoms";

interface CompareTableProps {
  focus: EStatDamageKey;
  tableKey: TableKey;
}
export function CompareTable({ focus, tableKey: { main, subs } }: CompareTableProps) {
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const statsById = useSelector((state) => state.calculator.statsById);
  const comparedIds = useSelector(selectComparedIds);
  const standardId = useSelector(selectStandardId);

  const title = findById(setupManageInfos, standardId)?.name;
  const otherSetupIds = comparedIds.filter((id) => id !== standardId);

  return (
    <tbody>
      <tr className={tableStyles.row}>
        <th className={tableStyles.th} />
        <th className={tableStyles.th}>{title || "Setup's name missing"}</th>

        {otherSetupIds.map((id, i) => (
          <th key={id} className={tableStyles.th}>
            {findById(setupManageInfos, id)?.name}
          </th>
        ))}
      </tr>

      {subs.map((name, i) => {
        const standardValue = statsById[standardId].dmgResult[main][name][focus];
        const standardIsArray = Array.isArray(standardValue);

        return (
          <tr key={i} className={tableStyles.row}>
            <td className={tableStyles.td}>{name}</td>
            <td className={tableStyles.td}>{displayValue(standardValue)}</td>

            {otherSetupIds.map((id, j) => {
              const thisValue = statsById[id].dmgResult[main][name][focus];
              const thisIsArray = Array.isArray(thisValue);
              let diff = 0;

              if (thisIsArray && standardIsArray) {
                diff = thisValue[0] && standardValue[0] ? thisValue[0] - standardValue[0] : 0;
              } else if (!thisIsArray && !standardIsArray) {
                diff = thisValue && standardValue ? thisValue - standardValue : 0;
              }

              const percenttDiff =
                Math.round(
                  (Math.abs(diff) * 1000) / (standardIsArray ? standardValue[0] : standardValue)
                ) / 10;

              return (
                <td
                  key={j}
                  className={clsx("relative group", tableStyles.td, diff && "pr-5")}
                  style={{ minWidth: diff ? "5rem" : "auto" }}
                >
                  {displayValue(thisValue)}

                  {diff ? (
                    <>
                      <FaLongArrowAltUp
                        className={clsx(
                          "absolute top-1/2 right-1.5 -translate-y-1/2",
                          diff > 0 ? "text-green" : "text-red-400 rotate-180"
                        )}
                      />
                      <span
                        className={clsx(
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
