import { useEffect, useState, useMemo } from "react";
import isEqual from "react-fast-compare";
import type { PartiallyRequired, SetupImportInfo } from "@Src/types";

// Constant
import { EScreen, MAX_CALC_SETUPS } from "@Src/constants";

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
import { selectUserSetups } from "@Store/userDatabaseSlice/selectors";

type ImportingProps = PartiallyRequired<SetupImportInfo, "importType" | "calcSetup" | "target">;

function Importing({ importType, calcSetup, target, ...manageInfo }: ImportingProps) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const currentTarget = useSelector((state) => state.calculator.target);
  const userSetups = useSelector(selectUserSetups);
  // 0: initial | 1: different imported vs current | 2: reach MAX_CALC_SETUPS
  // 30: different char only | 31: different target only | 301: different both
  // 4: already existed
  const [pendingCode, setPendingCode] = useState(0);

  const importedSetup = useMemo(() => {
    switch (importType) {
      case "EDIT_SETUP":
        return {
          ...calcSetup,
          ...restoreCalcSetup(calcSetup),
        };
      case "IMPORT_OUTSIDE":
        return calcSetup;
      default:
        // #to-check
        // importedSetup = createTmSetup(data, userChars, userWps, userArts);
        return calcSetup;
    }
  }, []);

  const endImport = () => {
    dispatch(updateImportInfo({ importType: "" }));
  };

  const addImportedSetup = (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => {
    dispatch(
      importSetup({
        importInfo: {
          ...manageInfo,
          calcSetup: importedSetup,
          target,
        },
        shouldOverwriteChar,
        shouldOverwriteTarget,
      })
    );
    dispatch(
      updateUI({
        atScreen: EScreen.CALCULATOR,
        settingsOn: false,
      })
    );
    endImport();
  };

  const startNewSession = () => {
    dispatch(
      initSessionWithSetup({
        ...manageInfo,
        calcSetup: importedSetup,
        target,
      })
    );
    dispatch(updateUI({ atScreen: EScreen.CALCULATOR }));
    endImport();
  };

  useEffect(() => {
    const delayExecute = (fn: Function) => setTimeout(fn, 100);

    if (char) {
      if (char.name === importedSetup.char.name) {
        if (userSetups.length === MAX_CALC_SETUPS) {
          delayExecute(() => setPendingCode(2));
        } else if (
          manageInfo.ID &&
          userSetups.some((userSetups) => userSetups.ID === manageInfo.ID)
        ) {
          delayExecute(() => setPendingCode(4));
        } else {
          const sameChar = isEqual(char, importedSetup.char);
          const sameTarget = isEqual(currentTarget, target);

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
    case 4:
      return (
        <ConfirmModalBody
          message="This setup is already in the Calculator."
          buttons={[undefined, undefined]}
          onClose={endImport}
        />
      );
    default:
      return (
        <OverrideOptions
          pendingCode={pendingCode}
          importedChar={importedSetup.char}
          importedTarget={target}
          addImportedSetup={addImportedSetup}
          endImport={endImport}
        />
      );
  }
}

export function ImportManager() {
  const dispatch = useDispatch();
  const { importType, calcSetup, target, ...rest } = useSelector((state) => state.ui.importInfo);

  const onClose = () => {
    dispatch(updateImportInfo({ importType: "" }));
  };

  return (
    <Modal
      active={Boolean(importType && calcSetup && target)}
      className="small-modal"
      onClose={onClose}
    >
      <Importing importType={importType!} calcSetup={calcSetup!} target={target!} {...rest} />
    </Modal>
  );
}
