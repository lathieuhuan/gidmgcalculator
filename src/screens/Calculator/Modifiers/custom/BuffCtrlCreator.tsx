import clsx from "clsx";
import { Fragment, useState, useRef } from "react";
import type { CustomBuffCtrl, CustomDebuffCtrlType } from "@Src/types";

// Action
import { updateCustomBuffCtrls } from "@Store/calculatorSlice";

// Util
import { percentSign, processNumInput } from "@Src/utils";

// Hook
import { useDispatch } from "@Store/hooks";
import { useTranslation } from "@Hooks/useTranslation";

// Component
import { Select, ButtonBar } from "@Src/styled-components";

// Constant
import { ATTACK_ELEMENTS, ATTACK_PATTERNS, REACTIONS } from "@Src/constants";

const CUSTOM_BUFF_CATEGORIES = ["Attributes", "Elements", "Talents", "Reactions"] as const;

const OPTIONS_BY_CATEGORY = {
  Attributes: [
    "hp",
    "hp_",
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
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<CustomBuffCtrl>({
    category: 0,
    type: "atk_",
    value: 0,
  });

  const onChangeCategory = (categoryName: typeof CUSTOM_BUFF_CATEGORIES[number]) => {
    setConfig((prev) => ({
      ...prev,
      type: OPTIONS_BY_CATEGORY[categoryName][0],
      category: CUSTOM_BUFF_CATEGORIES.indexOf(categoryName),
    }));
  };

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
    dispatch(updateCustomBuffCtrls({ actionType: "add", ctrls: config }));
    onClose();
  };

  return (
    <Fragment>
      <div className="flex flex-col md1:flex-row">
        {CUSTOM_BUFF_CATEGORIES.map((categoryName, index) => {
          const chosen = config.category === index;

          return (
            <button
              key={categoryName}
              className={clsx(
                "px-4 py-1",
                !index && "rounded-t-lg md1:rounded-tr-none md1:rounded-l-lg",
                index === 3 && "rounded-b-lg md1:rounded-bl-none md1:rounded-r-lg",
                chosen ? "bg-default" : "bg-darkblue-3"
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!chosen) {
                  onChangeCategory(categoryName);
                }
              }}
            >
              <p className={clsx("text-lg font-semibold text-center", chosen && "text-black")}>
                {categoryName}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-8 flex items-center">
        <Select
          className="pr-2 text-default text-right text-last-right"
          value={config.type}
          onChange={(e) => onChangeType(e.target.value)}
        >
          {OPTIONS_BY_CATEGORY[CUSTOM_BUFF_CATEGORIES[config.category]].map((option) => (
            <option key={option} className="pr-2" value={option}>
              {t(option)}
            </option>
          ))}
        </Select>
        <input
          ref={inputRef}
          className="ml-4 w-16 px-2 py-1 text-lg text-right font-semibold textinput-common"
          autoFocus
          value={config.value}
          onChange={(e) => onChangeValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onConfirm();
            }
          }}
        />
        <span className="ml-2">{config.category > 1 ? "%" : percentSign(config.type)}</span>
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
