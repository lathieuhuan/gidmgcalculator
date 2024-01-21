import clsx from "clsx";
import { cloneElement, useRef } from "react";
import { ButtonGroup, ButtonGroupItem, ConfirmButtonGroupProps } from "../button";
import { Modal } from "./Modal";

export interface ConfirmModalBodyProps extends Omit<ConfirmButtonGroupProps, "className" | "justify"> {
  message: string | JSX.Element;
  /** Default to 'bg-dark-500' */
  bgColorCls?: string;
  /** Default to true */
  closeOnButtonClick?: boolean;
  onlyConfirm?: boolean;
  /** Override config for cancel & confirm buttons */
  buttons?: ButtonGroupItem[];
  onClose: () => void;
}
export const ConfirmModalBody = ({
  bgColorCls = "bg-dark-500",
  closeOnButtonClick = true,
  onlyConfirm,
  message,
  buttons,
  onClose,
  onCancel,
  onConfirm,
  ...buttonGroupProps
}: ConfirmModalBodyProps) => {
  const messageRef = useRef(cloneElement(<p className="py-2 text-center text-xl text-light-400">{message}</p>));

  const finalButtons: ButtonGroupItem[] = buttons
    ? buttons.map((button) => ({
        ...button,
        onClick: (e) => {
          button.onClick?.(e);
          closeOnButtonClick && onClose();
        },
      }))
    : [];

  const handleCancel = () => {
    onCancel?.();
    closeOnButtonClick && onClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
    closeOnButtonClick && onClose();
  };

  if (!buttons && onlyConfirm) {
    finalButtons.push({
      text: "Confirm",
      variant: "positive",
      autoFocus: true,
      onClick: handleConfirm,
      ...buttonGroupProps.confirmButtonProps,
    });
  }

  const buttonsRef = useRef(finalButtons);

  return (
    <div className={clsx("p-4", bgColorCls)}>
      {messageRef.current}
      {buttonsRef.current.length ? (
        <ButtonGroup className="mt-4 flex-wrap" buttons={buttonsRef.current} />
      ) : (
        <ButtonGroup.Confirm
          className="mt-4 flex-wrap"
          {...buttonGroupProps}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export const ConfirmModal = Modal.wrap(ConfirmModalBody, { className: Modal.SMALL_CLS });
