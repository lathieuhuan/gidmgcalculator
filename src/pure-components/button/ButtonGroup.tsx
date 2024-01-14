import clsx, { ClassValue } from "clsx";
import { Button, ButtonProps } from "./button";

type Justify = "start" | "center" | "end";
type Space = "default" | "wide";

const justifyCls: Partial<Record<Justify, string>> = {
  center: "justify-center",
  end: "justify-end",
};

const spaceCls: Partial<Record<Space, string>> = {
  default: "space-x-3",
};

export type ButtonGroupItem = Omit<ButtonProps, "children"> & {
  text: string;
};
interface ButtonGroupProps {
  className?: ClassValue;
  /** Default to 'center' */
  justify?: Justify;
  buttons: ButtonGroupItem[];
  /** Default to 'default' (12px) */
  space?: Space;
}
const ButtonGroup = ({ className, justify = "center", buttons, space = "default" }: ButtonGroupProps) => {
  return (
    <div className={clsx("flex", justifyCls[justify], spaceCls[space], className)}>
      {buttons.map(({ text, ...others }, i) => {
        return (
          <Button key={i} className="button-focus-shadow" {...others}>
            {text}
          </Button>
        );
      })}
    </div>
  );
};

export interface ConfirmButtonGroupProps extends Pick<ButtonGroupProps, "className" | "justify"> {
  disabledConfirm?: boolean;
  focusConfirm?: boolean;
  /** Default to 'Cancel' */
  cancelText?: string;
  /** Default to 'Confirm' */
  confirmText?: string;
  cancelButtonProps?: Omit<ButtonGroupItem, "text" | "onClick">;
  confirmButtonProps?: Omit<ButtonGroupItem, "text" | "onClick">;
  onCancel?: () => void;
  onConfirm?: () => void;
}
ButtonGroup.Confirm = ({
  disabledConfirm,
  focusConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  cancelButtonProps,
  confirmButtonProps,
  onCancel,
  onConfirm,
  ...props
}: ConfirmButtonGroupProps) => {
  return (
    <ButtonGroup
      buttons={[
        { text: cancelText, onClick: onCancel, ...cancelButtonProps },
        {
          text: confirmText,
          variant: "positive",
          disabled: disabledConfirm,
          autoFocus: focusConfirm,
          onClick: onConfirm,
          ...confirmButtonProps,
        },
      ]}
      {...props}
    />
  );
};

export { ButtonGroup };
