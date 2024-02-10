import clsx from "clsx";
import { ReactNode, HTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface ItemCaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: (className: string) => ReactNode;
  chosen?: boolean;
}
export const ItemCase = ({ className, chosen, children, onMouseDown, onMouseUp, ...rest }: ItemCaseProps) => {
  return (
    <div
      className={clsx(styles["item-case"], chosen && styles.chosen, className)}
      onMouseDown={(e) => {
        e.currentTarget.classList.add(styles.clicked);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        e.currentTarget.classList.remove(styles.clicked);
        onMouseUp?.(e);
      }}
      {...rest}
    >
      {children(styles["item-body"])}
    </div>
  );
};
