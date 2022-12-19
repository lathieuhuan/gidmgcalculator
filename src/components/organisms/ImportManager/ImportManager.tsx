import { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import type { CalcSetup } from "@Src/types";
import type { ImportInfo } from "@Store/uiSlice/types";

// Constant
import { EScreen } from "@Src/constants";

// Util
import { restoreCalcSetup } from "@Src/utils/setup";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Selector
import { selectChar } from "@Store/calculatorSlice/selectors";

// Action
import { updateImportInfo, updateUI } from "@Store/uiSlice";
import { importSetup, initSessionWithSetup } from "@Store/calculatorSlice";

// Component
import { ConfirmModalBody, Modal } from "@Components/molecules";
import { OverrideOptions } from "./OverwriteOptions";

function Importing({ type, data }: Required<ImportInfo>) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const target = useSelector((state) => state.calculator.target);
  const { myChars, myWps, myArts, mySetups } = useSelector((state) => state.database);

  const [pendingCode, setPendingCode] = useState(0);

  let importedSetup: CalcSetup;

  switch (type) {
    case "EDIT_SETUP":
      importedSetup = {
        ...data,
        ...restoreCalcSetup(data),
      };
      break;
    case "IMPORT_OUTSIDE":
      importedSetup = data;
      break;
    default:
      // #to-check
      // importedSetup = createTmSetup(data, myChars, myWps, myArts);
      importedSetup = data;
  }

  const endImport = () => {
    dispatch(updateImportInfo({ type: "" }));
    setPendingCode(0);
  };

  const addImportedSetup = (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => {
    dispatch(importSetup({ data: importedSetup, shouldOverwriteChar, shouldOverwriteTarget }));
    dispatch(
      updateUI({
        atScreen: EScreen.CALCULATOR,
        settingsOn: false,
      })
    );
    endImport();
  };

  const startNewSession = () => {
    dispatch(initSessionWithSetup(importedSetup));
    dispatch(updateUI({ atScreen: EScreen.CALCULATOR }));
    endImport();
  };

  useEffect(() => {
    const delayExecute = (fn: Function) => setTimeout(fn, 100);

    if (char) {
      if (char.name === importedSetup.char.name) {
        if (mySetups.length === 4) {
          delayExecute(() => setPendingCode(2));
        } else {
          const sameChar = isEqual(char, importedSetup.char);
          const sameTarget = isEqual(target, importedSetup.target);

          if (sameChar && sameTarget) {
            delayExecute(() => addImportedSetup(false, false));
          } else {
            let code = 3;

            if (!sameChar) {
              code = code * 10;
            }
            if (!sameTarget) {
              code = code * 10 + 1;
            }
            setPendingCode(code);
          }
        }
      } else {
        delayExecute(() => setPendingCode(1));
      }
    } else {
      delayExecute(startNewSession);
    }
  }, []);

  switch (pendingCode) {
    case 0:
      return null;
    case 1:
    case 2:
      return (
        <ConfirmModalBody
          message={
            (pendingCode === 1
              ? "We're calculating another Character."
              : "The number of Setups on Calculator has reach the limit of 4.") +
            " Start a new session?"
          }
          buttons={[undefined, { onClick: startNewSession }]}
          onClose={endImport}
        />
      );
    default:
      return (
        <OverrideOptions
          pendingCode={pendingCode}
          importedSetup={importedSetup}
          addImportedSetup={addImportedSetup}
          endImport={endImport}
        />
      );
  }
}

export function ImportManager() {
  const dispatch = useDispatch();
  const { type, data } = useSelector((state) => state.ui.importInfo);

  const onClose = () => {
    dispatch(updateImportInfo({ type: "" }));
  };

  return (
    <Modal active={!!type && !!data} className="small-modal" onClose={onClose}>
      <Importing type={type} data={data!} />
    </Modal>
  );
}
