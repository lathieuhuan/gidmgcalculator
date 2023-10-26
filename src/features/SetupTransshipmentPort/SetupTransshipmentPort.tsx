import { useEffect, useRef } from "react";

import { useDispatch, useSelector } from "@Store/hooks";
import { updateMessage } from "@Store/calculatorSlice";
import { updateSetupImportInfo } from "@Store/uiSlice";

import { getSearchParam } from "@Src/utils";
import { decodeSetup } from "@Src/components/setup-porter/utils";

export const SetupTransshipmentPort = () => {
  const dispatch = useDispatch();
  const importCode = useRef(getSearchParam("importCode"));
  const ready = useSelector((state) => state.ui.ready);

  useEffect(() => {
    if (ready) {
      if (importCode.current) {
        try {
          dispatch(
            updateSetupImportInfo({
              importRoute: "url",
              ...decodeSetup(importCode.current),
            })
          );
          importCode.current = "";
        } catch (error) {
          dispatch(
            updateMessage({
              type: "error",
              content: "An unknown error has occurred. This setup cannot be imported.",
            })
          );
        }
      }
    } else {
      window.history.replaceState(null, "", window.location.origin);
    }
  }, [ready]);

  return null;
};
