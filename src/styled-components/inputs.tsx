import clsx from "clsx";
import type { SelectHTMLAttributes, ButtonHTMLAttributes } from "react";
import { FaTimes } from "react-icons/fa";
import { buttonStyles, type ButtonProps } from "./utils";

export const Button = (props: ButtonProps) => {
  const { className, variant, noGlow, ...rest } = props;
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
  const { className, variant, noGlow, size = "h-8 w-8", ...rest } = props;
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
}
export const IconToggleButton = ({
  className,
  disabled,
  color = "text-black bg-lightgold",
  disabledColor = "text-lesser bg-transparent",
  ...rest
}: IconToggleButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-circle flex-center shrink-0",
        (!className || !className.includes("w-") || !className.includes("h-")) && "h-8 w-8",
        disabled ? disabledColor : `${color} glow-on-hover`,
        className
      )}
      disabled={disabled}
      {...rest}
    />
  );
};

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
