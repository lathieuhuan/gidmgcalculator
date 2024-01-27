import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

import type { CharInfo, Target } from "@Src/types";
import { $AppSettings } from "@Src/services";
import { selectCalcSetupsById, selectActiveId, selectTarget } from "@Store/calculatorSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/pure-hooks";

// Component
import { Table, CollapseSpace, Modal } from "@Src/pure-components";

const { Tr, Th, Td } = Table;

interface OverrideOptions {
  pendingCode: number;
  importedChar: CharInfo;
  importedTarget: Target;
  addImportedSetup: (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => void;
  onCancel: () => void;
}
export function OverrideOptions({
  pendingCode,
  importedChar,
  importedTarget,
  addImportedSetup,
  onCancel,
}: OverrideOptions) {
  const { t } = useTranslation();
  const setupsById = useSelector(selectCalcSetupsById);
  const activeId = useSelector(selectActiveId);
  const target = useSelector(selectTarget);

  const [ticked, setTicked] = useState([false, false]);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const { char } = setupsById[activeId];
  const comparedChar = {
    name: char.name,
    level: [char.level],
    NAs: [char.NAs],
    ES: [char.ES],
    EB: [char.EB],
    cons: [char.cons],
  };

  if ($AppSettings.get("charInfoIsSeparated")) {
    comparedChar.level = Object.values(setupsById).map(({ char }) => char.level);
    comparedChar.NAs = Object.values(setupsById).map(({ char }) => char.NAs);
    comparedChar.ES = Object.values(setupsById).map(({ char }) => char.ES);
    comparedChar.EB = Object.values(setupsById).map(({ char }) => char.EB);
    comparedChar.cons = Object.values(setupsById).map(({ char }) => char.cons);
  }

  const onChangeTickedOption = (i: number) => () => {
    setTicked((prev) => {
      const result = [...prev];
      result[i] = !result[i];
      return result;
    });
  };

  const onClickSeeDetails = (i: number) => () => {
    setExpandedIndex(expandedIndex === i ? -1 : i);
  };

  const onConfirm = () => {
    addImportedSetup(ticked[0], ticked[1]);
  };

  const renderRow = (object1: any, object2: any, ns: "resistance" | "common") => (type: string) => {
    const value1 =
      object1?.[type] === undefined
        ? null
        : Array.isArray(object1[type]) && object1[type].length > 1
        ? `[${object1[type].join(", ")}]`
        : `${object1[type]}`;

    const value2 = object2?.[type] === undefined ? null : `${object2[type]}`;

    return (
      <Tr key={type}>
        <Td className={"capitalize" + (value1 !== value2 ? " text-red-100" : "")}>{t(type, { ns })}</Td>
        {type === "name" ? (
          <Td colSpan={2} style={{ textAlign: "center" }}>
            {comparedChar.name}
          </Td>
        ) : (
          <>
            <Td>{value1}</Td>
            <Td>{value2}</Td>
          </>
        )}
      </Tr>
    );
  };

  return (
    <div>
      <div className="pb-2">
        <p className="text-base">
          We detect difference(s) between the Calculator and this Setup. Choose what you want to overwrite.
        </p>
        <div>
          {["Character's Info.", "Target's Info."].map((title, i) => {
            if (pendingCode >= 300 || pendingCode % 10 === i) {
              const object1: any = i ? { level: target?.level, ...target?.resistances } : comparedChar;
              const object2: any = i ? { level: importedTarget?.level, ...importedTarget?.resistances } : importedChar;
              const expanded = expandedIndex === i;

              return (
                <div key={i} className={expandedIndex ? "mt-4" : "mt-2"}>
                  <div className="px-4 flex justify-between items-center">
                    <label className="mr-4 flex items-center">
                      <input
                        type="checkbox"
                        className="scale-150"
                        checked={ticked[i]}
                        onChange={onChangeTickedOption(i)}
                      />
                      <span className="ml-2">{title}</span>
                    </label>

                    <div className="flex items-center">
                      <FaChevronRight className={"text-xs" + (expanded ? " rotate-90" : "")} />
                      <span
                        className={
                          "ml-1 text-sm cursor-pointer " +
                          (expanded ? "text-green-300 " : "text-light-400 hover:text-yellow-400 ")
                        }
                        onClick={onClickSeeDetails(i)}
                      >
                        See details
                      </span>
                    </div>
                  </div>

                  <CollapseSpace active={expandedIndex === i}>
                    <div className="pt-2 flex justify-center">
                      <div style={{ maxWidth: "18rem" }}>
                        <Table>
                          <tbody>
                            <Tr>
                              <Th />
                              <Th className="text-yellow-400">Old</Th>
                              <Th className="text-yellow-400">New</Th>
                            </Tr>

                            {Object.keys(object1).map(renderRow(object1, object2, i ? "resistance" : "common"))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </CollapseSpace>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      <Modal.Actions onCancel={onCancel} onConfirm={onConfirm} />
    </div>
  );
}
