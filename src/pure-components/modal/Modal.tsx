import clsx, { ClassValue } from "clsx";
import { ModalCore, ModalCoreProps } from "./ModalCore";
import { ModalActions, ModalActionsProps, ModalCloseButton, ModalHeader, ModalHeaderProps } from "./modal-components";

export interface ModalProps
  extends ModalCoreProps,
    Omit<ModalActionsProps, "className" | "justify" | "withDivider" | "onCancel"> {
  title?: React.ReactNode;
  /** Default to true */
  withCloseButton?: boolean;
  withHeaderDivider?: boolean;
  withFooterDivider?: boolean;
  withActions?: boolean;
  bodyCls?: ClassValue;
}
const Modal = ({
  className,
  title,
  withCloseButton = true,
  withHeaderDivider = true,
  withActions,
  closable = true,
  bodyCls,
  children,
  //
  disabledConfirm,
  focusConfirm,
  withFooterDivider = true,
  showCancel,
  cancelText,
  confirmText,
  formId,
  cancelButtonProps,
  confirmButtonProps,
  moreActions = [],
  onConfirm,
  ...coreProps
}: ModalProps) => {
  return (
    <ModalCore
      {...coreProps}
      className={clsx("flex flex-col", !coreProps.preset && "rounded-lg shadow-white-glow", className)}
      closable={closable}
    >
      <ModalHeader withDivider={withHeaderDivider}>{title}</ModalHeader>

      <div className={clsx("p-4 grow overflow-auto", bodyCls)}>
        {typeof children === "function" ? children() : children}
      </div>

      {withActions && (
        <ModalActions
          {...{
            className: "px-4",
            withDivider: withFooterDivider,
            disabledConfirm,
            focusConfirm,
            showCancel,
            cancelText,
            confirmText,
            formId,
            cancelButtonProps,
            confirmButtonProps,
            moreActions,
            onCancel: coreProps.onClose,
            onConfirm,
          }}
        />
      )}

      {withCloseButton ? <ModalCloseButton disabled={!closable} onClick={coreProps.onClose} /> : null}
    </ModalCore>
  );
};

function withModal<T>(
  Component: (props: T) => JSX.Element | null,
  modalProps?: Partial<Pick<ModalProps, "title" | "preset" | "withCloseButton" | "className">>
) {
  return (props: Pick<ModalProps, "active" | "closable" | "closeOnMaskClick" | "onClose"> & T): JSX.Element => {
    return (
      <Modal active={props.active} onClose={props.onClose} {...modalProps}>
        <Component {...props} />
      </Modal>
    );
  };
}

function withCoreModal<T>(
  Component: (props: T) => JSX.Element | null,
  modalProps?: Partial<Pick<ModalCoreProps, "preset" | "className">>
) {
  return (props: Pick<ModalProps, "active" | "closable" | "closeOnMaskClick" | "onClose"> & T): JSX.Element => {
    return (
      <ModalCore active={props.active} onClose={props.onClose} {...modalProps}>
        <Component {...props} />
      </ModalCore>
    );
  };
}

Modal.LARGE_HEIGHT_CLS = "large-modal-height";
Modal.Core = ModalCore;
Modal.Header = ModalHeader;
Modal.Actions = ModalActions;
Modal.CloseButton = ModalCloseButton;
Modal.wrap = withModal;
Modal.bareWrap = withCoreModal;

export { Modal };
