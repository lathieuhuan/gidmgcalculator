import { useState } from "react";
import type { CustomDebuffCtrl, CustomDebuffCtrlType } from "@Src/types";
import { ATTACK_ELEMENTS } from "@Src/constants";

import { createCustomDebuffCtrl } from "@Store/calculatorSlice";
import { percentSign, processNumInput } from "@Src/utils";

import { ButtonBar } from "@Components/minors";
import { Select } from "@Styled/Inputs";

interface DebuffCtrlCreatorProps {
  onClose: () => void;
}
export default function DebuffCtrlCreator({ onClose }: DebuffCtrlCreatorProps) {
  const [config, setConfig] = useState<CustomDebuffCtrl>({
    type: "def",
    value: 0,
  });

  const onChangeType = (type: string) => {
    setConfig((prev) => ({
      ...prev,
      type: type as CustomDebuffCtrlType,
    }));
  };

  const onChangeValue = (value: string) => {
    setConfig((prev) => ({
      ...prev,
      value: processNumInput(value, config.value, 999),
    }));
  };

  const onConfirm = () => {
    createCustomDebuffCtrl(config);
    onClose();
  };

  return (
    <div className="p-4 rounded-lg flex flex-col bg-darkblue-1 shadow-white-glow max-width-95">
      <div className="mx-auto flex align-center mt-4">
        <Select
          className="pr-2 text-white"
          value={config.type}
          onChange={(e) => onChangeType(e.target.value)}
        >
          {[...ATTACK_ELEMENTS, "def"].map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </Select>
        <input
          className="ml-4 p-2"
          value={config.value}
          onChange={(e) => onChangeValue(e.target.value)}
        />
        <span className="ml-2">{percentSign(config.type)}</span>
      </div>
      <ButtonBar className="mt-8" texts={["Cancel", "Confirm"]} handlers={[onClose, onConfirm]} />
    </div>
  );
}
