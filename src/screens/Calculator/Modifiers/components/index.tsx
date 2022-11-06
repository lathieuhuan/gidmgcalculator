import { Fragment } from "react";
import type {
  ArtifactBuff,
  CharModInputConfig,
  ModifierInput,
  TWeaponBuffInputRenderType,
} from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";
import { ANEMOABLE_OPTIONS, DENDROABLE_OPTIONS, TOption } from "../constants";

import { Select } from "@Src/styled-components";
import { Setter, twInputStyles } from "@Screens/Calculator/components";

import { useDispatch } from "@Store/hooks";
import { changeModCtrlInput } from "@Store/calculatorSlice";
import { genNumberSequenceOptions, processNumInput } from "@Src/utils";

interface ISetterProps {
  labels: string[];
  initialValues: ModifierInput[];
  maxValues?: number[];
  inputs: ModifierInput[];
  onTextChange?: (text: string, inputIndex: number) => void;
  onToggleCheck?: (currentInput: number, inputIndex: number) => void;
  onSelect?: (value: number, inputIndex: number) => void;
}

interface ICharModSettersProps {
  inputConfigs: CharModInputConfig[];
  inputs: ModifierInput[];
  onTextChange?: (newValue: number, inputIndex: number) => void;
  onToggleCheck?: (currentInput: number, inputIndex: number) => void;
  onSelect?: (value: number, inputIndex: number) => void;
}
export function CharModSetters({
  inputConfigs,
  inputs,
  onTextChange,
  onToggleCheck,
  onSelect,
}: ICharModSettersProps) {
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
              if (onTextChange) {
                const newValue = processNumInput(e.target.value, input, config.max);
                onTextChange(newValue, index);
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
            options = genNumberSequenceOptions(config.max, config.initialValue === 0);
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
            onChange={(e) => onSelect && onSelect(+e.target.value, index)}
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
    <Fragment>
      {inputConfigs.map((config, i) => (
        <Setter key={i} label={config.label} inputComponent={renderInput(i)} />
      ))}
    </Fragment>
  );
}

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

interface IWeaponModSettersProps extends ISetterProps {
  renderTypes: TWeaponBuffInputRenderType[];
  options?: string[][];
}
export function WeaponModSetters({
  labels,
  renderTypes,
  initialValues,
  maxValues,
  options = [],
  inputs,
  onTextChange,
  onToggleCheck,
  onSelect,
}: IWeaponModSettersProps) {
  //
  const renderInput = (index: number) => {
    const input = inputs[index];

    switch (renderTypes[index]) {
      case "text":
        return (
          <input
            type="text"
            className="w-20 p-2 text-right textinput-common font-bold"
            value={input}
            onChange={(e) => onTextChange && onTextChange(e.target.value, index)}
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
        let renderOptions: TOption[] = [];

        switch (renderTypes[index]) {
          case "stacks":
            renderOptions = genNumberSequenceOptions(
              maxValues?.[index],
              initialValues[index] === 0
            );
            break;
          case "choices":
            renderOptions = options[index].map((option, i) => ({
              label: option,
              value: i,
            }));
            break;
        }
        return (
          <Select
            className={twInputStyles.select}
            value={input}
            onChange={(e) => onSelect && onSelect(+e.target.value, index)}
          >
            {renderOptions.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        );
    }
  };
  return (
    <Fragment>
      {labels.map((label, i) => (
        <Setter key={i} label={label} inputComponent={renderInput(i)} />
      ))}
    </Fragment>
  );
}
