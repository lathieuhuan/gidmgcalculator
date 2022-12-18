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
StatsTable.Row = ({ className = "", children, onClick }: RowProps) => {
  return (
    <div
      className={
        "flex justify-between pt-1 px-2 font-semibold odd:bg-darkblue-2 hover:bg-darkerred " +
        className
      }
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { StatsTable };
