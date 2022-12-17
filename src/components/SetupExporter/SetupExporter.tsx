import clsx from "clsx";
import { useState, useRef } from "react";
import type { UserSetup } from "@Src/types";

// Component
import { ButtonBar } from "@Src/styled-components";

interface SetupExporterProps {
  data: UserSetup;
  onClose: () => void;
}
export function SetupExporter({ data, onClose }: SetupExporterProps) {
  const [status, setStatus] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // const encryptedSetup = () => {
  // };

  return (
    <div className="px-6 pt-4 pb-6 rounded-lg bg-darkblue-1 shadow-white-glow">
      <div className="w-75">
        <p className="mb-2 px-2 text-xl text-orange text-center font-bold">Share "{data.name}"</p>
        <textarea
          ref={inputRef}
          className="w-full p-2 text-black rounded resize-none"
          rows={15}
          value={1254352}
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
                if (inputRef.current) {
                  navigator.clipboard.writeText(inputRef.current.value).then(
                    () => setStatus(1),
                    () => setStatus(2)
                  );
                }
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
