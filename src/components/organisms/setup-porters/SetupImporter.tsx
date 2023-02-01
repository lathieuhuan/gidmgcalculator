import { useState } from "react";

// Util
import { decodeSetup } from "./utils";

// Component
import { Modal, type ModalControl } from "@Components/molecules";
import { PorterLayout } from "./atoms";

const SetupImporterCore = ({ onClose }: Pick<ModalControl, "onClose">) => {
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
          onClick: () => {
            navigator.clipboard.readText().then(setCode, () => setError("NOT_SUPPORT"));
          },
        },
        {
          text: "Import",
          onClick: () => {
            const actualCode = code.trim();

            if (actualCode.length) {
              try {
                const split = actualCode.split("&").map((str) => str.split("=")[1]);
                const result = decodeSetup(split);

                console.log(result);
              } catch (error) {
                setError("UNKNOWN");
              }
            }
          },
        },
      ]}
      autoFocusButtonIndex={1}
      onClose={onClose}
    />
  );
};

export const SetupImporter = ({ active, onClose }: ModalControl) => {
  return (
    <Modal className="" {...{ active, onClose }}>
      <SetupImporterCore onClose={onClose} />
    </Modal>
  );
};
