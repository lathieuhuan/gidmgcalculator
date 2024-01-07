import clsx from "clsx";
import type { InsHTMLAttributes, ParamHTMLAttributes, ReactNode } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { Button } from "../button";

const ModalHeader = ({ className = "", ...rest }: InsHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={"h-11 relative grid grid-cols-2 md2:grid-cols-3 rounded-t-lg bg-orange-500 " + className}
      {...rest}
    />
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
    <Button
      className={clsx("shadow-common bg-black ", props.active ? "text-green-300 " : "text-light-400 ", props.className)}
      variant="custom"
      shape="square"
      size="small"
      icon={<FaFilter />}
      onClick={props.onClick}
    />
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
      <Button className="mr-2 text-black" variant="custom" icon={<FaTimes />} onClick={props.onClickClose} />
    </div>
  );
};

export { ModalHeader };
