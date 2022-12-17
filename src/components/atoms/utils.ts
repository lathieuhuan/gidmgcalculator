import type { ButtonHTMLAttributes } from "react";

const bgColorByVariant: Record<string, string> = {
  positive: "bg-lightgold",
  neutral: "bg-green",
  negative: "bg-darkred",
  default: "bg-default",
};

const colorByVariant: Record<string, string> = {
  positive: "text-lightgold",
  neutral: "text-green",
  negative: "text-darkred",
  default: "text-default",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  boneOnly?: boolean;
  noGlow?: boolean;
  variant?: "positive" | "neutral" | "negative" | "default" | "custom";
}
export const buttonStyles = ({ boneOnly, noGlow, disabled, variant = "default" }: ButtonProps) => {
  return [
    boneOnly ? colorByVariant[variant] : bgColorByVariant[variant],
    boneOnly || variant === "custom" ? "" : variant === "negative" ? "text-default" : "text-black",
    disabled ? "opacity-50 cursor-default" : !noGlow && "glow-on-hover",
  ];
};
