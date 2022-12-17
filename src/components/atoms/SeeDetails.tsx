import { HTMLAttributes } from "react";

interface SeeDetailsProps extends HTMLAttributes<HTMLParagraphElement> {
  active?: boolean;
}
export const SeeDetails = (props: SeeDetailsProps) => {
  const { className, active, ...rest } = props;
  return (
    <span
      className={
        "cursor-pointer " +
        (active ? "text-green " : "text-default hover:text-lightgold ") +
        className
      }
      {...rest}
    >
      See details
    </span>
  );
};
