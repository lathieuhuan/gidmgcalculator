import { Fragment, useState } from "react";
import type { CustomDebuffCtrl, CustomDebuffCtrlType } from "@Src/types";
import { ATTACK_ELEMENTS } from "@Src/constants";

import { useDispatch } from "@Store/hooks";
import { createCustomDebuffCtrl } from "@Store/calculatorSlice";
import { percentSign, processNumInput } from "@Src/utils";

import { Select } from "@Src/styled-components";
import { ButtonBar } from "@Components/minors";

interface DebuffCtrlCreatorProps {
  onClose: () => void;
}
export default function DebuffCtrlCreator({ onClose }: DebuffCtrlCreatorProps) {
  const dispatch = useDispatch();
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
    dispatch(createCustomDebuffCtrl(config));
    onClose();
  };

  return (
    <Fragment>
      <div className="mx-auto mt-4 px-2 flex items-center">
        <Select
          className="text-default"
          value={config.type}
          onChange={(e) => onChangeType(e.target.value)}
        >
          {[...ATTACK_ELEMENTS, "def"].map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </Select>
        <input
          className="ml-4 p-2 w-16 text-right textinput-common"
          value={config.value}
          onChange={(e) => onChangeValue(e.target.value)}
        />
        <span className="ml-2">{percentSign(config.type)}</span>
      </div>
      <ButtonBar className="mt-8" texts={["Cancel", "Confirm"]} handlers={[onClose, onConfirm]} />
    </Fragment>
  );
}
