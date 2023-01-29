import type { ReactNode, ChangeEventHandler } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}
export const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="mt-2 px-4 py-2 bg-darkblue-1 rounded">
      <p className="text-lightgold text-lg font-semibold">{title}</p>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );
};

interface CheckSettingProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}
export const CheckSetting = ({ label, ...others }: CheckSettingProps) => {
  return (
    <label className="flex items-center hover:text-green">
      <span className="text-sm">{label}</span>
      <input type="checkbox" className="ml-4 mr-1 scale-180" {...others} />
    </label>
  );
};

interface SelectSettingProps {
  value: string | number;
  options: readonly (string | number)[];
  label: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}
export const SelectSetting = ({ label, options, ...others }: SelectSettingProps) => {
  return (
    <label className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <select className="ml-3 pl-1 py-1" {...others}>
        {options.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
      </select>
    </label>
  );
};
