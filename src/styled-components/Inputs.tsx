import cn from "classnames";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { FaTimes } from "react-icons/fa";
import { buttonStyles, type ButtonProps } from "./utils";

export const Button = (props: ButtonProps) => {
  const { className, variant, noGlow, disabled, ...rest } = props;
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
  const { className, variant, noGlow, disabled, ...rest } = props;
  const withDefaultSize = !className || !className.includes("w-") || !className.includes("h-");
  return (
    <button
      type="button"
      className={cn(
        "rounded-full flex-center",
        withDefaultSize && "h-8 w-8",
        buttonStyles(props),
        className
      )}
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
