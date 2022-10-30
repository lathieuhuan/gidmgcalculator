import { Fragment } from "react";
import type { ArtifactBuff, CharBuffInputRenderType, ModifierInput } from "@Src/types";
import type { ToggleModCtrlPath } from "@Store/calculatorSlice/reducer-types";

import { Checkbox, Select } from "@Src/styled-components";
import { Setter, twInputStyles } from "@Screens/Calculator/components";

import { useDispatch } from "@Store/hooks";
import { changeModCtrlInput } from "@Store/calculatorSlice";
import { genNumberSequence } from "@Src/utils";

interface CharModSettersProps {
  labels: string[];
  renderTypes: CharBuffInputRenderType[];
  initialValues: ModifierInput[];
  maxValues?: number[];
  inputs: ModifierInput[];
  onTextChange: (text: string, inputIndex: number) => void;
  onToggleCheck: (inputIndex: number) => void;
  onSelect: (text: string, inputIndex: number) => void;
}
export function CharModSetters({
  labels,
  renderTypes,
  initialValues,
  maxValues,
  inputs,
  onTextChange,
  onToggleCheck,
  onSelect,
}: CharModSettersProps) {
  //
  const renderInput = (index: number) => {
    switch (renderTypes[index]) {
      case "text": {
        const input = inputs[index];

        return typeof input === "boolean" ? null : (
          <input
            type="text"
            className="w-20 p-2 text-right textinput-common"
            value={input}
            onChange={(e) => onTextChange(e.target.value, index)}
          />
        );
      }
      case "check":
        return (
          <Checkbox
            className="mr-1"
            checked={!!inputs[index]}
            onChange={() => onToggleCheck(index)}
          />
        );
      default:
        let options: (string | number)[] = [];
        const input = inputs[index];

        switch (renderTypes[index]) {
          case "select":
            options = genNumberSequence(maxValues?.[index], initialValues[index] === 0);
            break;
          case "anemoable":
            options = ["pyro", "hydro", "electro", "cryo"];
            break;
          case "dendroable":
            options = ["pyro", "hydro", "electro"];
            break;
        }
        return typeof input === "boolean" ? null : (
          <Select
            className={twInputStyles.select}
            value={input}
            onChange={(e) => onSelect(e.target.value, index)}
          >
            {options.map((opt, i) => (
              <option key={i}>{opt}</option>
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
        let options: string[] | number[] = [];

        if (renderTypes[i] === "stacks") {
          options = genNumberSequence(maxValues?.[i], initialValues[i] === 0);
        } //
        else if (renderTypes[i] === "anemoable") {
          options = ["pyro", "hydro", "electro", "cryo"];
        }

        return typeof input === "boolean" ? null : (
          <Setter
            key={i}
            label={label}
            inputComponent={
              <Select
                className={twInputStyles.select}
                value={input}
                onChange={(e) => {
                  const { value } = e.target;
                  dispatch(
                    changeModCtrlInput({
                      ...path,
                      inputIndex: i,
                      value: isNaN(+value) ? value : +value,
                    })
                  );
                }}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
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
