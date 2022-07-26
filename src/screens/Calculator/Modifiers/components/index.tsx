import { Fragment } from "react";
import type { CharBuffInputRenderType, ModifierInput } from "@Src/types";
import { genNumberSequence } from "@Src/utils";

import { Checkbox, Select } from "@Src/styled-components";
import { Setter, twInputStyles } from "@Screens/Calculator/components";

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
            className={twInputStyles.textInput}
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
