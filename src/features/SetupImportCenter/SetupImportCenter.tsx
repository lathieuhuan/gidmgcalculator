import { useEffect, useRef, useState } from "react";
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
import { Modal, ConfirmModal, LoadingMask } from "@Src/pure-components";
import { OverwriteOptions, OverwriteOptionsProps } from "./OverwriteOptions";

type SetupImportCenterProps = PartiallyRequired<SetupImportInfo, "calcSetup" | "target">;

const SetupImportCenterCore = ({ calcSetup, target, ...manageInfo }: SetupImportCenterProps) => {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const currentTarget = useSelector(selectTarget);
  const calcSetupInfos = useSelector(selectSetupManageInfos);

  const [pendingCode, setPendingCode] = useState(0);
  const overwriteToAsk = useRef({
    character: false,
    target: true,
  });

  useEffect(() => {
    const delayExecute = (fn: Function) => setTimeout(fn, 0);

    // Start of site, no setup in Calculator yet
    if (!char) {
      delayExecute(startNewSession);
      return;
    }
    if (char.name !== calcSetup.char.name) {
      delayExecute(() => setPendingCode(1));
      return;
    }
    // The imported is from My Setups and already imported
    if (manageInfo.ID && calcSetupInfos.some((info) => info.ID === manageInfo.ID)) {
      delayExecute(() => setPendingCode(2));
      return;
    }
    if (calcSetupInfos.length === MAX_CALC_SETUPS) {
      delayExecute(() => setPendingCode(3));
      return;
    }
    const sameChar = isEqual(char, calcSetup.char);
    const sameTarget = isEqual(removeEmpty(currentTarget), removeEmpty(target));

    if (sameChar && sameTarget) {
      delayExecute(() =>
        addImportedSetup({
          shouldOverwriteChar: false,
          shouldOverwriteTarget: false,
        })
      );
      return;
    }
    overwriteToAsk.current = {
      character: !sameChar,
      target: !sameTarget,
    };

    setPendingCode(4);
  }, []);

  const endImport = () => {
    dispatch(updateSetupImportInfo({}));
  };

  const addImportedSetup: OverwriteOptionsProps["onDone"] = (config) => {
    dispatch(
      importSetup({
        importInfo: {
          ...manageInfo,
          calcSetup,
          target,
        },
        ...config,
      })
    );
    dispatch(
      updateUI({
        atScreen: EScreen.CALCULATOR,
        highManagerActive: false,
      })
    );
    endImport();
    dispatch(updateUI({ highManagerActive: false }));
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

  const resetExistingSetup = () => {
    //
    dispatch(updateUI({ highManagerActive: false }));
  };

  switch (pendingCode) {
    case 0:
      return <LoadingMask active />;
    case 1:
      return (
        <ConfirmModal
          active
          message="We're calculating another Character. Start a new session?"
          focusConfirm
          onConfirm={startNewSession}
          onClose={endImport}
        />
      );
    case 2:
      return (
        <ConfirmModal
          active
          message="This setup is already in the Calculator. Do you want to reset it to this version?"
          focusConfirm
          onConfirm={resetExistingSetup}
          onClose={endImport}
        />
      );
    case 3:
      return (
        <ConfirmModal
          active
          message={`The number of Setups on Calculator has reach the limit of ${MAX_CALC_SETUPS}. Start a new session?`}
          focusConfirm
          onConfirm={startNewSession}
          onClose={endImport}
        />
      );
    default:
      return (
        <Modal
          active
          preset="small"
          className="bg-dark-500"
          title="Overwrite Configuration"
          withActions
          formId="overwrite-configuration"
          onClose={endImport}
        >
          <OverwriteOptions
            askForCharacter={overwriteToAsk.current.character}
            askForTarget={overwriteToAsk.current.target}
            importedChar={calcSetup?.char}
            importedTarget={target}
            onDone={addImportedSetup}
          />
        </Modal>
      );
  }
};

export const SetupImportCenter = () => {
  const { calcSetup, target, ...rest } = useSelector((state) => state.ui.importInfo);
  return calcSetup && target ? <SetupImportCenterCore calcSetup={calcSetup} target={target} {...rest} /> : null;
};
