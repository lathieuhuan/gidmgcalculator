import clsx from "clsx";
import { useState, type ReactNode } from "react";
import { CollapseSpace } from "./CollapseSpace";

interface CollapseListProps {
  list: Array<{
    heading: ReactNode | ((expanded?: boolean) => ReactNode);
    body: ReactNode;
  }>;
}
export const CollapseList = ({ list }: CollapseListProps) => {
  const [expanded, setExpanded] = useState<(boolean | undefined)[]>([]);
  return (
    <div>
      {list.map(({ heading, body }, i) => (
        <div key={i} className={expanded[i] ? "mb-4" : "mb-1"}>
          <div
            className={clsx(
              "mb-2 pt-1 px-6 cursor-pointer leading-relaxed transition duration-200",
              expanded[i] ? "font-bold bg-yellow-300 text-black" : "font-semibold bg-dark-500"
            )}
            onClick={() =>
              setExpanded((prev) => {
                const newEpd = [...prev];
                newEpd[i] = !newEpd[i];
                return newEpd;
              })
            }
          >
            {typeof heading === "function" ? heading(expanded[i]) : heading}
          </div>
          <CollapseSpace active={!!expanded[i]}>
            <div className="pr-4 pl-2">{body}</div>
          </CollapseSpace>
        </div>
      ))}
    </div>
  );
};
