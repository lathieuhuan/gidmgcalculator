import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactElement } from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import type { StringRecord } from "@Src/types";

const bgColorByVariant: StringRecord = {
  positive: "bg-lightgold",
  neutral: "bg-green",
  negative: "bg-darkred",
  default: "bg-default",
};
const colorByVariant: StringRecord = {
  positive: "text-lightgold",
  neutral: "text-green",
  negative: "text-darkred",
  default: "text-default",
};

const buttonPadding = {
  circular: {
    small: "px-3 py-1",
    medium: "px-4 py-1.5",
  },
  rounded: {
    small: "px-2 py-1",
    medium: "px-3 py-1.5",
  },
};
const buttonSize = {
  small: "text-sm leading-4",
  medium: "text-base leading-5",
};

const iconButtonPadding = {
  withFlesh: {
    small: "p-1.5",
    medium: "p-2",
  },
  boneOnly: {
    small: "p-1",
    medium: "p-1.5",
  },
};
const iconButtonSize = {
  withFlesh: buttonSize,
  boneOnly: {
    small: "text-lg leading-5",
    medium: "text-xl leading-6",
  },
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "positive" | "neutral" | "negative" | "default" | "custom";
  shape?: "rounded" | "circular";
  boneOnly?: boolean;
  icon?: ReactElement;
  iconPosition?: "start" | "end";
}
const buttonStyles = ({ boneOnly, disabled, variant = "default" }: ButtonProps) => {
  return [
    variant === "custom" ? "" : boneOnly ? colorByVariant[variant] : bgColorByVariant[variant],
    boneOnly || variant === "custom" ? "" : variant === "negative" ? "text-default" : "text-black",
    disabled ? "opacity-50" : "glow-on-hover",
  ];
};

export const Button = ({
  variant = "default",
  shape = "circular",
  size = "medium",
  boneOnly,
  icon,
  iconPosition = "start",
  children,
  ...rest
}: ButtonProps & {
  size?: "small" | "medium";
}) => {
  const classes = [
    "font-bold flex-center",
    shape === "circular" ? "rounded-full" : "rounded",
    variant === "custom"
      ? ""
      : boneOnly
      ? colorByVariant[variant]
      : ["shadow-common", bgColorByVariant[variant], variant === "negative" ? "text-default" : "text-black"],
    rest.disabled ? "opacity-50" : "glow-on-hover",
    rest.className,
  ];

  if (children) {
    const iconRender = <span className="shrink-0">{icon}</span>;

    return (
      <button
        type="button"
        {...rest}
        className={clsx(classes, "space-x-1.5", buttonSize[size], buttonPadding[shape][size])}
      >
        {!!icon && iconPosition === "start" && iconRender}
        <span className={size === "small" ? "pt-0.5" : ""}>{children}</span>
        {!!icon && iconPosition === "end" && iconRender}
      </button>
    );
  }

  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        classes,
        boneOnly
          ? [iconButtonPadding.boneOnly[size], iconButtonSize.boneOnly[size]]
          : [iconButtonPadding.withFlesh[size], iconButtonSize.withFlesh[size]]
      )}
    >
      {icon}
    </button>
  );
};

export const IconButton = (props: Omit<ButtonProps, "icon"> & { size?: string }) => {
  const { className, variant, boneOnly, size = "h-8 w-8", ...rest } = props;
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
