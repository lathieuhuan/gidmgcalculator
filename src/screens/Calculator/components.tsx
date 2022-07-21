import { Fragment, ReactNode, useState } from "react";
import { FaCaretDown, FaCopy } from "react-icons/fa";
import { Checkbox, IconButton, Select } from "@Styled/Inputs";
import { CharBuffInputRenderType, ModifierInput } from "@Src/types";
import { genNumberSequence } from "@Src/utils";

interface MainSelectProps {
  tab: string;
  onChangeTab: (tab: string) => void;
  options: string[];
}
export function MainSelect({ tab, onChangeTab, options }: MainSelectProps) {
  return (
    <div className="rounded-full bg-orange text-black relative">
      <FaCaretDown className="absolute top-1/2 right-4 text-3xl -translate-y-1/2" />
      <Select
        className="px-6 py-1 appearance-none text-xl font-bold text-center text-last-center relative z-10"
        value={tab}
        onChange={(e) => onChangeTab(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i} className="text-xl">
            {opt}
          </option>
        ))}
      </Select>
    </div>
  );
}

interface CopySectionProps {
  options: string[];
  onClickCopy: (option: string) => void;
}
export const CopySection = ({ options, onClickCopy }: CopySectionProps) => {
  const [chosen, setChosen] = useState(options[0]);
  return (
    <div className="mb-4 px-4 flex justify-end">
      <Select
        className="px-1 rounded bg-white font-bold"
        value={chosen}
        onChange={(e) => setChosen(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </Select>
      <IconButton className="ml-4" variant="positive" onClick={() => onClickCopy(chosen)}>
        <FaCopy />
      </IconButton>
    </div>
  );
};

export const renderNoModifier = (isBuff: boolean) => (
  <p className="pt-6 pb-4 text-center">No {isBuff ? "buffs" : "debuffs"} found</p>
);

interface SetterProps {
  label: string;
  inputComponent: ReactNode;
}
export const Setter = ({ label, inputComponent }: SetterProps) => {
  return (
    <div className="flex items-center justify-end">
      <span className="mr-4 text-base leading-6">{label}</span>
      {inputComponent}
    </div>
  );
};

export const twInputStyles = {
  textInput: "px-2 py-2 w-16 rounded text-right",
  select: "px-2 py-1 bg-white rounded font-bold",
};

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
