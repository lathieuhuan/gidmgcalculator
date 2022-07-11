import type { Vision, Weapon } from "@Src/types";

export type DataType = "character" | "weapon" | "artifact";

export type Filter = {
  type: "vision" | "weapon" | "";
  value: string;
}

export type PickerItem = {
  code: number,
  beta?: boolean;
  name: string;
  vision?: Vision;
  weapon?: Weapon,
  icon: string;
  constellation?: number;
  rarity: number;
};
