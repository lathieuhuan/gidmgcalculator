import clsx from "clsx";
import styles from "./styles.module.scss";

type IProps = {
  className?: string;
  children: React.ReactNode;
};

const WarehouseLayout = ({ className, ...rest }: IProps) => {
  return <div className={clsx("relative h-full pt-12 md2:pt-14", styles.warehouse, className)} {...rest} />;
};

WarehouseLayout.Wrapper = (props: IProps) => {
  return <div className="py-4 md2:py-8 h-full flex-center bg-dark-700" {...props} />;
};

WarehouseLayout.ButtonBar = ({ className, children }: IProps) => {
  return <div className={clsx("absolute top-0 left-0 pl-2 w-full h-10 flex items-center", className)}>{children}</div>;
};

WarehouseLayout.Body = ({ className = "", ...rest }: IProps) => {
  return <div className={"h-full flex " + className} {...rest} />;
};

export { WarehouseLayout };
