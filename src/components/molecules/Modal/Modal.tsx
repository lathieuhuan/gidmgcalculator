import clsx from "clsx";
import ReactDOM from "react-dom";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { useCloseWithEsc } from "@Src/hooks";
import styles from "./styles.module.scss";

export interface ModalControl {
  active: boolean;
  onClose: () => void;
}

interface ModalProps extends ModalControl {
  className?: string;
  style?: CSSProperties;
  withDefaultStyle?: boolean;
  children: ReactNode;
}
export function Modal({
  active,
  className,
  style,
  withDefaultStyle,
  children,
  onClose,
}: ModalProps) {
  const [state, setState] = useState({
    active: false,
    animate: false,
  });

  const closeModal = () => {
    setState((prev) => ({ ...prev, animate: false }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, active: false }));
      onClose();
    }, 150);
  };

  useEffect(() => {
    if (active && !state.active) {
      setState((prev) => ({ ...prev, active: true }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, animate: true }));
      }, 50);
    } else if (!active && state.active) {
      closeModal();
    }
  }, [active, state.active]);

  useCloseWithEsc(() => active && closeModal());

  return state.active
    ? ReactDOM.createPortal(
        <div className="fixed full-stretch z-50">
          <div
            className={clsx(
              "w-full h-full bg-black transition duration-150 ease-linear",
              state.animate ? "opacity-60" : "opacity-20"
            )}
            onClick={closeModal}
          />
          <div
            className={clsx(
              "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transition duration-150 ease-linear",
              state.animate ? "opacity-100 scale-100" : "opacity-0 scale-95",
              withDefaultStyle &&
                "shadow-white-glow rounded-lg bg-darkblue-2 " + styles["content-wrapper"],
              className
            )}
            style={{
              maxWidth: "95%",
              ...style,
            }}
          >
            {children}
          </div>
        </div>,
        document.querySelector("#root")!
      )
    : null;
}
