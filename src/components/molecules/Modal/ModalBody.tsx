import clsx from "clsx";
import { CSSProperties, ReactNode } from "react";
import styles from "./styles.module.scss";

interface ModalBodyProps {
  className?: string;
  style?: CSSProperties;
  animate: boolean;
  withDefaultStyle?: boolean;
  children: ReactNode;
}
export const ModalBody = ({
  className,
  animate,
  withDefaultStyle,
  style,
  children,
}: ModalBodyProps) => {
  return (
    <div
      className={clsx(
        "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transition duration-150 ease-linear",
        animate ? "opacity-100 scale-100" : "opacity-0 scale-95",
        withDefaultStyle &&
          "h-large-modal shadow-white-glow rounded-lg bg-darkblue-2 " + styles["content-wrapper"],
        className
      )}
      style={{
        maxWidth: "95%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
