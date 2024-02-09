import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface CollapseAndMountProps {
  className?: string;
  active: boolean;
  activeHeight: string | number;
  moveDuration: number;
  style?: CSSProperties;
  children: ReactNode;
}
export const CollapseAndMount = ({
  className,
  active,
  activeHeight,
  moveDuration,
  style = {},
  children,
}: CollapseAndMountProps) => {
  const [state, setState] = useState({
    active: false,
    mounted: false,
  });

  useEffect(() => {
    if (active) {
      setState({
        active: true,
        mounted: true,
      });
    } else {
      setState((prev) => ({
        ...prev,
        active: false,
      }));

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          mounted: false,
        }));
      }, moveDuration);
    }
  }, [active]);

  return (
    <div
      className={className}
      style={{
        ...style,
        height: state.active ? activeHeight : 0,
        transition: `height ${moveDuration}ms ease-in-out`,
        overflow: "hidden",
      }}
    >
      {state.mounted && children}
    </div>
  );
};
