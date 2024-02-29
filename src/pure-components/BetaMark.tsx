import type { HTMLAttributes } from "react";

interface BetaMarkProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}
export const BetaMark = ({ className = "", active, ...rest }: BetaMarkProps) => {
  if (active) {
    return (
      <div
        className={
          "rounded px-1 bg-light-100 text-red-600 border-2 border-red-600 text-xs font-bold cursor-default " + className
        }
        {...rest}
      >
        BETA
      </div>
    );
  }
  return null;
};
