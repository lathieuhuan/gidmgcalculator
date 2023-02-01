import { useState } from "react";
import type { CalcSetup, Target } from "@Src/types";

// Util
import { encodeSetup } from "./utils";

// Component
import { Modal, type ModalControl } from "@Components/molecules";
import { PorterLayout } from "./atoms";

interface SetupExporterProps {
  setupName: string;
  calcSetup: CalcSetup;
  target: Target;
  onClose: () => void;
}
const SetupExporterCore = ({ setupName, calcSetup, target, onClose }: SetupExporterProps) => {
  const [status, setStatus] = useState<"SUCCESS" | "NOT_SUPPORT" | "">("");

  const encodedData = encodeSetup(calcSetup, target);

  return (
    <PorterLayout
      heading={`Share ${setupName}`}
      textareaAttrs={{
        value: encodedData,
        readOnly: true,
      }}
      message={
        status
          ? {
              text:
                status === "SUCCESS"
                  ? "Successfully copied to Clipboard."
                  : "Sorry. Your browser does not allow/support this function.",
              type: status === "SUCCESS" ? "success" : "error",
            }
          : undefined
      }
      moreButtons={[
        {
          text: "Copy",
          onClick: () => {
            navigator.clipboard.writeText(encodedData).then(
              () => setStatus("SUCCESS"),
              () => setStatus("NOT_SUPPORT")
            );
          },
        },
      ]}
      autoFocusButtonIndex={1}
      onClose={onClose}
    />
  );
};

export const SetupExporter = ({ active, onClose, ...rest }: ModalControl & SetupExporterProps) => {
  return (
    <Modal {...{ active, onClose }}>
      <SetupExporterCore {...rest} onClose={onClose} />
    </Modal>
  );
};
