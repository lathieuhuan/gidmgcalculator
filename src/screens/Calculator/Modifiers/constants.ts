export type TOption = {
  label: string | number;
  value: string | number;
};

export const ANEMOABLE_OPTIONS: TOption[] = [
  { label: "Pyro", value: 0 },
  { label: "Hydro", value: 1 },
  { label: "Electro", value: 2 },
  { label: "Cryo", value: 3 },
];

export const DENDROABLE_OPTIONS: TOption[] = [
  { label: "Pyro", value: 0 },
  { label: "Hydro", value: 1 },
  { label: "Electro", value: 2 },
];
