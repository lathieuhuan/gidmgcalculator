import { useState } from "react";

import type { CharInfo, Target } from "@Src/types";
import { $AppSettings } from "@Src/services";
import { selectCalcSetupsById, selectActiveId, selectTarget } from "@Store/calculatorSlice/selectors";

// Hook
import { useSelector } from "@Store/hooks";
import { useTranslation } from "@Src/pure-hooks";

// Component
import { ButtonGroup, Table, CollapseSpace } from "@Src/pure-components";

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

  if ($AppSettings.get().charInfoIsSeparated) {
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

  return (
    <div className="p-4 bg-dark-500 relative">
      <div className="py-2">
        <p className="text-xl text-center">
          We detect difference(s) between the Calculator and this Setup. Choose what you want to overwrite.
        </p>
        <div>
          {["Character's Info.", "Target's Info."].map((title, i) => {
            if (pendingCode >= 300 || pendingCode % 10 === i) {
              const object1: any = i ? { level: target?.level, ...target?.resistances } : comparedChar;
              const object2: any = i ? { level: importedTarget?.level, ...importedTarget?.resistances } : importedChar;

              return (
                <div key={i} className={expandedIndex ? "mt-4" : "mt-2"}>
                  <div className="px-8 flex align-center">
                    <label>
                      <input
                        type="checkbox"
                        className="scale-150"
                        checked={ticked[i]}
                        onChange={onChangeTickedOption(i)}
                      />
                      <span className="ml-4 text-lg">{title}</span>
                    </label>

                    <span
                      className={
                        "cursor-pointer ml-2 text-lg " +
                        (expandedIndex === i ? "text-green-300 " : "text-light-400 hover:text-yellow-400 ")
                      }
                      onClick={onClickSeeDetails(i)}
                    >
                      See details
                    </span>
                  </div>

                  <CollapseSpace active={expandedIndex === i}>
                    <div className="flex justify-center">
                      <div style={{ maxWidth: "18rem" }}>
                        <Table>
                          <tbody>
                            <Tr>
                              <Th />
                              <Th className="text-yellow-400">Old</Th>
                              <Th className="text-yellow-400">New</Th>
                            </Tr>

                            {Object.keys(object1).map((type, k) => {
                              let comparedCols;

                              if (type === "name") {
                                comparedCols = (
                                  <Td colSpan={2} style={{ textAlign: "center" }}>
                                    {comparedChar.name}
                                  </Td>
                                );
                              } else {
                                comparedCols = (
                                  <>
                                    <Td>
                                      {object1[type]?.length > 1 ? `[${object1[type].join(", ")}]` : object1[type]}
                                    </Td>
                                    <Td>{object2?.[type]}</Td>
                                  </>
                                );
                              }

                              return (
                                <Tr key={k}>
                                  <Td
                                    className={
                                      "capitalize" + (object1[type] !== object2?.[type] ? " text-red-100" : "")
                                    }
                                  >
                                    {t(type, { ns: i ? "resistance" : "common" })}
                                  </Td>
                                  {comparedCols}
                                </Tr>
                              );
                            })}
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
      <ButtonGroup.Confirm
        className={expandedIndex === pendingCode % 10 ? "mt-2" : "mt-4"}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </div>
  );
}
