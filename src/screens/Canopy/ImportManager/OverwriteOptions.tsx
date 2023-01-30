import clsx from "clsx";
import { useState } from "react";
import type { CharInfo, Target } from "@Src/types";

// Hook
import { useSelector } from "@Store/hooks";

// Selector
import {
  selectCalcSetupsById,
  selectActiveId,
  selectTarget,
} from "@Store/calculatorSlice/selectors";

// Component
import { SeeDetails, CollapseSpace, tableStyles } from "@Components/atoms";
import { ButtonBar } from "@Components/molecules";
import { appSettings } from "@Src/utils";

interface OverrideOptions {
  pendingCode: number;
  importedChar: CharInfo;
  importedTarget: Target;
  addImportedSetup: (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => void;
  endImport: () => void;
}
export function OverrideOptions({
  pendingCode,
  importedChar,
  importedTarget,
  addImportedSetup,
  endImport,
}: OverrideOptions) {
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

  if (appSettings.get().charInfoIsSeparated) {
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
    <div className="p-4 bg-darkblue-3 relative">
      <div className="py-2">
        <p className="text-xl text-center">
          We detect difference(s) between the Calculator and this Setup. Choose what you want to
          overwrite.
        </p>
        <div>
          {["Character's Info.", "Target's Info."].map((text, i) => {
            if (pendingCode >= 300 || pendingCode % 10 === i) {
              const object1: any = i
                ? { level: target?.level, ...target?.resistances }
                : comparedChar;
              const object2: any = i
                ? { level: importedTarget?.level, ...importedTarget?.resistances }
                : importedChar;

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
                      <span className="ml-4 text-lg">{text}</span>
                    </label>
                    <SeeDetails
                      className="ml-2 text-lg"
                      active={expandedIndex === i}
                      onClick={onClickSeeDetails(i)}
                    />
                  </div>

                  <CollapseSpace active={expandedIndex === i}>
                    <div className="flex justify-center">
                      <div style={{ maxWidth: "18rem" }}>
                        <table className={tableStyles.table}>
                          <tbody>
                            <tr className={tableStyles.row}>
                              <th className={tableStyles.th} />
                              <th className={clsx("text-lightgold", tableStyles.th)}>Old</th>
                              <th className={clsx("text-lightgold", tableStyles.th)}>New</th>
                            </tr>

                            {Object.keys(object1).map((type, i) => {
                              let comparedCols;

                              if (type === "name") {
                                comparedCols = (
                                  <td
                                    className={tableStyles.td}
                                    colSpan={2}
                                    style={{ textAlign: "center" }}
                                  >
                                    {comparedChar.name}
                                  </td>
                                );
                              } else {
                                comparedCols = (
                                  <>
                                    <td className={tableStyles.td}>
                                      {object1[type]?.length > 1
                                        ? `[${object1[type].join(", ")}]`
                                        : object1[type]}
                                    </td>
                                    <td className={tableStyles.td}>{object2?.[type]}</td>
                                  </>
                                );
                              }

                              return (
                                <tr key={i} className={tableStyles.row}>
                                  <td
                                    className={clsx(
                                      "capitalize " + tableStyles.td,
                                      object1[type] !== object2?.[type] && "text-lightred"
                                    )}
                                  >
                                    {type}
                                  </td>
                                  {comparedCols}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
      <ButtonBar
        className={expandedIndex === pendingCode % 10 ? "mt-2" : "mt-4"}
        buttons={[
          { text: "Cancel", onClick: endImport },
          { text: "Confirm", onClick: onConfirm },
        ]}
      />
    </div>
  );
}
