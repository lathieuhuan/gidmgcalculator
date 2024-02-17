import clsx, { ClassValue } from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

type ButtonVariant = "default" | "positive" | "negative" | "active" | "custom";

type ButtonShape = "rounded" | "square";

type ButtonSize = "small" | "medium" | "large" | "custom";

const colorCls: Partial<Record<ButtonVariant, string>> = {
  default: "bg-light-600 text-black",
  positive: "bg-yellow-400 text-black",
  negative: "bg-red-600 text-light-400",
  active: "bg-green-200 text-black",
};

const boneColorCls: Partial<Record<ButtonVariant, string>> = {
  default: "text-light-400",
  positive: "text-yellow-400",
  negative: "text-red-600",
  active: "text-green-200",
};

const shapeCls: Record<ButtonShape, string> = {
  square: "rounded",
  rounded: "rounded-full",
};

const sizeCls: Partial<Record<ButtonSize, string>> = {
  small: "px-2 py-0.5",
  medium: "px-3 py-1.5",
  // large: "px-4 ",
};

const iconSizeCls: Partial<Record<ButtonSize, string>> = {
  small: "p-[5px]",
  medium: "p-2",
  large: "p-2",
};

const svgSizeCls: Partial<Record<ButtonSize, string>> = {
  medium: "text-base",
  large: "text-xl",
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: ClassValue;
  /** Default to 'default' */
  variant?: ButtonVariant;
  /** Default to 'rounded' */
  shape?: ButtonShape;
  /** Default to 'medium' */
  size?: ButtonSize;
  boneOnly?: boolean;
  icon?: ReactNode;
  /** Default to 'start' */
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
  const classes = [
    "text-sm flex-center font-bold not whitespace-nowrap",
    iconPosition === "end" && "flex-row-reverse",
    boneOnly ? boneColorCls[variant] : [colorCls[variant], "shadow-common"],
    shapeCls[shape],
    rest.disabled ? "opacity-50" : "glow-on-hover",
    className,
  ].concat(children ? [size === "small" ? "space-x-1" : "space-x-1.5", sizeCls[size]] : iconSizeCls[size]);

  return (
    <button type="button" className={clsx(classes)} {...rest}>
      {icon ? <span className={clsx("shrink-0", !children && svgSizeCls[size])}>{icon}</span> : null}
      {children ? <span>{children}</span> : null}
    </button>
  );
};

export const CloseButton = ({
  boneOnly,
  ...rest
}: Pick<ButtonProps, "className" | "boneOnly" | "size" | "onClick" | "disabled">) => {
  return <Button variant={boneOnly ? "default" : "negative"} icon={<FaTimes />} boneOnly={boneOnly} {...rest} />;
};
