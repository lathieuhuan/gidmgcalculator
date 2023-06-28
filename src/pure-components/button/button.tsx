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
  size?: "small" | "medium";
  boneOnly?: boolean;
  paddingCls?: string | null;
  icon?: ReactElement;
  iconPosition?: "start" | "end";
}
export const Button = ({
  variant = "default",
  shape = "circular",
  size = "medium",
  boneOnly,
  paddingCls,
  icon,
  iconPosition = "start",
  children,
  ...rest
}: ButtonProps) => {
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

  const getPaddingCls = (defaultCls: string) => {
    return paddingCls === null ? "" : paddingCls || defaultCls;
  };

  if (children) {
    const iconRender = <span className="shrink-0">{icon}</span>;

    return (
      <button
        type="button"
        {...rest}
        className={clsx(classes, "space-x-1.5", buttonSize[size], getPaddingCls(buttonPadding[shape][size]))}
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
          ? [getPaddingCls(iconButtonPadding.boneOnly[size]), iconButtonSize.boneOnly[size]]
          : [getPaddingCls(iconButtonPadding.withFlesh[size]), iconButtonSize.withFlesh[size]]
      )}
    >
      {icon}
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
      className={clsx(active && [bgColorByVariant[variant], variant === "negative" ? "text-default" : "text-black"])}
    />
  );
};

export interface CloseButtonProps extends Omit<ButtonProps, "icon" | "children" | "variant"> {
  hoverRed?: boolean;
}
export const CloseButton = ({ hoverRed = true, ...rest }: CloseButtonProps) => {
  if (rest.boneOnly) {
    return (
      <Button
        variant="default"
        icon={<FaTimes className="shrink-0" />}
        {...rest}
        className={rest.className + (hoverRed ? " hover:text-darkred" : "")}
      />
    );
  }
  return (
    <Button
      variant="negative"
      icon={<FaTimes className={"shrink-0 " + (rest.size === "small" ? "text-base" : "text-lg")} />}
      {...rest}
      style={{
        ...(rest.paddingCls === null ? undefined : { padding: rest.size === "small" ? 5 : 7 }),
        ...rest.style,
      }}
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
    return (
      <CloseButton
        className={clsx("w-6 h-6", props.className)}
        size="small"
        paddingCls={null}
        onClick={props.onClick}
      />
    );
  }
  return (
    <Button
      className={clsx(props.selfHover ? "hover:text-lightgold" : "group-hover:text-lightgold", props.className)}
      boneOnly
      paddingCls={null}
      icon={<FaInfoCircle className="text-2xl" />}
      onClick={props.onClick}
    />
  );
};
