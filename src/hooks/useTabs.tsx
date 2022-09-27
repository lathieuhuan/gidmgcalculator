import cn from "classnames";
import { useState } from "react";

interface TabInfo {
  text: string;
  disabled?: boolean;
}
interface UseTabArgs {
  className?: string;
  defaultIndex?: number;
  configs: TabInfo[];
}
export function useTabs({ className, defaultIndex = 0, configs }: UseTabArgs) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const tabs = (
    <div
      className={cn(
        "w-full flex divide-x-2 divide-darkblue-3 rounded-full overflow-hidden",
        className
      )}
    >
      {configs.map(({ text, disabled }, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          className={cn(
            "py-1 w-1/2 flex-center font-bold text-black",
            i === activeIndex ? "bg-orange " : "bg-default"
          )}
          onClick={() => setActiveIndex(i)}
        >
          <span className={cn(i !== activeIndex && "opacity-80")}>{text}</span>
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
