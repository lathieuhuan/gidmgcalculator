import cn from "classnames";
import { Select } from "@Styled/Inputs";

interface MainSelectProps {
  className?: string;
  tab: string;
  onChangeTab: (tab: string) => void;
  options: string[];
}
export function MainSelect({ tab, onChangeTab, options, className }: MainSelectProps) {
  return (
    <div className="rounded-full bg-orange">
      <Select
        className={cn(
          "px-3 py-1 appearance-none text-xl font-bold text-center",
          "bg-contain bg-no-repeat bg-[url('https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-512.png')] bg-origin-content bg-[origin:100%]"
        )}
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
