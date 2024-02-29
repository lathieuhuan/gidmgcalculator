import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import styles from "./styles.module.scss";

interface WarehouseLayoutProps {
  bodyStyle?: CSSProperties;
  actions?: ReactNode;
  children: ReactNode;
}
export const WarehouseLayout = ({ bodyStyle, actions, children }: WarehouseLayoutProps) => {
  return (
    <div className="py-4 xm:py-6 h-full flex-center bg-dark-700">
      <div className={`relative h-full pt-12 xm:pt-14 ${styles.warehouse}`} style={bodyStyle}>
        {actions ? <div className={clsx("absolute top-0 left-0 pl-2 w-full h-10")}>{actions}</div> : null}

        <div className={`h-full flex gap-2 hide-scrollbar`}>{children}</div>
      </div>
    </div>
  );
};
