import type { Vision, Weapon } from "@Src/types";

export type DataType = "character" | "weapon" | "artifact";

export type Filter = {
  type: "vision" | "weapon" | "";
  value: string;
}

export type PickerItem = {
  name: string;
  beta?: boolean;
  icon: string;
  constellation?: number;
  rarity: number;
  vision?: Vision;
};

export type DataPickerItem = PickerItem & {
  code: number,
  vision?: Vision,
  weapon?: Weapon
}