import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./styles.module.scss";

type IProps = {
  className?: string;
  children: ReactNode;
};

const WareHouse = ({ className, ...rest }: IProps) => {
  return (
    <div
      className={clsx("relative h-full pt-12 md2:pt-14", styles.warehouse, className)}
      {...rest}
    />
  );
};

const Wrapper = (props: IProps) => {
  return <div className="py-4 md2:py-8 h-full flex-center bg-darkblue-2" {...props} />;
};

const ButtonBar = (props: IProps) => {
  return <div className="absolute top-0 left-0 pl-2 w-full h-10 flex items-center" {...props} />;
};

const Body = ({ className = "", ...rest }: IProps) => {
  return <div className={"h-full flex " + className} {...rest} />;
};

WareHouse.Wrapper = Wrapper;
WareHouse.ButtonBar = ButtonBar;
WareHouse.Body = Body;

export { WareHouse };
