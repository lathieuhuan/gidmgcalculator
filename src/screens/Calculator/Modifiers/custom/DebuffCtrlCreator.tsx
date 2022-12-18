import { Fragment, useState, useRef } from "react";
import type { CustomDebuffCtrl, CustomDebuffCtrlType } from "@Src/types";

// Constant
import { ATTACK_ELEMENTS } from "@Src/constants";

// Action
import { updateCustomDebuffCtrls } from "@Store/calculatorSlice";

// Util
import { processNumInput } from "@Src/utils";

// Hook
import { useDispatch } from "@Store/hooks";
import { useTranslation } from "@Src/hooks";

// Component
import { ButtonBar } from "@Components/molecules";

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

  const onChangeValue = (value: string) => {
    setConfig((prev) => ({
      ...prev,
      value: processNumInput(value, config.value, 999),
    }));
  };

  const onConfirm = () => {
    dispatch(updateCustomDebuffCtrls({ actionType: "add", ctrls: config }));
    onClose();
  };

  return (
    <Fragment>
      <div className="mx-auto mt-4 px-2 flex items-center">
        <select
          className="pr-2 text-default text-right text-last-right"
          value={config.type}
          onChange={(e) => onChangeType(e.target.value)}
        >
          {["def", ...ATTACK_ELEMENTS].map((option) => (
            <option key={option} value={option}>
              {t(option, { ns: "resistance" })} reduction
            </option>
          ))}
        </select>
        <input
          ref={inputRef}
          className="ml-4  w-16 px-2 py-1 text-lg text-right font-bold textinput-common"
          autoFocus
          value={config.value}
          onChange={(e) => onChangeValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onConfirm();
            }
          }}
        />
        <span className="ml-2">%</span>
      </div>
      <ButtonBar
        className="mt-8"
        buttons={[
          { text: "Cancel", onClick: onClose },
          { text: "Confirm", onClick: onConfirm },
        ]}
      />
    </Fragment>
  );
}
