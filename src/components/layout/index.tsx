import clsx from "clsx";
import type { ReactNode } from "react";

interface SharedSpaceProps {
  className?: string;
  leftPart: ReactNode;
  rightPart: ReactNode;
  atLeft: boolean;
}
export function SharedSpace({ className, leftPart, rightPart, atLeft }: SharedSpaceProps) {
  const childClassNames = [
    "absolute top-0 w-full h-full duration-200 ease-linear",
    atLeft ? "translate-x-0" : "-translate-x-full",
  ];
  return (
    <div className={clsx("relative w-full h-full overflow-hidden", className)}>
      <div className={clsx(childClassNames, "left-0")}>{leftPart}</div>
      <div className={clsx(childClassNames, "left-full")}>{rightPart}</div>
    </div>
  );
}
