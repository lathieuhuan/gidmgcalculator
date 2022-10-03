import cn from "classnames";
import type { ButtonHTMLAttributes } from "react";

const bgColorByVariant = {
  positive: "bg-lightgold",
  neutral: "bg-green",
  negative: "bg-darkred",
  default: "bg-default",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  noGlow?: boolean;
  variant?: "positive" | "neutral" | "negative" | "default";
}
export const buttonStyles = ({ noGlow, disabled, variant = "default" }: ButtonProps) => {
  return cn(
    bgColorByVariant[variant],
    variant === "negative" ? "text-default" : "text-black",
    !noGlow && "glow-on-hover",
    disabled && "!opacity-50 cursor-default"
  );
};
