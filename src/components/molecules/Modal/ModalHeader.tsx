import clsx from "clsx";
import type { InsHTMLAttributes, ParamHTMLAttributes } from "react";
import { FaFilter } from "react-icons/fa";
import { CloseButton, CloseButtonProps } from "@Components/atoms";

function ModalHeader({ className, ...rest }: InsHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("relative h-full pl-6 flex items-center rounded-t-lg bg-orange", className)}
      {...rest}
    />
  );
}

ModalHeader.Text = ({ className, ...rest }: ParamHTMLAttributes<HTMLParagraphElement>) => {
  return (
    <div className="w-full h-11 flex-center">
      <p
        className={clsx(
          "pt-1 pr-10 hidden md1:block capitalize text-1.5xl text-center font-bold text-black",
          className
        )}
        {...rest}
      />
    </div>
  );
};

ModalHeader.CloseButton = (props: CloseButtonProps) => {
  return (
    <CloseButton
      className={clsx("absolute top-2 right-2 !bg-black", props.className)}
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
    <button
      className={clsx(
        "absolute top-1/2 left-5 w-7 h-7 -mt-3.5 rounded-circle flex-center text-sm !bg-black",
        props.active ? "text-green" : "text-default",
        props.className
      )}
      onClick={props.onClick}
    >
      <FaFilter />
    </button>
  );
};

export { ModalHeader };
