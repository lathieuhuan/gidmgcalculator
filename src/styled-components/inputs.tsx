import clsx from "clsx";
import type { SelectHTMLAttributes, ButtonHTMLAttributes } from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { buttonStyles, type ButtonProps } from "./utils";

export const Button = (props: ButtonProps) => {
  const { className, variant, noGlow, boneOnly, ...rest } = props;
  return (
    <button
      type="button"
      className={clsx(
        "px-4 py-1 rounded-2xl shadow-common text-base font-bold leading-base",
        buttonStyles(props),
        className
      )}
      {...rest}
    />
  );
};

export const IconButton = (props: ButtonProps & { size?: string }) => {
  const { className, variant, noGlow, boneOnly, size = "h-8 w-8", ...rest } = props;
  return (
    <button
      type="button"
      className={clsx("rounded-circle flex-center shrink-0", buttonStyles(props), size, className)}
      {...rest}
    />
  );
};

interface IconToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabledColor?: string;
  size?: string;
}
export const IconToggleButton = ({
  className,
  disabled,
  color = "text-black bg-lightgold",
  disabledColor = "text-lesser bg-transparent",
  size = "h-8 w-8",
  ...rest
}: IconToggleButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-circle flex-center shrink-0",
        size,
        disabled ? disabledColor : `${color} glow-on-hover`,
        className
      )}
      disabled={disabled}
      {...rest}
    />
  );
};

interface InfoSignProps {
  className?: string;
  active?: boolean;
  selfHover?: boolean;
  onClick?: () => void;
}
export const InfoSign = (props: InfoSignProps) => {
  if (props.active) {
    return <CloseButton className={clsx("text-sm", props.className)} size="h-6 w-6" />;
  }
  return (
    <button
      className={clsx(
        "h-6 w-6 text-2xl block rounded-circle",
        props.selfHover ? "hover:text-lightgold" : "group-hover:text-lightgold",
        props.className
      )}
      onClick={props.onClick}
    >
      <FaInfoCircle />
    </button>
  );
};

export const Select = ({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={clsx(
        "leading-base block outline-none",
        !className?.includes("bg-") && "bg-transparent",
        className
      )}
      {...rest}
    />
  );
};

// Level 2
export interface CloseButtonProps {
  size?: string;
  noGlow?: boolean;
  className?: string;
  onClick?: () => void;
}
export const CloseButton = ({ className, size = "w-7 h-7", ...rest }: CloseButtonProps) => {
  return (
    <IconButton className={className} size={size} variant="negative" {...rest}>
      <FaTimes />
    </IconButton>
  );
};

interface ButtonBarProps {
  className?: string;
  buttons: Array<{
    text: string;
    disabled?: boolean;
    variant?: "positive" | "negative" | "neutral" | "default";
    onClick?: () => void;
  }>;
  autoFocusIndex?: number;
}
export const ButtonBar = ({ className, buttons, autoFocusIndex }: ButtonBarProps) => {
  return (
    <div
      className={clsx(
        "flex justify-center",
        !className?.includes("space-x-") && "space-x-8",
        className
      )}
    >
      {buttons.map((button, i) => {
        return (
          <Button
            key={i}
            className="button-focus-shadow"
            disabled={button.disabled}
            variant={
              button.variant ||
              (i ? (i === buttons.length - 1 ? "positive" : "neutral") : "negative")
            }
            onClick={button.onClick}
            autoFocus={i === autoFocusIndex}
          >
            {button.text}
          </Button>
        );
      })}
    </div>
  );
};
