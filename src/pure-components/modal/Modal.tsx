import clsx from "clsx";
import { ButtonGroup, ButtonGroupItem, ButtonGroupProps } from "../button";
import { ModalCore, ModalCoreProps } from "./ModalCore";

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
      <div className={bodyCls}>{children}</div>
      {withActions && (
        <ModalActions
          {...{
            className: "pt-4 border-t border-solid border-dark-300",
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

      {withCloseButton ? <ModalCloseX disabled={!closable} onClick={coreProps.onClose} /> : null}
    </ModalCore>
  );
};

const ModalCloseX = (props: { disabled?: boolean; onClick?: () => void }) => {
  return (
    <button
      type="button"
      className="w-8 h-8 flex-center absolute top-1 right-1 text-light-900 text-1.5xl glow-on-hover"
      {...props}
    >
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    </button>
  );
};

export interface ModalActionsProps extends Pick<ButtonGroupProps, "className" | "justify"> {
  disabledConfirm?: boolean;
  focusConfirm?: boolean;
  /** Default to true */
  showCancel?: boolean;
  /** For inside form */
  formId?: string;
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
export const ModalActions = ({
  className,
  justify = "end",
  disabledConfirm,
  focusConfirm,
  showCancel = true,
  cancelText = "Cancel",
  confirmText = "Confirm",
  formId,
  cancelButtonProps,
  confirmButtonProps,
  moreActions = [],
  onCancel,
  onConfirm,
}: ModalActionsProps) => {
  const buttons: ButtonGroupItem[] = [
    ...moreActions,
    {
      text: confirmText,
      variant: "positive",
      type: formId ? "submit" : "button",
      form: formId,
      disabled: disabledConfirm,
      autoFocus: focusConfirm,
      onClick: onConfirm,
      ...confirmButtonProps,
    },
  ];

  if (showCancel) {
    buttons.unshift({
      text: cancelText,
      onClick: onCancel,
      ...cancelButtonProps,
    });
  }

  return <ButtonGroup className={clsx("mt-4", className)} justify={justify} buttons={buttons} />;
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
Modal.CloseX = ModalCloseX;
Modal.Actions = ModalActions;
Modal.wrap = withModal;

export { Modal };
