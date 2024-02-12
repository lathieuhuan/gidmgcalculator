import { ReactNode } from "react";
import { Checkbox } from "@Src/pure-components";

interface SectionProps {
  title: string;
  children: ReactNode;
}
export const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="px-4 py-2 bg-dark-900 rounded">
      <p className="text-blue-400 text-lg font-semibold">{title}</p>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );
};

interface CheckSettingProps {
  label: string;
  defaultChecked: boolean;
  onChange: () => void;
}
export const CheckSetting = ({ label, ...rest }: CheckSettingProps) => {
  return (
    <label className="flex items-center justify-between glow-on-hover">
      <span>{label}</span>
      <Checkbox className="ml-4" {...rest} />
    </label>
  );
};

interface SelectSettingProps<T = string | number> {
  label: string;
  defaultValue: T;
  options: any[] | readonly any[];
  onChange: (newValue: T) => void;
}
export const SelectSetting = ({ label, options, defaultValue, onChange }: SelectSettingProps) => {
  return (
    <label className="flex items-center justify-between" style={{ minHeight: 40 }}>
      <span>{label}</span>
      <select
        className="ml-3 w-20 styled-select shrink-0 text-right text-last-right"
        defaultValue={defaultValue}
        onChange={(e) => {
          onChange(typeof defaultValue === "string" ? e.target.value : +e.target.value);
        }}
      >
        {options.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
      </select>
    </label>
  );
};
