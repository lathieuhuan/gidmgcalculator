import { useState, useRef } from "react";

import type { CustomDebuffCtrl, CustomDebuffCtrlType } from "@Src/types";
import { ATTACK_ELEMENTS } from "@Src/constants";
import { updateCustomDebuffCtrls } from "@Store/calculatorSlice";

// Hook
import { useDispatch } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

// Component
import { ButtonGroup, Input } from "@Src/pure-components";

interface DebuffCtrlCreatorProps {
  onClose: () => void;
}
export default function DebuffCtrlCreator({ onClose }: DebuffCtrlCreatorProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<CustomDebuffCtrl>({
    type: "def",
    value: 0,
  });

  const onChangeType = (type: string) => {
    setConfig((prev) => ({
      ...prev,
      type: type as CustomDebuffCtrlType,
    }));

    inputRef.current?.focus();
  };

  const onConfirm = () => {
    dispatch(updateCustomDebuffCtrls({ actionType: "add", ctrls: config }));
    onClose();
  };

  return (
    <>
      <div className="mx-auto mt-4 px-2 flex items-center">
        <select
          className="pr-2 text-light-400 text-right text-last-right"
          value={config.type}
          onChange={(e) => onChangeType(e.target.value)}
        >
          {["def", ...ATTACK_ELEMENTS].map((option) => (
            <option key={option} value={option}>
              {t(option, { ns: "resistance" })} reduction
            </option>
          ))}
        </select>
        <Input
          ref={inputRef}
          type="number"
          className="ml-4 w-16 px-2 py-1 text-lg text-right font-bold"
          autoFocus
          value={config.value}
          max={200}
          onChange={(value) => {
            setConfig((prev) => ({ ...prev, value }));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onConfirm();
            }
          }}
        />
        <span className="ml-2">%</span>
      </div>
      <ButtonGroup
        className="mt-8"
        buttons={[
          { text: "Cancel", onClick: onClose },
          { text: "Confirm", onClick: onConfirm },
        ]}
      />
    </>
  );
}
