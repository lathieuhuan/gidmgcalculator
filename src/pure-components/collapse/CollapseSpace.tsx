import clsx from "clsx";
import { ReactNode } from "react";
import { useElementSize } from "@Src/pure-hooks";

interface CollapseSpaceProps {
  className?: string;
  active: boolean;
  children: ReactNode;
}
export const CollapseSpace = ({ active, className, children }: CollapseSpaceProps) => {
  const [ref, { height }] = useElementSize<HTMLDivElement>();
  const duration = Math.max(Math.min(Math.round(height) / 2, 300), 150);

  return (
    <div
      className={clsx("hide-scrollbar", className)}
      style={{
        height: active ? Math.ceil(height) : 0,
        transition: `height ${duration}ms ease-in-out`,
      }}
    >
      <div ref={ref}>
        {children}
      </div>
    </div>
  );
};
