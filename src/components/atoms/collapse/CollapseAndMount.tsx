import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

interface CollapseAndMount {
  className?: string;
  active: boolean;
  activeHeight: string | number;
  duration: number;
  style?: CSSProperties;
  children: ReactNode;
}
export const CollapseAndMount = ({
  className,
  active,
  activeHeight,
  duration,
  style = {},
  children,
}: CollapseAndMount) => {
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
      }, duration);
    }
  }, [active]);

  return (
    <div
      className={className}
      style={{
        ...style,
        height: state.active ? activeHeight : 0,
        transition: `height ${duration}ms linear`,
      }}
    >
      {state.mounted && children}
    </div>
  );
};
