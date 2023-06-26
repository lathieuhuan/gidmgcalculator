import type { ReactNode } from "react";

interface SharedSpaceProps {
  className?: string;
  leftPart: ReactNode;
  rightPart: ReactNode;
  atLeft: boolean;
}
export const SharedSpace = ({ className = "", leftPart, rightPart, atLeft }: SharedSpaceProps) => {
  return (
    <div className={"relative w-full h-full overflow-hidden " + className}>
      <div
        className={
          "absolute top-0 h-full flex transform duration-300" + (atLeft ? "" : " -translate-x-1/2")
        }
        style={{ width: "200%" }}
      >
        <div className="w-1/2 h-full shrink-0">{leftPart}</div>
        <div className="w-1/2 h-full shrink-0">{rightPart}</div>
      </div>
    </div>
  );
};
