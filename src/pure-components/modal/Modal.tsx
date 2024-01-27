import clsx, { ClassValue } from "clsx";
import ReactDOM from "react-dom";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Button, ButtonGroup, ButtonGroupItem, ButtonGroupProps } from "../button";

import "./styles.scss";

type ModalPreset = "small" | "large" | "custom";

const LARGE_HEIGHT_CLS = "large-modal-height";

const presetCls: Partial<Record<ModalPreset, ClassValue>> = {
  small: "small-modal",
  large: [LARGE_HEIGHT_CLS, "large-modal bg-dark-700"],
};

export interface ModalControl {
  active?: boolean;
  onClose: () => void;
}

type ModalState = {
  mounted: boolean;
  visible: boolean;
  movingDir: "OUT" | "IN";
};

interface ModalCoreProps extends ModalControl {
  state?: "open" | "close" | "hidden";
  /** Default to 'custom' */
  preset?: ModalPreset;
  /** Default to true */
  closable?: boolean;
  /** Default to true */
  closeOnMaskClick?: boolean;
  className?: ClassValue;
  style?: CSSProperties;
  children: ReactNode;
}
const ModalCore = ({
  active,
  closable = true,
  closeOnMaskClick = true,
  className,
  preset = "custom",
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
              "modal-transition w-full h-full bg-black",
              state.movingDir === "OUT" ? "opacity-60" : "opacity-20"
            )}
            onClick={closeOnMaskClick ? closeModal : undefined}
          />

          <div
            className={clsx(
              "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 modal-transition overflow-hidden",
              state.movingDir === "OUT" ? "opacity-100 scale-100" : "opacity-0 scale-95",
              presetCls[preset],
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

export interface ModalProps extends ModalCoreProps {
  title?: string;
  /** Default to true */
  withCloseButton?: boolean;
  bodyCls?: string;
}
const Modal = ({
  className,
  title,
  withCloseButton = true,
  closable = true,
  bodyCls,
  children,
  ...coreProps
}: ModalProps) => {
  return (
    <ModalCore
      {...coreProps}
      className={clsx(className, "rounded-lg shadow-white-glow", title && "flex flex-col")}
      closable={closable}
    >
      {title ? (
        <>
          <div className="mb-2 text-1.5xl text-orange-500 font-medium">{title}</div>
          <div className={clsx("grow", bodyCls)}>{children}</div>
        </>
      ) : (
        children
      )}

      {withCloseButton ? (
        <Button
          variant="default"
          size="custom"
          icon={<FaTimes className="text-lg" />}
          boneOnly
          disabled={!closable}
          className="absolute top-2 right-2 p-1.5"
          onClick={coreProps.onClose}
        />
      ) : null}
    </ModalCore>
  );
};

interface ModalActionsProps extends Pick<ButtonGroupProps, "className" | "justify"> {
  disabledConfirm?: boolean;
  focusConfirm?: boolean;
  /** Default to 'Cancel' */
  cancelText?: string;
  /** Default to 'Confirm' */
  confirmText?: string;
  cancelButtonProps?: Omit<ButtonGroupItem, "text" | "onClick">;
  confirmButtonProps?: Omit<ButtonGroupItem, "text" | "onClick">;
  moreActions?: ButtonGroupItem[];
  onCancel?: () => void;
  onConfirm?: () => void;
}
export const ModalActions = (props: ModalActionsProps) => {
  const { justify = "end", cancelText = "Cancel", confirmText = "Confirm" } = props;
  return (
    <ButtonGroup
      className={clsx("mt-4", props.className)}
      justify={justify}
      buttons={[
        { text: cancelText, onClick: props.onCancel, ...props.cancelButtonProps },
        ...(props.moreActions ?? []),
        {
          text: confirmText,
          variant: "positive",
          disabled: props.disabledConfirm,
          autoFocus: props.focusConfirm,
          onClick: props.onConfirm,
          ...props.confirmButtonProps,
        },
      ]}
    />
  );
};

function withModal<T>(
  Component: (props: T) => JSX.Element | null,
  modalProps?: Partial<Pick<ModalProps, "preset" | "withCloseButton" | "className">>
) {
  return (props: Pick<ModalProps, "active" | "closable" | "closeOnMaskClick" | "onClose"> & T): JSX.Element => {
    return (
      <Modal active={props.active} onClose={props.onClose} {...modalProps}>
        <Component {...props} />
      </Modal>
    );
  };
}

Modal.LARGE_HEIGHT_CLS = LARGE_HEIGHT_CLS;
Modal.Core = ModalCore;
Modal.Actions = ModalActions;
Modal.wrap = withModal;

export { Modal };
