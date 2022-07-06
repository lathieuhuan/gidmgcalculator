import cn from "classnames";
import type { ButtonHTMLAttributes } from "react";

const bgColorByVariant = {
  positive: "bg-lightgold",
  neutral: "bg-green",
  negative: "bg-darkred",
  default: "bg-default",
};

type Variant = "positive" | "neutral" | "negative" | "default";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  noGlow?: boolean;
  variant?: Variant;
}
export const buttonStyles = (args: ButtonProps) => {
  const { noGlow, disabled, variant = "default" } = args;
  return cn(
    bgColorByVariant[variant],
    variant === "negative" ? "text-white" : "text-black",
    !noGlow && "glow-on-hover",
    disabled && "!opacity-50 cursor-default"
  );
};
