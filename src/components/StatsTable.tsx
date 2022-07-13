import cn from "classnames";
import type { ReactNode } from "react";

interface StatsTableProps {
  children: ReactNode;
}
function StatsTable({ children }: StatsTableProps) {
  return <div className="w-full cursor-default">{children}</div>;
}

interface RowProps {
  className?: string;
  children: JSX.Element | JSX.Element[];
  onClick?: () => void;
}
StatsTable.Row = ({ className, children, onClick }: RowProps) => {
  return (
    <div
      className={cn("flex justify-between pt-1 px-2 font-bold odd:bg-darkblue-2 hover:bg-darkerred", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default StatsTable;
