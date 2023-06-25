import { useState } from "react";
import type { CalcSetup, Target } from "@Src/types";
import type { ModalControl } from "../modal/Modal";

// Util
import { encodeSetup } from "./utils";

// Component
import { Modal } from "../modal/Modal";
import { PorterLayout } from "./PorterLayout";

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
        {
          text: "Copy URL",
          onClick: () => {
            navigator.clipboard.writeText(`${window.location.origin}?importCode=${encodedData}`).then(
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
