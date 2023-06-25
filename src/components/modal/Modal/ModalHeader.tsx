import type { InsHTMLAttributes, ParamHTMLAttributes, ReactNode } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { IconButton } from "../../buttons";

const ModalHeader = ({ className = "", ...rest }: InsHTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={"h-11 relative grid grid-cols-2 md2:grid-cols-3 rounded-t-lg bg-orange " + className} {...rest} />
  );
};

ModalHeader.Text = ({ className = "", ...rest }: ParamHTMLAttributes<HTMLParagraphElement>) => {
  return (
    <div className="w-full hidden md2:flex justify-center items-center">
      <p className={"pt-1 capitalize text-1.5xl text-center font-bold text-black " + className} {...rest} />
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
      className={"text-sm bg-black " + (props.active ? "text-green " : "text-default ") + (props.className || "")}
      size="w-7 h-7"
      variant="custom"
      onClick={props.onClick}
    >
      <FaFilter />
    </IconButton>
  );
};

interface RightEndProps {
  wrapperCls?: string;
  extraContent?: ReactNode;
  onClickClose?: () => void;
}
ModalHeader.RightEnd = (props: RightEndProps) => {
  return (
    <div className={"flex justify-end items-center " + (props.wrapperCls || "")}>
      {props.extraContent}
      <IconButton className="mr-2 text-black text-xl" variant="custom" onClick={props.onClickClose}>
        <FaTimes />
      </IconButton>
    </div>
  );
};

export { ModalHeader };
