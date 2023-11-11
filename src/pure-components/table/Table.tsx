import type {
  ColgroupHTMLAttributes,
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  colAttrs?: (ColgroupHTMLAttributes<HTMLTableColElement> | null)[];
}
const Table = ({ className = "", colAttrs, children, ...rest }: TableProps) => (
  <table className={"min-w-full border-collapse " + className} {...rest}>
    {colAttrs?.length ? (
      <colgroup>
        {colAttrs.map((attrs, i) => (
          <col key={i} {...attrs} />
        ))}
      </colgroup>
    ) : null}
    {children}
  </table>
);

Table.Tr = ({ className = "", ...rest }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={
      "odd:bg-dark-900 even:bg-dark-700 hover:bg-darkerred first:hover:bg-dark-900 " +
      className
    }
    {...rest}
  />
);

Table.Th = ({ className = "", ...rest }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={"px-2 py-1 text-sm border-x border-dark-900 cursor-default " + className}
    {...rest}
  />
);

Table.Td = ({ className = "", ...rest }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={
      "px-2 py-1 text-sm border-x border-dark-900 cursor-default text-right first:text-left first:font-semibold " +
      className
    }
    {...rest}
  />
);

export { Table };
