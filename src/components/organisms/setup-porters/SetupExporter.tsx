import clsx from "clsx";
import { useState } from "react";
import type { CalcSetup, Target } from "@Src/types";

// Util
import { encodeSetup } from "./utils";

// Component
import { ButtonBar, Modal, ModalControl } from "@Components/molecules";

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
    <div className="px-6 pt-4 pb-6 rounded-lg bg-darkblue-1 shadow-white-glow">
      <div className="w-75">
        <p className="mb-2 px-2 text-xl text-orange text-center font-bold">Share "{setupName}"</p>
        <textarea
          className="w-full p-2 text-black rounded resize-none"
          rows={15}
          value={encodedData}
          readOnly
        />

        {status > 0 && (
          <p className={clsx("mt-2 text-center", status === 1 ? "text-green" : "text-lightred")}>
            {status === 1
              ? "Successfully copied to Clipboard."
              : "We're sorry. Your browser does not allow/support this function."}
          </p>
        )}

        <ButtonBar
          className="mt-4"
          buttons={[
            { text: "Cancel", onClick: onClose },
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
        />
      </div>
    </div>
  );
};

export const SetupExporter = ({ active, onClose, ...rest }: ModalControl & SetupExporterProps) => {
  return (
    <Modal {...{ active, onClose }}>
      <SetupExporterCore {...rest} onClose={onClose} />
    </Modal>
  );
};
