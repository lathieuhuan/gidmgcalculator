import { type ReactNode, useState } from "react";
import cn from "classnames";
import { CollapseSpace } from "./CollapseSpace";

interface CollapseListProps {
  headingList: string[];
  contentList: ReactNode[];
}
export function CollapseList({ headingList, contentList }: CollapseListProps) {
  const [expanded, setExpanded] = useState<(boolean | undefined)[]>([]);
  return (
    <div>
      {headingList.map((heading, i) => (
        <div key={i} className={expanded[i] ? "mb-4" : "mb-1"}>
          <p
            className={cn(
              "mb-2 pt-1 px-6 cursor-pointer font-bold leading-relaxed transition duration-200",
              expanded[i] ? "bg-dullyellow text-black" : "bg-darkblue-3"
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
