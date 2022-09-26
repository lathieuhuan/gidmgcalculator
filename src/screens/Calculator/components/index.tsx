import { ReactNode, useState } from "react";
import { FaCaretDown, FaCopy } from "react-icons/fa";
import { Select } from "@Src/styled-components";

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
        className="w-full px-6 py-1 appearance-none text-xl font-bold text-center text-last-center relative z-10"
        value={tab}
        onChange={(e) => onChangeTab(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i} className="text-xl text-left">
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
        className="px-1 rounded-l bg-default font-bold text-black"
        value={chosen}
        onChange={(e) => setChosen(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </Select>
      <button
        className="w-8 h-8 bg-lightgold text-black rounded-r flex-center glow-on-hover"
        onClick={() => onClickCopy(chosen)}
      >
        <FaCopy />
      </button>
    </div>
  );
};

interface SetterProps {
  label: string;
  inputComponent: ReactNode;
}
export const Setter = ({ label, inputComponent }: SetterProps) => {
  return (
    <div className="flex items-center justify-end">
      <span className="mr-4 text-base leading-6 text-right">{label}</span>
      {inputComponent}
    </div>
  );
};

export const twInputStyles = {
  select: "px-2 py-1 !bg-white text-black rounded font-bold outline-none",
};
