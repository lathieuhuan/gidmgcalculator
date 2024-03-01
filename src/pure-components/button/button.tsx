import clsx, { ClassValue } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "positive" | "negative" | "active" | "custom";

type ButtonShape = "rounded" | "square";

type ButtonSize = "small" | "medium" | "large" | "custom";

const colorCls: Partial<Record<ButtonVariant, string>> = {
  default: "bg-light-600 text-black",
  positive: "bg-yellow-400 text-black",
  negative: "bg-red-600 text-light-100",
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
  small: "w-6 h-6 text-sm",
  medium: "w-8 h-8 text-base",
  large: "w-9 h-9 text-xl",
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
    "flex-center font-bold whitespace-nowrap",
    boneOnly ? boneColorCls[variant] : [colorCls[variant], "shadow-common"],
    shapeCls[shape],
    rest.disabled ? "opacity-50" : "glow-on-hover",
    className,
  ];

  if (icon && !children) {
    return (
      <button type="button" className={clsx("shrink-0", classes, iconSizeCls[size])} {...rest}>
        {icon}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={clsx(
        "text-sm",
        classes,
        iconPosition === "end" && "flex-row-reverse",
        size === "small" ? "space-x-1" : "space-x-1.5",
        sizeCls[size]
      )}
      {...rest}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children ? <span>{children}</span> : null}
    </button>
  );
};

interface CloseIconProps {
  className?: string;
}
const CloseIcon = (props: CloseIconProps) => {
  return (
    <svg {...props} viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </svg>
  );
};

const closeIconSizeCls: Partial<Record<ButtonSize, string>> = {
  small: "text-base",
  medium: "text-1.5xl",
  large: "text-2xl",
};

export const CloseButton = ({
  boneOnly,
  size = "medium",
  ...rest
}: Pick<ButtonProps, "className" | "boneOnly" | "size" | "onClick" | "disabled">) => {
  return (
    <Button
      variant={boneOnly ? "default" : "negative"}
      icon={<CloseIcon className={closeIconSizeCls[size]} />}
      boneOnly={boneOnly}
      size={size}
      {...rest}
    />
  );
};
