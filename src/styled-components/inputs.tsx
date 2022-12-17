import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";

export const Select = ({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={clsx(
        "leading-base block outline-none",
        !className?.includes("bg-") && "bg-transparent",
        className
      )}
      {...rest}
    />
  );
};
