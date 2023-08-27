import clsx from "clsx";
import { CSSProperties } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const sizeCls = {
  small: "text-lg",
  medium: "text-2xl",
  large: "text-3.5xl",
};

interface LoadingIconProps {
  className?: string;
  style?: CSSProperties;
  active?: boolean;
  size?: "small" | "medium" | "large";
}
export const LoadingIcon = ({ active = true, size = "medium", className, ...rest }: LoadingIconProps) => {
  return active ? (
    <AiOutlineLoading3Quarters className={clsx("animate-spin", sizeCls[size], className)} {...rest} />
  ) : null;
};
