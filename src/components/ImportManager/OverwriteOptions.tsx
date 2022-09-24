import cn from "classnames";
import { useState } from "react";
import type { UsersSetup } from "@Src/types";

import { useSelector } from "@Store/hooks";
import {
  selectCalcConfigs,
  selectCalcSetups,
  selectCurrentIndex,
  selectTarget,
} from "@Store/calculatorSlice/selectors";

import { Checkbox, tableStyles } from "@Src/styled-components";
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
  const setups = useSelector(selectCalcSetups);
  const currentIndex = useSelector(selectCurrentIndex);
  const target = useSelector(selectTarget);
  const { separateCharInfo } = useSelector(selectCalcConfigs);

  const [ticked, setTicked] = useState([false, false]);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const { char } = setups[currentIndex];
  const comparedChar = {
    name: char.name,
    level: separateCharInfo ? setups.map((setup) => setup.char.level) : char.level,
    NAs: separateCharInfo ? setups.map((setup) => setup.char.NAs) : char.NAs,
    ES: separateCharInfo ? setups.map((setup) => setup.char.ES) : char.ES,
    EB: separateCharInfo ? setups.map((setup) => setup.char.EB) : char.EB,
    cons: separateCharInfo ? setups.map((setup) => setup.char.cons) : char.cons,
  };

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
                      <Checkbox checked={ticked[i]} onChange={onChangeTickedOption(i)} />
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
                                      {Array.isArray(object1[type])
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
