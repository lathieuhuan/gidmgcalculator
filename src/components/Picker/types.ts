export type DataType = "character" | "weapon" | "artifact";

export interface Filter {
  type: "vision" | "weapon";
  value: string;
}

export type FilterFn = (chosen: boolean, filter: Filter) => void;
