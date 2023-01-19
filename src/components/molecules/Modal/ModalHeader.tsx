import type { InsHTMLAttributes, ParamHTMLAttributes } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { CloseButton, CloseButtonProps, IconButton } from "@Components/atoms";

const ModalHeader = ({ className = "", ...rest }: InsHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={"relative h-full pl-6 flex items-center rounded-t-lg bg-orange " + className}
      {...rest}
    />
  );
};

ModalHeader.Text = ({ className = "", ...rest }: ParamHTMLAttributes<HTMLParagraphElement>) => {
  return (
    <div className="w-full h-11 flex-center">
      <p
        className={
          "pt-1 pr-10 hidden md1:block capitalize text-1.5xl text-center font-bold text-black " +
          className
        }
        {...rest}
      />
    </div>
  );
};

ModalHeader.CloseButton = ({ className = "", ...rest }: CloseButtonProps) => {
  return (
    <IconButton
      className={"absolute top-2 right-2 text-black text-xl " + className}
      variant="custom"
      {...rest}
    >
      <FaTimes />
    </IconButton>
  );
};

interface FilterButtonProps {
  active?: boolean;
  className?: string;
  onClick?: () => void;
}
ModalHeader.FilterButton = (props: FilterButtonProps) => {
  return (
    <button
      className={
        "absolute top-1/2 left-5 w-7 h-7 -mt-3.5 rounded-circle flex-center text-sm !bg-black " +
        (props.active ? "text-green " : "text-default ") +
        (props.className || "")
      }
      onClick={props.onClick}
    >
      <FaFilter />
    </button>
  );
};

export { ModalHeader };
