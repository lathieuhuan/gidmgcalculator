import { TrackerRecord } from "@Calculators/types";
import { Green } from "@Src/styled-components";

export function renderHeading(white: string, orange?: string | number) {
  return (
    <p className="font-bold">
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
      <p key={index} className="text-lesser">
        • {desc?.[0].toUpperCase()}
        {desc.slice(1)}: {extraDesc ? `${extraDesc(value)} ` : ""}
        <Green>{calcFn ? calcFn(value) : value}</Green>
      </p>
    ) : null;
}
