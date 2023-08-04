import { AppWeapon } from "@Src/types";

export const GREEN_INFO: Pick<AppWeapon, "rarity" | "mainStatScale"> = {
  rarity: 2,
  mainStatScale: "33",
};

export const GRAY_INFO: Pick<AppWeapon, "rarity" | "mainStatScale"> = {
  rarity: 1,
  mainStatScale: "23",
};
