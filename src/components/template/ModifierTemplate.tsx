import clsx from "clsx";
import { ReactNode } from "react";
import type { ModifierInput, ModInputConfig } from "@Src/types";

import { genNumberSequenceOptions, processNumInput } from "@Src/utils";
import { Select } from "@Src/styled-components";
import { twInputStyles } from "@Screens/Calculator/components";

export type ModSelectOption = {
  label: string | number;
  value: string | number;
};

const ANEMOABLE_OPTIONS: ModSelectOption[] = [
  { label: "Pyro", value: 0 },
  { label: "Hydro", value: 1 },
  { label: "Electro", value: 2 },
  { label: "Cryo", value: 3 },
];

const DENDROABLE_OPTIONS: ModSelectOption[] = [
  { label: "Pyro", value: 0 },
  { label: "Hydro", value: 1 },
  { label: "Electro", value: 2 },
];

interface ModifierTemplateProps {
  mutable?: boolean;
  checked?: boolean;
  heading: ReactNode;
  desc: ReactNode;
  inputConfigs?: ModInputConfig[];
  inputs?: ModifierInput[];
  onToggle?: () => void;
  onChangeText?: (newValue: number, inputIndex: number) => void;
  onToggleCheck?: (currentInput: number, inputIndex: number) => void;
  onSelectOption?: (value: number, inputIndex: number) => void;
}
export function ModifierTemplate({
  mutable = true,
  checked,
  heading,
  desc,
  inputConfigs = [],
  inputs = [],
  onToggle,
  onChangeText,
  onToggleCheck,
  onSelectOption,
}: ModifierTemplateProps) {
  //
  const renderInput = (index: number) => {
    const config = inputConfigs[index];
    const input = inputs[index];

    switch (config.type) {
      case "text":
        if (mutable) {
          return (
            <input
              type="text"
              className="w-20 p-2 text-right textinput-common font-semibold"
              value={input}
              onChange={(e) => {
                if (onChangeText) {
                  const newValue = processNumInput(e.target.value, input, config.max);
                  onChangeText(newValue, index);
                }
              }}
            />
          );
        }
        return <p className="text-orange capitalize">{input}</p>;
      case "check":
        if (mutable) {
          const checked = input === 1;
          return (
            <input
              type="checkbox"
              className="mr-1 scale-180"
              checked={checked}
              onChange={() => onToggleCheck && onToggleCheck(input, index)}
            />
          );
        }
        return <input type="checkbox" className="mr-1 scale-180" checked={true} readOnly />;
      default:
        let options: ModSelectOption[] = [];

        switch (config.type) {
          case "select":
          case "stacks":
            if (config.options) {
              options = config.options.map((option, optionIndex) => {
                return {
                  label: option,
                  value: optionIndex,
                };
              });
            } else {
              options = genNumberSequenceOptions(config.max, config.initialValue === 0);
            }
            break;
          case "anemoable":
            options = ANEMOABLE_OPTIONS;
            break;
          case "dendroable":
            options = DENDROABLE_OPTIONS;
            break;
        }

        if (mutable) {
          return (
            <Select
              className={twInputStyles.select}
              value={input}
              onChange={(e) => onSelectOption && onSelectOption(+e.target.value, index)}
            >
              {options.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          );
        }
        let { label } = options.find((option) => option.value === input) || {};

        return <p className="text-orange capitalize">{label}</p>;
    }
  };

  return (
    <div>
      <div className="mb-1 flex">
        <label className="flex items-center">
          {mutable && (
            <input
              type="checkbox"
              className="ml-1 mr-2 scale-150"
              checked={checked}
              onChange={onToggle}
            />
          )}
          <span className="pl-1 font-semibold text-lightgold">
            {mutable ? "" : "+"} {heading}
          </span>
        </label>
      </div>
      <p>{desc}</p>

      {inputConfigs.length ? (
        <div
          className={clsx("flex flex-col", mutable ? "pt-2 pb-1 pr-1 space-y-3" : "mt-1 space-y-2")}
        >
          {
            //
            inputConfigs.map((config, i) => (
              <div
                key={i}
                className="flex items-center justify-end"
                style={{ minHeight: "2.25rem" }}
              >
                <span className="mr-4 text-base leading-6 text-right">
                  {config.label || "Stacks"}
                </span>
                {renderInput(i)}
              </div>
            ))
          }
        </div>
      ) : null}
    </div>
  );
}
