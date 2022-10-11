import { Fragment, useState } from "react";
import type { CustomDebuffCtrl, CustomDebuffCtrlType } from "@Src/types";
import { ATTACK_ELEMENTS } from "@Src/constants";

import { useDispatch } from "@Store/hooks";
import { createCustomDebuffCtrl } from "@Store/calculatorSlice";
import { processNumInput } from "@Src/utils";
import { useTranslation } from "@Hooks/useTranslation";

import { Select } from "@Src/styled-components";
import { ButtonBar } from "@Components/minors";

interface DebuffCtrlCreatorProps {
  onClose: () => void;
}
export default function DebuffCtrlCreator({ onClose }: DebuffCtrlCreatorProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
          className="pr-2 text-default text-right text-last-right"
          value={config.type}
          onChange={(e) => onChangeType(e.target.value)}
        >
          {["def", ...ATTACK_ELEMENTS].map((option) => (
            <option key={option} value={option}>
              {t(option, { ns: "resistance" })} reduction
            </option>
          ))}
        </Select>
        <input
          className="ml-4  w-16 px-2 py-1 text-lg text-right font-bold textinput-common"
          value={config.value}
          onChange={(e) => onChangeValue(e.target.value)}
        />
        <span className="ml-2">%</span>
      </div>
      <ButtonBar className="mt-8" texts={["Cancel", "Confirm"]} handlers={[onClose, onConfirm]} />
    </Fragment>
  );
}
