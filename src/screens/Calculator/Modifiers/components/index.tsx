import cn from "classnames";
import { Fragment, type ReactNode } from "react";
import type { ArtifactBuff, ModInputConfig, ModifierInput } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { ANEMOABLE_OPTIONS, DENDROABLE_OPTIONS, TOption } from "../constants";

import { Select } from "@Src/styled-components";
import { Setter, twInputStyles } from "@Screens/Calculator/components";

import { useDispatch } from "@Store/hooks";
import { changeModCtrlInput } from "@Store/calculatorSlice";
import { genNumberSequenceOptions, processNumInput } from "@Src/utils";

interface SetterSectionProps {
  buff: ArtifactBuff;
  inputs?: ModifierInput[];
  path: ToggleModCtrlPath;
}
export function SetterSection({ buff, inputs = [], path }: SetterSectionProps) {
  const dispatch = useDispatch();
  if (!buff.inputConfig) return null;
  const { labels, initialValues, maxValues, renderTypes } = buff.inputConfig;

  return (
    <Fragment>
      {labels.map((label, i) => {
        const input = inputs[i];
        let options: TOption[] = [];

        switch (renderTypes[i]) {
          case "stacks":
            options = genNumberSequenceOptions(maxValues?.[i], initialValues[i] === 0);
            break;
          case "anemoable":
            options = ANEMOABLE_OPTIONS;
            break;
        }
        return (
          <Setter
            key={i}
            label={label}
            inputComponent={
              <Select
                className={twInputStyles.select}
                value={input}
                onChange={(e) => {
                  dispatch(
                    changeModCtrlInput({
                      ...path,
                      inputIndex: i,
                      value: +e.target.value,
                    })
                  );
                }}
              >
                {options.map((opt, j) => (
                  <option key={j} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            }
          />
        );
      })}
    </Fragment>
  );
}

interface NewModifierTemplateProps {
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
export function NewModifierTemplate({
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
}: NewModifierTemplateProps) {
  //
  const renderInput = (index: number) => {
    const config = inputConfigs[index];
    const input = inputs[index];

    switch (config.type) {
      case "text":
        return (
          <input
            type="text"
            className="w-20 p-2 text-right textinput-common font-bold"
            value={input}
            onChange={(e) => {
              if (onChangeText) {
                const newValue = processNumInput(e.target.value, input, config.max);
                onChangeText(newValue, index);
              }
            }}
          />
        );
      case "check":
        const checked = input === 1;
        return (
          <input
            type="checkbox"
            className="mr-1 scale-180"
            checked={checked}
            onChange={() => onToggleCheck && onToggleCheck(input, index)}
          />
        );
      default:
        let options: TOption[] = [];

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
          <span className="pl-1 font-bold text-lightgold">
            {mutable ? "" : "+"} {heading}
          </span>
        </label>
      </div>
      <p>{desc}</p>

      {inputConfigs.length ? (
        <div
          className={cn("flex flex-col", mutable ? "pt-2 pb-1 pr-1 space-y-3" : "mt-1 space-y-2")}
        >
          {
            //
            inputConfigs.map((config, i) => (
              <Setter key={i} label={config.label} inputComponent={renderInput(i)} />
            ))
          }
        </div>
      ) : null}
    </div>
  );
}
