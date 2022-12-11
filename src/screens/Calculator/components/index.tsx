import clsx from "clsx";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { Select } from "@Src/styled-components";

export type Option = {
  value: string | number;
  label: string;
};

interface CopySectionProps<TOption> {
  className?: string;
  options: TOption[];
  defaultIndex?: number;
  onClickCopy: (option: TOption) => void;
}
export const CopySection = <TOption extends Option>({
  className,
  options,
  defaultIndex = 0,
  onClickCopy,
}: CopySectionProps<TOption>) => {
  const [chosenLabel, setChosenLabel] = useState(options[defaultIndex]?.label);

  const onClick = () => {
    const chosen = options.find(({ label }) => label === chosenLabel);
    if (chosen) {
      onClickCopy(chosen);
    }
  };

  return (
    <div className={clsx("flex justify-end", className)}>
      <Select
        className="px-1 rounded-l bg-default font-bold text-black"
        value={chosenLabel}
        onChange={(e) => setChosenLabel(e.target.value)}
      >
        {options.map((option, i) => (
          <option key={i} value={option.label}>
            {option.label}
          </option>
        ))}
      </Select>
      <button
        className="w-8 h-8 bg-lightgold text-black rounded-r flex-center glow-on-hover"
        onClick={onClick}
      >
        <FaCopy />
      </button>
    </div>
  );
};

export const twInputStyles = {
  select: "px-2 py-1 !bg-default text-black rounded font-bold outline-none",
};
