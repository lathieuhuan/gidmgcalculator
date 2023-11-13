import clsx from "clsx";
import ReactDOM from "react-dom";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

import { ModalBody } from "./ModalBody";
import { CloseButton, type CloseButtonProps } from "../button";

export interface ModalControl {
  active?: boolean;
  closable?: boolean;
  closeOnMaskClick?: boolean;
  state?: "open" | "close" | "hidden";
  onClose: () => void;
}

interface ModalProps extends ModalControl {
  className?: string;
  style?: CSSProperties;
  withDefaultStyle?: boolean;
  children: ReactNode;
}
export const Modal = ({
  active,
  closable = true,
  closeOnMaskClick = true,
  state: stateProp,
  onClose,
  ...rest
}: ModalProps) => {
  const [state, setState] = useState({
    active: false,
    animate: false,
    visible: true,
  });
  const modalState = stateProp || (active ? "open" : "close");

  const closeModal = () => {
    if (closable) {
      setState((prev) => ({ ...prev, animate: false }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, active: false }));
        onClose();
      }, 150);
    }
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

  useEffect(() => {
    const handlePressEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalState === "open") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handlePressEsc, true);
    return () => document.removeEventListener("keydown", handlePressEsc, true);
  }, [modalState]);

  return state.active
    ? ReactDOM.createPortal(
        <div className={"fixed full-stretch z-50" + (state.visible ? "" : " invisible")}>
          <div
            className={clsx(
              "w-full h-full bg-black transition duration-150 ease-linear",
              state.animate ? "opacity-60" : "opacity-20"
            )}
            onClick={closeOnMaskClick ? closeModal : undefined}
          />
          <ModalBody animate={state.animate} {...rest} />
        </div>,
        document.querySelector("#root")!
      )
    : null;
};

export function withModal<T>(
  Component: (props: T) => JSX.Element | null,
  modalProps?: Partial<Omit<ModalProps, "active" | "onClose">>,
  closeButton?: Partial<Omit<CloseButtonProps, "onClick">>
) {
  return (props: ModalControl & T): JSX.Element => {
    return (
      <Modal active={props.active} onClose={props.onClose} closeOnMaskClick={props.closeOnMaskClick} {...modalProps}>
        {closeButton ? <CloseButton {...closeButton} onClick={props.onClose} /> : null}
        <Component {...props} />
      </Modal>
    );
  };
}
