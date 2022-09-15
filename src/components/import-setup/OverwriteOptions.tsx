import cn from "classnames";
import { useState } from "react";
import type { UsersSetup } from "@Src/types";

import { useSelector } from "@Store/hooks";
import { selectCalcConfigs, selectChar, selectTarget } from "@Store/calculatorSlice/selectors";

import { Checkbox, tableStyles } from "@Src/styled-components";
import { ButtonBar, SeeDetails } from "@Components/minors";
import { CollapseSpace } from "@Components/collapse";

interface OverrideOptions {
  pendingCode: number;
  importedSetup: UsersSetup;
  addImportedSetup: (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => void;
  endImport: () => void;
}
export function OverrideOptions({
  pendingCode,
  importedSetup,
  addImportedSetup,
  endImport,
}: OverrideOptions) {
  const char = useSelector(selectChar);
  const target = useSelector(selectTarget);
  const { separateCharInfo } = useSelector(selectCalcConfigs);

  const [ticked, setTicked] = useState([false, false]);
  const [expandedIndex, setExpandedIndex] = useState(-1);

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
    <div className="p-4 rounded-2xl bg-darkblue-3 relative" style={{ width: "22.5rem" }}>
      <div className="py-2">
        <p className="text-h5 text-center">
          We detect difference(s) between the Calculator and this Setup. Choose what you want to
          overwrite.
        </p>
        <div>
          {["Character's Info.", "Target's Info."].map((text, i) => {
            if (pendingCode >= 300 || pendingCode % 10 === i) {
              const object1: any = i ? target : char;
              const object2: any = i ? importedSetup.target : importedSetup.char;

              return (
                <div key={i} className={expandedIndex ? "mt-4" : "mt-2"}>
                  <div className="px-8 flex align-center">
                    <Checkbox checked={ticked[i]} onChange={onChangeTickedOption(i)} />
                    <p className="ml-4 text-h6">{text}</p>
                    <SeeDetails
                      className={cn("ml-2 text-h6", expandedIndex === i && "active")}
                      onClick={onClickSeeDetails(i)}
                    />
                  </div>
                  <CollapseSpace active={expandedIndex === i}>
                    <div className="pt-2 flex justify-center">
                      <div style={{ maxWidth: "18rem" }}>
                        <table className={tableStyles.table}>
                          <tbody>
                            <tr className={tableStyles.row}>
                              <th className={tableStyles.th} />
                              <th className={cn("text-lightgold", tableStyles.th)}>Old</th>
                              <th className={cn("text-lightgold", tableStyles.th)}>New</th>
                            </tr>
                            {Object.keys(object1).map((type, i) => (
                              <tr key={i}>
                                <td
                                  className={cn("capitalize", {
                                    warning: object1[type] !== object2[type],
                                  })}
                                >
                                  {type}
                                </td>
                                <td>
                                  {separateCharInfo
                                    ? `[${object1[type].join(", ")}]`
                                    : object2[type]}
                                </td>
                                <td>{object2[type]}</td>
                              </tr>
                            ))}
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
