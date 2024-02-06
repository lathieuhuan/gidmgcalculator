import clsx from "clsx";
import { ReactNode, HTMLAttributes } from "react";
import "./styles.scss";

interface ItemCaseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  chosen?: boolean;
}
export const ItemCase = ({ className, chosen, children, ...rest }: ItemCaseProps) => {
  return (
    <div className={clsx("item-case", chosen && "item-case_chosen", className)} {...rest}>
      {children}
    </div>
  );
};
