import type { ReactNode } from "react";

interface StatsTableProps {
  children: ReactNode;
}
const StatsTable = ({ children }: StatsTableProps) => {
  return <div className="w-full cursor-default">{children}</div>;
};

interface RowProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}
StatsTable.Row = ({ className = "", children, onClick }: RowProps) => {
  return (
    <div className={`flex justify-between pt-1 px-2 odd:bg-dark-700 hover:bg-red-800 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export { StatsTable };
