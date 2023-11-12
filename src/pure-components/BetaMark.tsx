import type { HTMLAttributes } from "react";

export const BetaMark = ({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={
      "rounded px-1 bg-light-100 text-red-600 border-2 border-red-600 text-xs font-bold cursor-default " +
      className
    }
    {...rest}
  >
    BETA
  </div>
);
