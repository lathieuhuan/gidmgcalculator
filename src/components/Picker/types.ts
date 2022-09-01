import type { Rarity, Vision, Weapon } from "@Src/types";

export type DataType = "character" | "weapon" | "artifact";

export type Filter = {
  type: "vision" | "weapon" | "";
  value: string;
};

export type PickerItem = {
  code: number;
  beta?: boolean;
  name: string;
  icon: string;
  rarity: Rarity;
  vision?: Vision;
  weapon?: Weapon;
  cons?: number;
  artifactIDs?: (number | null)[];
};
