import type { HTMLAttributes } from "react";

export const BetaMark = ({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={
      "rounded px-1 bg-white text-darkred border-2 border-darkred text-xs font-bold cursor-default " +
      className
    }
    {...rest}
  >
    BETA
  </div>
);
