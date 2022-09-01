import cn from "classnames";
import { CSSProperties, ReactNode, useCallback, useEffect, useState } from "react";
import { useCloseWithEsc } from "@Hooks/useCloseWithEsc";
import { ButtonBar } from "@Components/minors";
import styles from "./styles.module.scss";

export interface ModalControl {
  active: boolean;
  onClose: () => void;
}

interface ModalProps extends ModalControl {
  className?: string;
  style?: CSSProperties;
  isCustom?: boolean;
  children: ReactNode;
}
export function Modal({ active, className, style, isCustom, children, onClose }: ModalProps) {
  const [state, setState] = useState({
    active: false,
    animate: false,
  });

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, animate: false }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, active: false }));
      onClose();
    }, 160);
  }, [onClose]);

  useEffect(() => {
    if (active && !state.active) {
      setState((prev) => ({ ...prev, active: true }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, animate: true }));
      }, 50);
    } else if (active === false && state.active) {
      closeModal();
    }
  }, [active, state.active]);

  useCloseWithEsc(closeModal);

  return state.active ? (
    <div className="fixed full-stretch z-50">
      <div
        className={cn(
          "w-full h-full bg-black transition duration-150 ease-linear",
          state.animate ? "opacity-60" : "opacity-20"
        )}
        onClick={closeModal}
      />
      <div
        className={cn(
          "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 shadow-white-glow transition duration-150 ease-linear",
          state.animate ? "opacity-100 scale-100" : "opacity-0 scale-95",
          !isCustom && cn("rounded-lg bg-darkblue-2", styles["content-wrapper"]),
          className
        )}
        style={style}
      >
        {children}
      </div>
    </div>
  ) : null;
}
