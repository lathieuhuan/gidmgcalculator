import cn from "classnames";
import type { InputHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes } from "react";
import { FaTimes } from "react-icons/fa";
import { buttonStyles, type ButtonProps } from "./utils";

export const Button = (props: ButtonProps) => {
  const { className, variant, noGlow, ...rest } = props;
  return (
    <button
      type="button"
      className={cn(
        "px-4 py-1 rounded-2xl shadow-common text-base font-bold leading-base",
        buttonStyles(props),
        className
      )}
      {...rest}
    />
  );
};

export const IconButton = (props: ButtonProps) => {
  const { className, variant, noGlow, ...rest } = props;
  return (
    <button
      type="button"
      className={cn(
        "rounded-circle flex-center shrink-0",
        (!className || !className.includes("w-") || !className.includes("h-")) && "h-8 w-8",
        buttonStyles(props),
        className
      )}
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
      className={cn(
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
  noGlow?: boolean;
  className?: string;
  onClick?: () => void;
}
export const CloseButton = ({ className, ...rest }: CloseButtonProps) => {
  return (
    <IconButton className={cn("w-7 h-7", className)} variant="negative" {...rest}>
      <FaTimes />
    </IconButton>
  );
};

export const Checkbox = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const { className, type, ...rest } = props;
  return <input type="checkbox" className={cn("scale-150", className)} {...rest} />;
};

export const Select = ({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={cn(
        "leading-base block outline-none",
        !className?.includes("bg-") && "bg-transparent",
        className
      )}
      {...rest}
    />
  );
};
