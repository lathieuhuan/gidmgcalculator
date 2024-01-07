import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import { StringRecord } from "@Src/types";

const bgColorByVariant: StringRecord = {
  positive: "bg-yellow-400",
  neutral: "bg-green-300",
  negative: "bg-red-600",
  default: "bg-light-400",
};

type ButtonVariant = "default" | "positive" | "negative" | "neutral" | "custom";

type ButtonShape = "rounded" | "square";

type ButtonSize = "small" | "medium";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  size?: "small" | "medium";
  boneOnly?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}
export const Button = ({
  variant = "default",
  shape = "rounded",
  size = "medium",
  boneOnly,
  icon,
  iconPosition = "start",
  children,
  className,
  ...rest
}: ButtonProps) => {
  const colorMap: Partial<Record<ButtonVariant, string>> = {
    default: "bg-light-400 text-black",
    positive: "bg-yellow-400 text-black",
    negative: "bg-red-600 text-light-400",
    neutral: "bg-green-300 text-black",
  };

  const boneColorMap: Partial<Record<ButtonVariant, string>> = {
    default: "text-light-400",
    positive: "text-yellow-400",
    negative: "text-red-600",
    neutral: "text-green-300",
  };

  const shapeMap: Record<ButtonShape, string> = {
    square: "rounded",
    rounded: "rounded-full",
  };

  const sizeMap: Record<ButtonSize, string> = {
    small: "px-2 py-0.5",
    medium: "px-3 py-1.5",
  };

  const iconSizeMap: Record<ButtonSize, string> = {
    small: "p-[5px]",
    medium: "p-2",
  };

  const classes = [
    "text-sm font-bold flex-center",
    iconPosition === "end" && "flex-row-reverse",
    boneOnly ? boneColorMap[variant] : colorMap[variant],
    shapeMap[shape],
    rest.disabled ? "opacity-50" : "glow-on-hover",
    className,
  ].concat(children ? [size === "small" ? "space-x-1" : "space-x-1.5", sizeMap[size]] : iconSizeMap[size]);

  return (
    <button type="button" className={clsx(classes, "")} {...rest}>
      {icon ? <span className={clsx("shrink-0", !children && size === "medium" && "text-base")}>{icon}</span> : null}
      {children ? <span>{children}</span> : null}
    </button>
  );
};

interface ToggleButtonProps extends Omit<ButtonProps, "boneOnly"> {
  active?: boolean;
}
export const ToggleButton = ({ active, variant = "default", ...rest }: ToggleButtonProps) => {
  return (
    <Button
      {...rest}
      variant="custom"
      className={clsx(active && [bgColorByVariant[variant], variant === "negative" ? "text-light-400" : "text-black"])}
    />
  );
};

export interface CloseButtonProps
  extends Pick<ButtonProps, "className" | "boneOnly" | "size" | "onClick" | "disabled"> {
  //
}
export const CloseButton = ({ boneOnly, className, ...rest }: CloseButtonProps) => {
  return (
    <Button
      variant={boneOnly ? "default" : "negative"}
      icon={<FaTimes />}
      boneOnly={boneOnly}
      className={clsx(className, boneOnly && "hover:text-red-600")}
      {...rest}
    />
  );
};
