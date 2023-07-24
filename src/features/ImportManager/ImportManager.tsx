import { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import type { PartiallyRequired, SetupImportInfo } from "@Src/types";
import { EScreen, MAX_CALC_SETUPS } from "@Src/constants";
import { getSearchParam, removeEmpty } from "@Src/utils";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectChar, selectSetupManageInfos, selectTarget } from "@Store/calculatorSlice/selectors";
// Action
import { updateImportInfo, updateUI } from "@Store/uiSlice";
import { importSetup, updateMessage } from "@Store/calculatorSlice";
import { checkBeforeInitNewSession } from "@Store/thunks";

// Component
import { Modal, ConfirmModal } from "@Src/pure-components";
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
      checkBeforeInitNewSession(
        {
          ...manageInfo,
          calcSetup,
          target,
        },
        {
          onSuccess: () => {
            dispatch(updateImportInfo({}));

            dispatch(
              updateUI({
                atScreen: EScreen.CALCULATOR,
                highManagerWorking: false,
              })
            );

            if (getSearchParam("importCode")) {
              dispatch(
                updateMessage({
                  type: "success",
                  content: "Successfully import the setup!",
                })
              );

              window.history.replaceState(null, "", window.location.origin);
            }
          },
        }
      )
    );
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
          const sameTarget = isEqual(removeEmpty(currentTarget), removeEmpty(target));

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
      return (
        <Modal active closeOnMaskClick={false} onClose={() => {}}>
          <AiOutlineLoading3Quarters className="text-3.5xl animate-spin" />
        </Modal>
      );
    case 1:
    case 2:
      return (
        <ConfirmModal
          active
          message={
            (pendingCode === 1
              ? "We're calculating another Character."
              : "The number of Setups on Calculator has reach the limit of 4.") + " Start a new session?"
          }
          buttons={[undefined, { onClick: startNewSession }]}
          onClose={endImport}
        />
      );
    case 4:
      return (
        <ConfirmModal
          active
          message="This setup is already in the Calculator."
          buttons={[undefined]}
          onClose={endImport}
        />
      );
    default:
      return (
        <Modal active className="small-modal" onClose={endImport}>
          <OverrideOptions
            pendingCode={pendingCode}
            importedChar={calcSetup?.char}
            importedTarget={target}
            addImportedSetup={addImportedSetup}
            onCancel={() => {
              dispatch(updateImportInfo({}));
            }}
          />
        </Modal>
      );
  }
};

export function ImportManager() {
  const { calcSetup, target, ...rest } = useSelector((state) => state.ui.importInfo);
  return calcSetup && target ? <ImportManagerCore calcSetup={calcSetup} target={target} {...rest} /> : null;
}
