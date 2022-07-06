import { ReactNode } from "react";
import useHeight from "@Hooks/useHeight";
import cn from "classnames";

interface CollapseProps {
  className?: string;
  active: boolean;
  children: ReactNode;
}
export default function Collapse({ active, className, children }: CollapseProps) {
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
