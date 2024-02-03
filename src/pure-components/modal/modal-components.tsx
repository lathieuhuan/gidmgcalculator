import clsx from "clsx";
import { ButtonGroup, ButtonGroupItem, ButtonGroupProps } from "../button";

export const ModalCloseButton = (props: { disabled?: boolean; onClick?: () => void }) => {
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

export interface ModalHeaderProps {
  title?: React.ReactNode;
  withDivider?: boolean;
}
export const ModalHeader = ({ title, withDivider }: ModalHeaderProps) => {
  return (
    <div
      className={clsx(
        "mb-4 text-xl text-orange-500 font-semibold",
        withDivider && "pb-2 border-b border-solid border-dark-300"
      )}
    >
      {title}
    </div>
  );
};

export interface ModalActionsProps extends Pick<ButtonGroupProps, "className" | "justify"> {
  withDivider?: boolean;
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
  withDivider,
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

  return (
    <ButtonGroup
      className={clsx("mt-4", withDivider && "pt-4 border-t border-solid border-dark-300", className)}
      justify={justify}
      buttons={buttons}
    />
  );
};
