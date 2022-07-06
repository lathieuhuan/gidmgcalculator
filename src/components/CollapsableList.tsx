import cn from "classnames";
import { type ReactNode, useState } from "react";
import Collapse from "./Collapse";

interface CollapsableListProps {
  headingList: string[];
  contentList: ReactNode[];
}
export default function CollapsableList({
  headingList,
  contentList,
}: CollapsableListProps) {
  const [expanded, setExpanded] = useState<(boolean | undefined)[]>([]);
  return (
    <div>
      {headingList.map((heading, i) => (
        <div key={i} className={expanded[i] ? "mb-4" : "mb-1"}>
          <p
            className={cn(
              "mb-2 pt-1 px-4 cursor-pointer bg-darkblue-3 font-bold text-lg leading-relaxed",
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
          <Collapse active={!!expanded[i]}>
            <div className="pr-4 pl-2">{contentList[i]}</div>
          </Collapse>
        </div>
      ))}
    </div>
  );
}
