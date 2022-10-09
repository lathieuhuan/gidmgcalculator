import { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import type { UsersSetup } from "@Src/types";
import type { ImportInfo } from "@Store/uiSlice/types";

import { EScreen } from "@Src/constants";
import { restoreCalcSetup } from "@Src/utils/setup";
import { useDispatch, useSelector } from "@Store/hooks";
import { importSetup, initSessionWithSetup } from "@Store/calculatorSlice";
import { selectChar } from "@Store/calculatorSlice/selectors";
import { changeScreen, resetCalculatorUI, toggleSettings, updateImportInfo } from "@Store/uiSlice";

import { Modal } from "@Components/modals";
import { ConfirmTemplate } from "@Components/minors";
import { OverrideOptions } from "./OverwriteOptions";

function Importing({ type, data }: Required<ImportInfo>) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const target = useSelector((state) => state.calculator.target);
  const { myChars, myWps, myArts, mySetups } = useSelector((state) => state.database);

  const [pendingCode, setPendingCode] = useState(0);

  let importedSetup: UsersSetup;

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
      // importedSetup = createTmSetup(data, myChars, myWps, myArts);
      importedSetup = data;
  }

  const endImport = () => {
    dispatch(updateImportInfo({ type: "" }));
    setPendingCode(0);
  };

  const addImportedSetup = (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => {
    dispatch(importSetup({ data: importedSetup, shouldOverwriteChar, shouldOverwriteTarget }));
    dispatch(changeScreen(EScreen.CALCULATOR));
    dispatch(toggleSettings(false));
    endImport();
  };

  const startNewSession = () => {
    dispatch(initSessionWithSetup(importedSetup));
    dispatch(resetCalculatorUI());
    endImport();
  };

  useEffect(() => {
    const execute = (fn: Function) => setTimeout(fn, 100);

    if (char) {
      if (char.name === importedSetup.char.name) {
        if (mySetups.length === 4) {
          execute(() => setPendingCode(2));
        } else {
          const sameChar = isEqual(char, importedSetup.char);
          const sameTarget = isEqual(target, importedSetup.target);

          if (sameChar && sameTarget) {
            execute(() => addImportedSetup(false, false));
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
        execute(() => setPendingCode(1));
      }
    } else {
      execute(startNewSession);
    }
  }, []);

  switch (pendingCode) {
    case 0:
      return null;
    case 1:
    case 2:
      return (
        <ConfirmTemplate
          message={
            (pendingCode === 1
              ? "We're calculating another Character."
              : "The number of Setups on Calculator has reach the limit of 4.") +
            " Start a new session?"
          }
          onClose={endImport}
          right={{ onClick: startNewSession }}
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
    <Modal active={!!type && !!data} isCustom className="custom-modal" onClose={onClose}>
      <Importing type={type} data={data!} />
    </Modal>
  );
}
