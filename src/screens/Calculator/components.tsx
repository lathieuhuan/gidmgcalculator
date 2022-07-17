import { Select } from "@Styled/Inputs";
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
