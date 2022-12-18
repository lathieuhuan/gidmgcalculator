import clsx from "clsx";
import { ReactNode } from "react";
import { useHeight } from "@Src/hooks";

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
      className={clsx("hide-scrollbar", className)}
      style={{
        height: active ? Math.ceil(height) + 4 : 0,
        transition: `height ${duration}ms ease-in-out`,
      }}
    >
      <div ref={ref} className="pt-1">
        {children}
      </div>
    </div>
  );
}
