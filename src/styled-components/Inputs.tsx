import cn from "classnames";
import type { InputHTMLAttributes } from "react";
import { FaTimes } from "react-icons/fa";
import { buttonStyles, type ButtonProps } from "./utils";

export const Button = (props: ButtonProps) => {
  const { className, variant, noGlow, disabled, ...rest } = props;
  return (
    <button
      type="button"
      className={cn(
        "px-4 py-1 rounded-2xl shadow-common font-bold",
        buttonStyles(props),
        className
      )}
      {...rest}
    />
  );
};

export const IconButton = (props: ButtonProps) => {
  const { className, variant, noGlow, disabled, ...rest } = props;
  return (
    <button
      type="button"
      className={cn(
        "rounded-full h-8 w-8 flex-center",
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
    <IconButton
      className={cn("w-7 h-7", className)}
      variant="negative"
      {...rest}
    >
      <FaTimes />
    </IconButton>
  );
};

export const Checkbox = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const { className, type, ...rest } = props;
  return (
    <input type="checkbox" className={cn("scale-150", className)} {...rest} />
  );
};
