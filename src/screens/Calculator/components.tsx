import { Select } from "@Styled/Inputs";
import { ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";

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
