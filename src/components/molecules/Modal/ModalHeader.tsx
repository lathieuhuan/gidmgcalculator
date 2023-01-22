import type { InsHTMLAttributes, ParamHTMLAttributes } from "react";
import { FaFilter } from "react-icons/fa";
import { IconButton } from "@Components/atoms";

const ModalHeader = ({ className = "", ...rest }: InsHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={"h-11 relative grid grid-cols-3 rounded-t-lg bg-orange " + className}
      {...rest}
    />
  );
};

ModalHeader.Text = ({ className = "", ...rest }: ParamHTMLAttributes<HTMLParagraphElement>) => {
  return (
    <div className="w-full hidden md2:flex justify-center items-center">
      <p
        className={"pt-1 capitalize text-1.5xl text-center font-bold text-black " + className}
        {...rest}
      />
    </div>
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
      className={
        "text-sm bg-black " +
        (props.active ? "text-green " : "text-default ") +
        (props.className || "")
      }
      size="w-7 h-7"
      variant="custom"
      onClick={props.onClick}
    >
      <FaFilter />
    </IconButton>
  );
};

export { ModalHeader };
