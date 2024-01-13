import clsx, { ClassValue } from "clsx";
import { useState } from "react";

interface TabConfig {
  text: string;
  disabled?: boolean;
}
interface UseTabArgs {
  className?: ClassValue;
  level?: number;
  defaultIndex?: number;
  configs: TabConfig[];
}
export function useTabs({ className, level = 1, defaultIndex = 0, configs }: UseTabArgs) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const tabsElmt = (
    <div className={clsx("w-full flex divide-x-2 rounded-full divide-dark-500 shrink-0 overflow-hidden", className)}>
      {configs.map(({ text, disabled }, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          className={clsx(
            "py-0.5 w-1/2 flex-center text-black font-bold",
            i === activeIndex ? (level === 1 ? "bg-orange-500" : "bg-blue-400") : "bg-light-400 opacity-80"
          )}
          onClick={() => setActiveIndex(i)}
        >
          {text}
        </button>
      ))}
    </div>
  );

  return {
    activeIndex,
    tabsElmt,
    setActiveIndex,
  };
}
