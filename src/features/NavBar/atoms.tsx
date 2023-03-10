import { ReactNode } from "react";

interface ActionButtonProps {
  className?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}
export const ActionButton = ({ className = "", icon, label, onClick }: ActionButtonProps) => {
  return (
    <button
      className={
        "px-4 py-2 flex items-center font-bold hover:text-default hover:bg-darkblue-1 cursor-default " + className
      }
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};
