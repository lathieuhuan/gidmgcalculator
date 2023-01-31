import clsx from "clsx";
import { useState } from "react";
import type { CalcSetup, Target } from "@Src/types";

// Util
import { encodeSetup } from "./utils";

// Component
import { Modal, ModalControl } from "@Components/molecules";
import { PorterLayout } from "./atoms";

interface SetupExporterProps {
  setupName: string;
  calcSetup: CalcSetup;
  target: Target;
  onClose: () => void;
}
const SetupExporterCore = ({ setupName, calcSetup, target, onClose }: SetupExporterProps) => {
  const [status, setStatus] = useState(0);

  const encodedData = encodeSetup(calcSetup, target);

  return (
    <PorterLayout
      heading={`Share ${setupName}`}
      textareaAttrs={{
        value: encodedData,
        readOnly: true,
      }}
      message={
        status > 0 && (
          <p className={clsx("mt-2 text-center", status === 1 ? "text-green" : "text-lightred")}>
            {status === 1
              ? "Successfully copied to Clipboard."
              : "We're sorry. Your browser does not allow/support this function."}
          </p>
        )
      }
      moreButtons={[
        {
          text: "Copy",
          onClick: () => {
            navigator.clipboard.writeText(encodedData).then(
              () => setStatus(1),
              () => setStatus(2)
            );
          },
        },
      ]}
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
