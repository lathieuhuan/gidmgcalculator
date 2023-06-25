import clsx from "clsx";
import { useState, type ReactNode } from "react";
import { CollapseSpace } from "./CollapseSpace";

interface CollapseListProps {
  list: Array<{
    heading: string;
    body: ReactNode;
  }>;
}
export const CollapseList = ({ list }: CollapseListProps) => {
  const [expanded, setExpanded] = useState<(boolean | undefined)[]>([]);
  return (
    <div>
      {list.map(({ heading, body }, i) => (
        <div key={i} className={expanded[i] ? "mb-4" : "mb-1"}>
          <p
            className={clsx(
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
            <div className="pr-4 pl-2">{body}</div>
          </CollapseSpace>
        </div>
      ))}
    </div>
  );
};
