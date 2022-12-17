import type { HTMLAttributes } from "react";

export const BetaMark = ({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={
      "rounded px-1 bg-white text-red-500 border-2 border-red-500 text-xs font-bold cursor-default " +
      className
    }
    {...rest}
  >
    BETA
  </div>
);
