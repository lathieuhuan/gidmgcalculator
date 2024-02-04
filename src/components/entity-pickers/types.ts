import type { Rarity, Vision, WeaponType } from "@Src/types";

export type DataType = "character" | "weapon" | "artifact";

export type Filter = {
  type: "vision" | "weaponType" | "";
  value: string;
};

export type ItemFilterState = {
  types: string[];
  rarities: number[];
};

export type PickerItem = {
  code: number;
  beta?: boolean;
  name: string;
  icon: string;
  rarity: Rarity;
  vision?: Vision;
  type?: WeaponType;
  weaponType?: WeaponType;
  cons?: number;
  artifactIDs?: (number | null)[];
};
