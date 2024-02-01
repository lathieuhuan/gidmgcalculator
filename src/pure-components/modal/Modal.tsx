import clsx from "clsx";
import { ModalCore, ModalCoreProps } from "./ModalCore";
import { ModalActions, ModalActionsProps, ModalCloseButton } from "./modal-components";

export interface ModalProps extends ModalCoreProps, Omit<ModalActionsProps, "className" | "justify" | "onCancel"> {
  title?: React.ReactNode;
  /** Default to true */
  withCloseButton?: boolean;
  withHeaderDivider?: boolean;
  withActions?: boolean;
  bodyCls?: string;
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
      className={clsx("p-4 flex flex-col", !coreProps.preset && "rounded-lg shadow-white-glow", className)}
      closable={closable}
    >
      <div
        className={clsx(
          "mb-4 text-xl text-orange-500 font-semibold",
          withHeaderDivider && "pb-2 border-b border-solid border-dark-300"
        )}
      >
        {title}
      </div>
      <div className={bodyCls}>{typeof children === "function" ? children() : children}</div>

      {withActions && (
        <ModalActions
          {...{
            withDivider: true,
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

Modal.LARGE_HEIGHT_CLS = "large-modal-height";
Modal.Core = ModalCore;
Modal.CloseX = ModalCloseButton;
Modal.Actions = ModalActions;
Modal.wrap = withModal;

export { Modal };
