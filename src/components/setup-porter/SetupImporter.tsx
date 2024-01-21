import { useState } from "react";

import { updateSetupImportInfo } from "@Store/uiSlice";
import { useDispatch } from "@Store/hooks";
import { decodeSetup } from "./utils";

// Component
import { Modal } from "@Src/pure-components";
import { PorterLayout } from "./PorterLayout";

const SetupImporterCore = (props: { onClose: () => void }) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [error, setError] = useState<"NOT_SUPPORT" | "UNKNOWN" | "">("");

  return (
    <PorterLayout
      heading="Import setup"
      textareaAttrs={{
        placeholder: "Users are recommended to save their work (download data) before importing.",
        value: code,
        onChange: (e) => setCode(e.target.value),
      }}
      message={
        error
          ? {
              text:
                error === "NOT_SUPPORT"
                  ? "Sorry, your browser does not allow/support this function."
                  : "An unknown error has occurred. This setup cannot be imported.",
              type: "error",
            }
          : undefined
      }
      moreButtons={[
        {
          text: "Paste",
          autoFocus: true,
          onClick: () => {
            navigator.clipboard.readText().then(setCode, () => setError("NOT_SUPPORT"));
          },
        },
        {
          text: "Proceed",
          onClick: () => {
            const actualCode = code.trim();

            if (actualCode.length) {
              try {
                const result = decodeSetup(actualCode);

                dispatch(updateSetupImportInfo(result));
                props.onClose();
              } catch (error) {
                setError("UNKNOWN");
              }
            }
          },
        },
      ]}
      onClose={props.onClose}
    />
  );
};

export const SetupImporter = Modal.wrap(SetupImporterCore);
