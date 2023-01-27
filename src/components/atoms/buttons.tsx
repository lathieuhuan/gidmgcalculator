import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
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

export interface CloseButtonProps {
  size?: string;
  noGlow?: boolean;
  boneOnly?: boolean;
  className?: string;
  onClick?: () => void;
}
export const CloseButton = ({ className, size, boneOnly, ...rest }: CloseButtonProps) => {
  if (boneOnly) {
    return (
      <IconButton
        className={"text-default hover:text-darkred text-xl " + className}
        size={size || "w-8 h-8"}
        variant="custom"
        {...rest}
      >
        <FaTimes />
      </IconButton>
    );
  }
  return (
    <IconButton className={className} size={size || "w-7 h-7"} variant="negative" {...rest}>
      <FaTimes />
    </IconButton>
  );
};
