import cn from "classnames";
import { Fragment, useState } from "react";
import type { CustomBuffCtrl, CustomDebuffCtrlType } from "@Src/types";
import { ATTACK_ELEMENTS, ATTACK_PATTERNS, REACTIONS } from "@Src/constants";

import { createCustomBuffCtrl } from "@Store/calculatorSlice";
import { percentSign, processNumInput } from "@Src/utils";
import { useDispatch } from "@Store/hooks";
import { useTranslation } from "@Hooks/useTranslation";

import { Select } from "@Src/styled-components";
import { ButtonBar } from "@Components/minors";

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
  };

  const onChangeValue = (value: string) => {
    setConfig((prev) => ({
      ...prev,
      value: processNumInput(value, config.value, 999),
    }));
  };

  const onConfirm = () => {
    dispatch(createCustomBuffCtrl(config));
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
              className={cn(
                "px-4 py-1",
                !index && "rounded-t-lg md1:rounded-tr-none md1:rounded-l-lg",
                index === 3 && "rounded-b-lg md1:rounded-bl-none md1:rounded-r-lg",
                chosen ? "bg-default" : "bg-darkblue-3"
              )}
              onClick={() => {
                if (!chosen) {
                  onChangeCategory(categoryName);
                }
              }}
            >
              <p className={cn("text-h6 font-bold text-center", chosen && "text-black")}>
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
            <option key={option} value={option}>
              {t(option)}
            </option>
          ))}
        </Select>
        <input
          className="ml-4 p-2 w-16 text-right textinput-common"
          value={config.value}
          onChange={(e) => onChangeValue(e.target.value)}
        />
        <span className="ml-2">{config.category > 1 ? "%" : percentSign(config.type)}</span>
      </div>
      <ButtonBar className="mt-8" texts={["Cancel", "Confirm"]} handlers={[onClose, onConfirm]} />
    </Fragment>
  );
}
