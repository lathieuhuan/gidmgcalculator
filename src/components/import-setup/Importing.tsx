import { EScreen } from "@Src/constants";
import { UsersSetup } from "@Src/types";
import { isEqual } from "@Src/utils";
import { importSetup, initSessionWithSetup } from "@Store/calculatorSlice";
import { selectChar } from "@Store/calculatorSlice/selectors";
import { useDispatch, useSelector } from "@Store/hooks";
import { changeScreen, resetCalculatorUI, toggleSettings, updateImportInfo } from "@Store/uiSlice";
import { ImportInfo } from "@Store/uiSlice/types";
import { useEffect, useState } from "react";

export default function Importing({ type, data }: ImportInfo) {
  const dispatch = useDispatch();
  const char = useSelector(selectChar);
  const target = useSelector((state) => state.calculator.target);
  const { myChars, myWps, myArts, mySetups } = useSelector((state) => state.database);

  const [pendingCode, setPendingCode] = useState(0);

  let importedSetup: UsersSetup;

  // if (type === "EDIT_SETUP") {
  //   return restoreSetup(data);
  // } else if (type === "IMPORT_OUTSIDE") {
  //   return data;
  // } else {
  //   return createTmSetup(data, myChars, myWps, myArts);
  // }

  const addImportedSetup = (shouldOverwriteChar: boolean, shouldOverwriteTarget: boolean) => {
    dispatch(importSetup({ data: importedSetup, shouldOverwriteChar, shouldOverwriteTarget }));
    dispatch(
      updateImportInfo({
        type: "",
        data: null,
      })
    );
    dispatch(changeScreen(EScreen.CALCULATOR));
    dispatch(toggleSettings(false));
  };

  const startNewSession = () => {
    dispatch(initSessionWithSetup(importedSetup));
    dispatch(
      updateImportInfo({
        type: "",
        data: null,
      })
    );
    dispatch(resetCalculatorUI());
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
            if (!sameChar) code = code * 10;
            if (!sameTarget) code = code * 10 + 1;
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

  // return !pendingCode ? (
  //   <Modal>
  //     <LoadingBar>
  //       <div />
  //     </LoadingBar>
  //   </Modal>
  // ) : (
  //   <ImportPending
  //     imported={imported}
  //     code={pendingCode}
  //     startSession={startSession}
  //     importSetup={importSetup}
  //   />
  // );
}
