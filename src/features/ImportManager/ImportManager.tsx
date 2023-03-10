import { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import type { PartiallyRequired, SetupImportInfo } from "@Src/types";

// Constant
import { EScreen, MAX_CALC_SETUPS } from "@Src/constants";

// Hook
import { useDispatch, useSelector } from "@Store/hooks";

// Selector
import { selectChar, selectSetupManageInfos, selectTarget } from "@Store/calculatorSlice/selectors";

// Action
import { updateImportInfo, updateUI } from "@Store/uiSlice";
import { importSetup, initSessionWithSetup, updateMessage } from "@Store/calculatorSlice";

// Util
import { getSearchParam } from "@Src/utils";

// Component
import { ConfirmModalBody, Modal } from "@Components/molecules";
import { OverrideOptions } from "./OverwriteOptions";

type ImportManagerProps = PartiallyRequired<SetupImportInfo, "calcSetup" | "target">;

const ImportManagerCore = ({ calcSetup, target, ...manageInfo }: ImportManagerProps) => {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const currentTarget = useSelector(selectTarget);
  const calcSetupInfos = useSelector(selectSetupManageInfos);
  // 0: initial | 1: different imported vs current | 2: reach MAX_CALC_SETUPS
  // 30: different char only | 31: different target only | 301: different both
  // 4: already existed
  const [pendingCode, setPendingCode] = useState(0);

  const endImport = () => {
    dispatch(updateImportInfo({}));
    dispatch(updateUI({ highManagerWorking: false }));

    if (getSearchParam("importCode")) {
      window.history.replaceState(null, "", window.location.origin);
    }
  };

  const addImportedSetup = (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => {
    dispatch(
      importSetup({
        importInfo: {
          ...manageInfo,
          calcSetup,
          target,
        },
        shouldOverwriteChar,
        shouldOverwriteTarget,
      })
    );
    dispatch(
      updateUI({
        atScreen: EScreen.CALCULATOR,
        highManagerWorking: false,
      })
    );
    endImport();
  };

  const startNewSession = () => {
    dispatch(
      initSessionWithSetup({
        ...manageInfo,
        calcSetup,
        target,
      })
    );
    dispatch(updateUI({ atScreen: EScreen.CALCULATOR }));
    endImport();
  };

  useEffect(() => {
    const delayExecute = (fn: Function) => setTimeout(fn, 100);

    if (char) {
      if (char.name === calcSetup.char.name) {
        if (calcSetupInfos.length === MAX_CALC_SETUPS) {
          delayExecute(() => setPendingCode(2));
        } else if (manageInfo.ID && calcSetupInfos.some((info) => info.ID === manageInfo.ID)) {
          delayExecute(() => setPendingCode(4));
        } else {
          const sameChar = isEqual(char, calcSetup.char);
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

      if (getSearchParam("importCode")) {
        dispatch(
          updateMessage({
            type: "success",
            content: "Successfully import the setup!",
          })
        );
      }
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
          buttons={[undefined]}
          onClose={endImport}
        />
      );
    default:
      return (
        <OverrideOptions
          pendingCode={pendingCode}
          importedChar={calcSetup?.char}
          importedTarget={target}
          addImportedSetup={addImportedSetup}
          endImport={endImport}
        />
      );
  }
};

export function ImportManager() {
  const dispatch = useDispatch();
  const { calcSetup, target, ...rest } = useSelector((state) => state.ui.importInfo);

  const onClose = () => {
    dispatch(updateImportInfo({}));
  };

  return (
    <Modal active={Boolean(calcSetup && target)} className="small-modal" onClose={onClose}>
      <ImportManagerCore calcSetup={calcSetup!} target={target!} {...rest} />
    </Modal>
  );
}
