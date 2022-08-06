import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

interface CollapseAndMount {
  className?: string;
  active: boolean;
  activeHeight: string | number;
  duration: number;
  style?: CSSProperties;
  children: ReactNode;
}
export function CollapseAndMount({
  className,
  active,
  activeHeight,
  duration,
  style = {},
  children,
}: CollapseAndMount) {
  const [open, setOpen] = useState(false);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (active) {
      setOpen(true);
      setShowing(true);
    } else {
      setOpen(false);
      setTimeout(() => setShowing(false), duration);
    }
  }, [active]);

  return (
    <div
      className={className}
      style={{
        ...style,
        height: open ? activeHeight : 0,
        transition: `height ${duration}ms linear`,
      }}
    >
      {showing && children}
    </div>
  );
}
