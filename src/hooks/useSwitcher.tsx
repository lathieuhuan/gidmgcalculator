import { useState } from "react";
import cn from "classnames";

interface TabInfo {
  text: string;
  clickable: boolean;
}
export function useSwitcher(TabInfos: TabInfo[]) {
  const [tab, setTab] = useState(TabInfos[0].text);

  const cpn = (
    <div className="w-full flex">
      {TabInfos.map(({ text, clickable }, i) => (
        <button
          key={i}
          type="button"
          className={cn(
            "py-1 w-1/2 flex-center",
            clickable && "cursor-pointer",
            text === tab ? "bg-default" : "bg-darkblue-3",
            !i ? "rounded-l-2xl" : i === TabInfos.length - 1 ? "rounded-r-2xl" : ""
          )}
          onClick={() => {
            if (clickable) setTab(text);
          }}
        >
          <p className={cn("font-bold", text === tab ? "text-black" : "text-default")}>
            {clickable && text}
          </p>
        </button>
      ))}
    </div>
  );
  return [cpn, tab, setTab] as const;
}
