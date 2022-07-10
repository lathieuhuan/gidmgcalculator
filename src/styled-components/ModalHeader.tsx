import cn from "classnames";
import type { InsHTMLAttributes } from "react";
import { FaFilter } from "react-icons/fa";
import { CloseButton, IconButton, type CloseButtonProps } from "./Inputs";

function ModalHeader(props: InsHTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn(
        "relative h-full pl-4 flex items-center rounded-t-lg bg-orange",
        className
      )}
      {...rest}
    />
  );
}

ModalHeader.CloseButton = (props: CloseButtonProps) => {
  return (
    <CloseButton
      className={cn("absolute top-2 right-2 !bg-black", props.className)}
      onClick={props.onClick}
    />
  );
};

interface FilterButtonProps {
  active?: boolean;
  className?: string;
  onClick?: () => void;
}
ModalHeader.FilterButton = (props: FilterButtonProps) => {
  return (
    <IconButton
      className={cn(
        "absolute top-1/2 left-5 w-7 h-7 -mt-3.5 text-sm !bg-black !text-white",
        props.active && "!text-green",
        props.className
      )}
      onClick={props.onClick}
    >
      <FaFilter />
    </IconButton>
  );
};

export default ModalHeader;
