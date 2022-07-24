import cn from "classnames";
import { useState } from "react";
import type { CustomBuffCtrl, CustomDebuffCtrlType } from "@Src/types";
import { ATTACK_ELEMENTS, ATTACK_PATTERNS, REACTIONS } from "@Src/constants";

import { createCustomBuffCtrl } from "@Store/calculatorSlice";
import { percentSign, processNumInput } from "@Src/utils";

import { ButtonBar } from "@Components/minors";
import { Select } from "@Styled/Inputs";

const CUSTOM_BUFF_CATEGORIES = ["Attributes", "Elements", "Talents", "Reactions"] as const;

const OPTIONS_BY_CATEGORY = {
  Attributes: [
    "hp, hp_",
    "atk",
    "atk_",
    "def",
    "def_",
    "em",
    "er",
    "cRate",
    "cDmg",
    "shStr",
    "healBn",
  ],
  Elements: ATTACK_ELEMENTS,
  Talents: ATTACK_PATTERNS,
  Reactions: REACTIONS,
} as const;

interface BuffCtrlCreatorProps {
  onClose: () => void;
}
export default function BuffCtrlCreator({ onClose }: BuffCtrlCreatorProps) {
  const [config, setConfig] = useState<CustomBuffCtrl>({
    category: 0,
    type: "atk_",
    value: 0,
  });

  const onChangeCategory = (categoryName: typeof CUSTOM_BUFF_CATEGORIES[number]) => {
    setConfig((prev) => ({
      ...prev,
      category: CUSTOM_BUFF_CATEGORIES.indexOf(categoryName),
    }));
  };

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
    createCustomBuffCtrl(config);
    onClose();
  };

  return (
    <div className="p-4 rounded-lg flex flex-col bg-darkblue-1 shadow-white-glow max-width-95">
      <div className="flex flex-col md1:flex-row">
        {CUSTOM_BUFF_CATEGORIES.map((categoryName, index) => {
          const chosen = config.category === index;

          return (
            <button
              key={categoryName}
              className={cn("px-4 py-2 bg-darkblue-3", chosen && "bg-default")}
              onClick={() => {
                if (!chosen) {
                  onChangeCategory(categoryName);
                }
              }}
            >
              <p className={cn("text-h6 font-bold text-center", chosen && "text-black")}>
                {config.category}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mx-auto flex align-center mt-4">
        <Select
          className="pr-2 text-white"
          value={config.type}
          onChange={(e) => onChangeType(e.target.value)}
        >
          {OPTIONS_BY_CATEGORY[CUSTOM_BUFF_CATEGORIES[config.category]].map((opt) => (
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
