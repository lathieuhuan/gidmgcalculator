import clsx from "clsx";
import { FaLongArrowAltUp } from "react-icons/fa";

import type { CalculationAspect } from "@Src/types";
import { selectComparedIds, selectStandardId, selectSetupManageInfos } from "@Store/calculatorSlice/selectors";
import { useSelector } from "@Store/hooks";
import { findById } from "@Src/utils";
import { displayValue, type TableKey } from "./utils";

// Component
import { Table } from "@Src/pure-components";

const { Tr, Th, Td } = Table;

interface FinalResultCompareProps {
  focusedAspect: CalculationAspect;
  tableKey: TableKey;
}
export const FinalResultCompare = ({ focusedAspect, tableKey }: FinalResultCompareProps) => {
  const setupManageInfos = useSelector(selectSetupManageInfos);
  const resultById = useSelector((state) => state.calculator.resultById);
  const comparedIds = useSelector(selectComparedIds);
  const standardId = useSelector(selectStandardId);

  const title = findById(setupManageInfos, standardId)?.name ?? "Setup's name missing";
  const otherSetupIds = comparedIds.filter((id) => id !== standardId);

  return (
    <tbody>
      <Tr>
        <Th />
        <Th>{title}</Th>

        {otherSetupIds.map((id) => (
          <Th key={id}>{findById(setupManageInfos, id)?.name}</Th>
        ))}
      </Tr>

      {tableKey.subs.map((name, i) => {
        const standardValue = resultById[standardId].finalResult[tableKey.main][name][focusedAspect];
        const standardIsArray = Array.isArray(standardValue);

        return (
          <Tr key={i}>
            <Td>{name}</Td>
            <Td>{displayValue(standardValue)}</Td>

            {otherSetupIds.map((setupId, j) => {
              const thisValue = resultById[setupId].finalResult[tableKey.main][name][focusedAspect];
              const thisIsArray = Array.isArray(thisValue);
              let diff = 0;

              if (thisIsArray && standardIsArray) {
                diff = thisValue[0] && standardValue[0] ? thisValue[0] - standardValue[0] : 0;
              } else if (!thisIsArray && !standardIsArray) {
                diff = thisValue && standardValue ? thisValue - standardValue : 0;
              }

              const percenttDiff =
                Math.round((Math.abs(diff) * 1000) / (standardIsArray ? standardValue[0] : standardValue)) / 10;

              return (
                <Td
                  key={j}
                  className={"relative group" + (diff ? " pr-5" : "")}
                  style={{ minWidth: diff ? "5rem" : "auto" }}
                >
                  {displayValue(thisValue)}

                  {diff ? (
                    <>
                      <FaLongArrowAltUp
                        className={clsx(
                          "absolute top-1/2 right-1.5 -translate-y-1/2",
                          diff > 0 ? "text-green-300" : "text-red-200 rotate-180"
                        )}
                      />
                      <span
                        className={clsx(
                          "absolute bottom-1/2 right-5 z-10 mb-2.5 pt-1 px-2 pb-0.5 rounded font-bold bg-black shadow-white-glow hidden group-hover:block",
                          diff > 0 ? "text-green-300" : "text-red-200"
                        )}
                      >
                        {(diff > 0 ? "+" : "-") + percenttDiff + "%"}
                      </span>
                    </>
                  ) : null}
                </Td>
              );
            })}
          </Tr>
        );
      })}
    </tbody>
  );
};
