import type { AppCharacter } from "@Src/types";

export const NCPA_PERCENTS = ["NA.pct_", "CA.pct_", "PA.pct_"] as const;

export enum EModSrc {
  ES = "Elemental Skill",
  EB = "Elemental Burst",
  A1 = "Ascension 1",
  A4 = "Ascension 4",
  C1 = "Constellation 1",
  C2 = "Constellation 2",
  C4 = "Constellation 4",
  C6 = "Constellation 6",
}

export const TRAVELER_INFO: Pick<AppCharacter, "icon" | "sideIcon" | "rarity" | "nation" | "weaponType"> = {
  icon: "5/59/Traveler_Icon",
  sideIcon: "9/9a/Lumine_Side_Icon",
  rarity: 5,
  nation: "outland",
  weaponType: "sword",
};
