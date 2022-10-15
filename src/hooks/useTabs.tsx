import cn from "classnames";
import { useState } from "react";

interface TabInfo {
  text: string;
  disabled?: boolean;
}
interface UseTabArgs {
  className?: string;
  level?: number;
  defaultIndex?: number;
  configs: TabInfo[];
}
export function useTabs({ className, level = 1, defaultIndex = 0, configs }: UseTabArgs) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const tabs = (
    <div
      className={cn(
        "w-full flex divide-x-2 rounded-full divide-darkblue-3 overflow-hidden",
        className
      )}
    >
      {configs.map(({ text, disabled }, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          className={cn(
            "py-1 w-1/2 flex-center text-black font-bold",
            i === activeIndex
              ? level === 1
                ? "bg-orange"
                : "bg-lightorange"
              : "bg-white opacity-80"
          )}
          onClick={() => setActiveIndex(i)}
        >
          <span>{text}</span>
        </button>
      ))}
    </div>
  );

  return {
    activeIndex,
    tabs,
    setActiveIndex,
  };
}