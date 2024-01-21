import clsx, { ClassValue } from "clsx";
import ReactDOM from "react-dom";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { CloseButton, type CloseButtonProps } from "../button";

import "./styles.scss";

const DEFAULT_HEIGHT_CLS = "large-modal-height";

export interface ModalControl {
  active?: boolean;
  /** Default to true */
  closable?: boolean;
  /** Default to true */
  closeOnMaskClick?: boolean;
  state?: "open" | "close" | "hidden";
  onClose: () => void;
}

type ModalState = {
  mounted: boolean;
  visible: boolean;
  movingDir: "OUT" | "IN";
};

interface ModalProps extends ModalControl {
  className?: ClassValue;
  style?: CSSProperties;
  withDefaultStyle?: boolean;
  children: ReactNode;
}
const Modal = ({
  active,
  closable = true,
  closeOnMaskClick = true,
  withDefaultStyle,
  className,
  style,
  state: stateProp,
  children,
  onClose,
}: ModalProps) => {
  const [state, setState] = useState<ModalState>({
    mounted: false,
    visible: true,
    movingDir: "IN",
  });
  const modalState = stateProp || (active ? "open" : "close");

  const closeModal = () => {
    if (closable) {
      setState((prev) => ({ ...prev, movingDir: "IN" }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, mounted: false }));
        onClose();
      }, 150);
    }
  };

  useEffect(() => {
    if (modalState === "open") {
      setState((prev) => ({
        ...prev,
        mounted: true,
        visible: true,
      }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, movingDir: "OUT" }));
      }, 50);
    } //
    else if (state.mounted) {
      if (modalState === "close") {
        closeModal();
      } else if (modalState === "hidden") {
        setState((prev) => ({ ...prev, movingDir: "IN" }));

        setTimeout(() => {
          setState((prev) => ({ ...prev, visible: false }));
        }, 150);
      }
    }

    const handlePressEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalState === "open") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handlePressEsc, true);

    return () => {
      document.removeEventListener("keydown", handlePressEsc, true);
    };
  }, [modalState]);

  return state.mounted
    ? ReactDOM.createPortal(
        <div className={"fixed full-stretch z-50" + (state.visible ? "" : " invisible")}>
          <div
            className={clsx(
              "w-full h-full bg-black transition duration-150 ease-linear",
              state.movingDir === "OUT" ? "opacity-60" : "opacity-20"
            )}
            onClick={closeOnMaskClick ? closeModal : undefined}
          />

          <div
            className={clsx(
              "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transition duration-150 ease-linear",
              state.movingDir === "OUT" ? "opacity-100 scale-100" : "opacity-0 scale-95",
              withDefaultStyle && [
                DEFAULT_HEIGHT_CLS,
                "shadow-white-glow rounded-lg bg-dark-700 default-modal-content-wrap",
              ],
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
};

function withModal<T>(
  Component: (props: T) => JSX.Element | null,
  modalProps?: Partial<Omit<ModalProps, "active" | "onClose">>,
  closeButtonProps?: Partial<Omit<CloseButtonProps, "onClick">>
) {
  return (props: ModalControl & T): JSX.Element => {
    return (
      <Modal active={props.active} onClose={props.onClose} closeOnMaskClick={props.closeOnMaskClick} {...modalProps}>
        {closeButtonProps ? <CloseButton {...closeButtonProps} onClick={props.onClose} /> : null}
        <Component {...props} />
      </Modal>
    );
  };
}

Modal.DEFAULT_HEIGHT_CLS = DEFAULT_HEIGHT_CLS;
Modal.SMALL_CLS = "small-modal rounded-lg shadow-white-glow overflow-hidden";
Modal.wrap = withModal;

export { Modal };
