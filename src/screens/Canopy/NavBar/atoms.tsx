import { ReactNode } from "react";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
}

interface LoadOptionProps extends ButtonProps {
  children: ReactNode;
}
export const LoadOption = ({ className = "", ...rest }: LoadOptionProps) => {
  return <div className={"pt-2 pb-3 px-4 hover:bg-darkblue-1 " + className} {...rest} />;
};

interface ActionButtonProps extends ButtonProps {
  icon: ReactNode;
  label: string;
}
export const ActionButton = ({ className = "", icon, label, onClick }: ActionButtonProps) => {
  return (
    <button
      className={
        "px-4 py-2 flex items-center font-bold hover:text-default hover:bg-darkblue-1 cursor-default " +
        className
      }
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

interface ListProps {
  children: ReactNode;
}

export const ListDecimal = (props: ListProps) => {
  return <ul className="mt-1 pl-4 list-decimal space-y-1" {...props} />;
};

export const ListDisc = (props: ListProps) => {
  return <ul className="mt-1 list-disc list-inside space-y-1" {...props} />;
};
