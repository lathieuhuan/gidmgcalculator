import type { ReactNode } from "react";
import { TrackerRecord } from "@Calculators/types";
import { Green } from "@Src/styled-components";

export const recordListStyles = "columns-1 md2:columns-2 space-y-1";

export function getTotalRecordValue(list: TrackerRecord[]) {
  return list.reduce((accumulator, record) => accumulator + record.value, 0);
}

export function renderHeading(white: ReactNode, orange?: string | number) {
  return (
    <p className="font-medium">
      {white} <span className="text-orange">{orange}</span>
    </p>
  );
}

export function renderRecord(
  calcFn?: (value: number) => string | number,
  extraDesc?: (value: number) => string
) {
  return ({ desc, value }: TrackerRecord, index: number) =>
    value ? (
      <p key={index} className="text-lesser text-sm">
        • {desc?.[0]?.toUpperCase()}
        {desc.slice(1)} {extraDesc ? `${extraDesc(value)} ` : ""}
        <Green>{calcFn ? calcFn(value) : value}</Green>
      </p>
    ) : null;
}
