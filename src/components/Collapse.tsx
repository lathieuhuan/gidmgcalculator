import cn from "classnames";
import { ReactNode, useState } from "react";
import useHeight from "@Hooks/useHeight";

interface CollapseSpaceProps {
  className?: string;
  active: boolean;
  children: ReactNode;
}
export function CollapseSpace({ active, className, children }: CollapseSpaceProps) {
  const [ref, height] = useHeight();
  const duration = Math.max(Math.min(Math.round(height) / 2, 300), 150);
  return (
    <div
      className={cn("hide-scrollbar", className)}
      style={{
        height: active ? height + 4 : 0,
        transition: `height ${duration}ms ease-in-out`,
      }}
    >
      <div ref={ref} className="pt-1">
        {children}
      </div>
    </div>
  );
}

interface CollapseListProps {
  headingList: string[];
  contentList: ReactNode[];
}
export default function CollapseList({ headingList, contentList }: CollapseListProps) {
  const [expanded, setExpanded] = useState<(boolean | undefined)[]>([]);
  return (
    <div>
      {headingList.map((heading, i) => (
        <div key={i} className={expanded[i] ? "mb-6" : "mb-1"}>
          <p
            className={cn(
              "mb-2 pt-1 px-6 cursor-pointer bg-darkblue-3 font-bold text-lg leading-relaxed",
              expanded[i] && "bg-[#f5dc6e] text-black"
            )}
            onClick={() =>
              setExpanded((prev) => {
                const newEpd = [...prev];
                newEpd[i] = !newEpd[i];
                return newEpd;
              })
            }
          >
            {heading}
          </p>
          <CollapseSpace active={!!expanded[i]}>
            <div className="pr-4 pl-2">{contentList[i]}</div>
          </CollapseSpace>
        </div>
      ))}
    </div>
  );
}
