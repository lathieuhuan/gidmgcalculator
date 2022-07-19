import { Fragment, ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";
import { Checkbox, Select } from "@Styled/Inputs";
import { CharBuffInputRenderType, ModifierInput } from "@Src/types";

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

export const renderNoModifier = (isBuff: boolean) => (
  <p className="pt-6 pb-4 text-center">No {isBuff ? "buffs" : "debuffs"} found</p>
);

interface SetterProps {
  label: string;
  input: ReactNode;
}
export const Setter = ({ label, input }: SetterProps) => {
  return (
    <div className="flex items-center justify-end">
      <span className="mr-4 text-base leading-6">{label}</span>
      {input}
    </div>
  );
};

export const twStyles = {
  select: "px-2 py-1 bg-white rounded font-bold",
};

interface CharModSettersProps {
  labels: string[];
  renderTypes: CharBuffInputRenderType[];
  inputs: ModifierInput[];
  maxValues?: (number | null)[];
  onTextChange: (text: string, inputIndex: number) => void;
  onToggleCheck: (inputIndex: number) => void;
  onSelect: (text: string, inputIndex: number) => void;
}
export function CharModSetters({
  labels,
  renderTypes,
  inputs,
  maxValues,
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
            className="px-2 py-2 w-16 rounded text-right"
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
            options = Array.from({ length: maxValues?.[index] || 0 }, (_, i) => i + 1);
          case "anemoable":
            options = ["pyro", "hydro", "electro", "cryo"];
          case "dendroable":
            options = ["pyro", "hydro", "electro"];
        }
        return typeof input === "boolean" ? null : (
          <Select
            className={twStyles.select}
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
        <Setter key={i} label={label} input={renderInput(i)} />
      ))}
    </Fragment>
  );
}
