import { TrackerRecord } from "@Calculators/types";

export function getTotalRecord(list: TrackerRecord[]) {
  return list.reduce((result, item) => result + item.value, 0);
}

export function renderHeading(white: string, orange?: string) {
  return (
    <p className="font-bold">
      {white} <span className="text-orange">{orange}</span>
    </p>
  );
}
