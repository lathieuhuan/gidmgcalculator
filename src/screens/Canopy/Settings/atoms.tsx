import { ChangeEventHandler, ReactNode } from "react";

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
  label: string;
  defaultChecked: boolean;
  onChange: () => void;
}
export const CheckSetting = ({ label, ...rest }: CheckSettingProps) => {
  return (
    <label className="flex items-center hover:text-green">
      <span className="text-sm">{label}</span>
      <input type="checkbox" className="ml-4 mr-1 scale-180" {...rest} />
    </label>
  );
};

interface SelectSettingProps {
  label: string;
  defaultValue: string | number;
  options: (string | number)[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
}
export const SelectSetting = ({ label, options, ...rest }: SelectSettingProps) => {
  <label className="flex items-center">
    <span className="text-sm">{label}</span>
    <select className="pl-1 py-1" {...rest}>
      {options.map((option, i) => (
        <option key={i}>{option}</option>
      ))}
    </select>
  </label>;
};
