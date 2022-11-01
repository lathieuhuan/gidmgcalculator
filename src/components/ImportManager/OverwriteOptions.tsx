import cn from "classnames";
import { useState } from "react";
import type { UsersSetup } from "@Src/types";

import { useSelector } from "@Store/hooks";
import {
  selectCalcConfigs,
  selectCalcSetupsById,
  selectActiveId,
  selectTarget,
} from "@Store/calculatorSlice/selectors";

import { tableStyles } from "@Src/styled-components";
import { ButtonBar, SeeDetails } from "@Components/minors";
import { CollapseSpace } from "@Components/collapse";

interface OverrideOptions {
  pendingCode: number;
  importedSetup?: UsersSetup;
  addImportedSetup: (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => void;
  endImport: () => void;
}
export function OverrideOptions({
  pendingCode,
  importedSetup,
  addImportedSetup,
  endImport,
}: OverrideOptions) {
  const setupsById = useSelector(selectCalcSetupsById);
  const activeId = useSelector(selectActiveId);
  const target = useSelector(selectTarget);
  const { separateCharInfo } = useSelector(selectCalcConfigs);

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

  if (separateCharInfo) {
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
        <p className="text-h5 text-center">
          We detect difference(s) between the Calculator and this Setup. Choose what you want to
          overwrite.
        </p>
        <div>
          {["Character's Info.", "Target's Info."].map((text, i) => {
            if (pendingCode >= 300 || pendingCode % 10 === i) {
              const object1: any = i ? target : comparedChar;
              const object2: any = i ? importedSetup?.target : importedSetup?.char;

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
                      <span className="ml-4 text-h6">{text}</span>
                    </label>
                    <SeeDetails
                      className="ml-2 text-h6"
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
                              <th className={cn("text-lightgold", tableStyles.th)}>Old</th>
                              <th className={cn("text-lightgold", tableStyles.th)}>New</th>
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
                                      {object1[type].length > 1
                                        ? `[${object1[type].join(", ")}]`
                                        : object1[type][0]}
                                    </td>
                                    <td className={tableStyles.td}>{object2?.[type]}</td>
                                  </>
                                );
                              }

                              return (
                                <tr key={i} className={tableStyles.row}>
                                  <td
                                    className={cn(
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
        texts={["Cancel", "Confirm"]}
        handlers={[endImport, onConfirm]}
      />
    </div>
  );
}
