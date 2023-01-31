import clsx from "clsx";
import ReactDOM from "react-dom";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { useCloseWithEsc } from "@Src/hooks";
import { ModalBody } from "./ModalBody";

export interface ModalControl {
  active?: boolean;
  state?: "open" | "close" | "hidden";
  onClose: () => void;
}

interface ModalProps extends ModalControl {
  className?: string;
  style?: CSSProperties;
  withDefaultStyle?: boolean;
  children: ReactNode;
}
export function Modal({ active, state: stateProp, onClose, ...others }: ModalProps) {
  const [state, setState] = useState({
    active: false,
    animate: false,
    visible: true,
  });
  const modalState = stateProp || (active ? "open" : "close");

  const closeModal = () => {
    setState((prev) => ({ ...prev, animate: false }));

    setTimeout(() => {
      setState((prev) => ({ ...prev, active: false }));
      onClose();
    }, 150);
  };

  useEffect(() => {
    if (modalState === "open") {
      setState((prev) => ({
        ...prev,
        active: true,
        visible: true,
      }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, animate: true }));
      }, 50);
    } //
    else if (state.active) {
      if (modalState === "close") {
        closeModal();
      } else if (modalState === "hidden") {
        setState((prev) => ({ ...prev, animate: false }));

        setTimeout(() => {
          setState((prev) => ({ ...prev, visible: false }));
        }, 150);
      }
    }
  }, [modalState]);

  useCloseWithEsc(() => {
    if (modalState === "open") {
      closeModal();
    }
  });

  return state.active
    ? ReactDOM.createPortal(
        <div className={"fixed full-stretch z-50" + (state.visible ? "" : " invisible")}>
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
