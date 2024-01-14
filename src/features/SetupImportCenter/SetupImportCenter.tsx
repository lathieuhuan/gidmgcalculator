import { useEffect, useState } from "react";
import isEqual from "react-fast-compare";

import type { PartiallyRequired, SetupImportInfo } from "@Src/types";
import { EScreen, MAX_CALC_SETUPS } from "@Src/constants";
import { removeEmpty } from "@Src/utils";
import { notification } from "@Src/utils/notification";

// Store
import { useDispatch, useSelector } from "@Store/hooks";
import { selectChar, selectSetupManageInfos, selectTarget } from "@Store/calculatorSlice/selectors";
// Action
import { updateSetupImportInfo, updateUI } from "@Store/uiSlice";
import { importSetup } from "@Store/calculatorSlice";
import { checkBeforeInitNewSession } from "@Store/thunks";

// Component
import { Modal, ConfirmModal, LoadingIcon } from "@Src/pure-components";
import { OverrideOptions } from "./OverwriteOptions";

type SetupImportCenterProps = PartiallyRequired<SetupImportInfo, "calcSetup" | "target">;

const SetupImportCenterCore = ({ calcSetup, target, ...manageInfo }: SetupImportCenterProps) => {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const currentTarget = useSelector(selectTarget);
  const calcSetupInfos = useSelector(selectSetupManageInfos);
  // 0: initial | 1: different imported vs current | 2: reach MAX_CALC_SETUPS
  // 30: different char only | 31: different target only | 301: different both
  // 4: already existed
  const [pendingCode, setPendingCode] = useState(0);

  const endImport = () => {
    dispatch(updateSetupImportInfo({}));
    dispatch(updateUI({ highManagerActive: false }));
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
        highManagerActive: false,
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
            dispatch(updateSetupImportInfo({}));

            dispatch(
              updateUI({
                atScreen: EScreen.CALCULATOR,
                highManagerActive: false,
              })
            );

            if (manageInfo.importRoute === "url") {
              notification.success({
                content: "Successfully import the setup!",
                duration: 0,
              });
            }
          },
        }
      )
    );
  };

  useEffect(() => {
    const delayExecute = (fn: Function) => setTimeout(fn, 0);

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
          <LoadingIcon size="large" />
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
              : `The number of Setups on Calculator has reach the limit of ${MAX_CALC_SETUPS}.`) +
            " Start a new session?"
          }
          focusConfirm
          onConfirm={startNewSession}
          onClose={endImport}
        />
      );
    case 4:
      return <ConfirmModal active message="This setup is already in the Calculator." onlyConfirm onClose={endImport} />;
    default:
      return (
        <Modal active className="small-modal" onClose={endImport}>
          <OverrideOptions
            pendingCode={pendingCode}
            importedChar={calcSetup?.char}
            importedTarget={target}
            addImportedSetup={addImportedSetup}
            onCancel={() => {
              dispatch(updateSetupImportInfo({}));
            }}
          />
        </Modal>
      );
  }
};

export function SetupImportCenter() {
  const { calcSetup, target, ...rest } = useSelector((state) => state.ui.importInfo);
  return calcSetup && target ? <SetupImportCenterCore calcSetup={calcSetup} target={target} {...rest} /> : null;
}
