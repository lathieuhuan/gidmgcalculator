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
        "px-6 py-1 rounded-2xl shadow-common font-bold",
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
    <div>
      <select
        className={cn("w-full h-full block bg-transparent outline-none", className)}
        {...rest}
      />
    </div>
  );
};
