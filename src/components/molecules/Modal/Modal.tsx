import clsx from "clsx";
import ReactDOM from "react-dom";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { useCloseWithEsc } from "@Src/hooks";
import { ModalBody } from "./ModalBody";

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
export function Modal({ active, onClose, ...others }: ModalProps) {
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
          <ModalBody animate={state.animate} {...others} />
        </div>,
        document.querySelector("#root")!
      )
    : null;
}
