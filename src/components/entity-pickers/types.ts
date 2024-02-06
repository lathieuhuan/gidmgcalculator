import type { Rarity, Vision, WeaponType } from "@Src/types";

export type Filter = {
  type: "vision" | "weaponType" | "";
  value: string;
};

export type ItemFilterState = {
  types: string[];
  rarities: number[];
};

export type PickedItem = {
  code: number;
  beta?: boolean;
  name: string;
  icon: string;
  rarity?: Rarity;
  vision?: Vision;
  /** Weapon type or Artifact type */
  type?: string;
  weaponType?: WeaponType;
  cons?: number;
  artifactIDs?: (number | null)[];
};
