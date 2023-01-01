import type { StatInfo } from "@Src/types";

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

export const BOW_CAs: StatInfo[] = [
  { name: "Aimed Shot", multBase: 43.86, multType: 7 },
  { name: "Fully-charged Aimed Shot", subAttPatt: "FCA", multBase: 124, multType: 2 },
];

export const LIGHT_PAs: StatInfo[] = [
  { name: "Plunge DMG", multBase: 56.83, multType: 7 },
  { name: "Low Plunge", multBase: 113.63, multType: 7 },
  { name: "High Plunge", multBase: 141.93, multType: 7 },
];

// sword & polearm
export const MEDIUM_PAs: StatInfo[] = [
  { name: "Plunge DMG", multBase: 63.93, multType: 7 },
  { name: "Low Plunge", multBase: 127.84, multType: 7 },
  { name: "High Plunge", multBase: 159.68, multType: 7 },
];

// claymore
export const HEAVY_PAs: StatInfo[] = [
  { name: "Plunge DMG", multBase: 74.59, multType: 7 },
  { name: "Low Plunge", multBase: 149.14, multType: 7 },
  { name: "High Plunge", multBase: 186.29, multType: 7 },
];

// special

// Xiao, Kazuha, Itto
export const HEAVIER_PAs: StatInfo[] = [
  { name: "Plunge DMG", multBase: 81.83, multType: 7 },
  { name: "Low Plunge", multBase: 163.63, multType: 7 },
  { name: "High Plunge", multBase: 204.39, multType: 7 },
];

export const TRAVELER_INFO = {
  icon: "7/71/Character_Traveler_Thumb",
  sideIcon: "3/35/Character_Lumine_Side_Icon",
  rarity: 5 as const,
  nation: "outland" as const,
  weaponType: "sword" as const,
  stats: [
    [912, 18, 57],
    [2342, 46, 147],
    [3024, 59, 190],
    [4529, 88, 284],
    [5013, 98, 315],
    [5766, 113, 362],
    [6411, 125, 402],
    [7164, 140, 450],
    [7648, 149, 480],
    [8401, 164, 527],
    [8885, 174, 558],
    [9638, 188, 605],
    [10122, 198, 635],
    [10875, 212, 683],
  ],
  bonusStat: { type: "atk_" as const, value: 6 },
};

export const TRAVELLER_NCPAs: {
  NA: { stats: StatInfo[] };
  CA: { stats: StatInfo[] };
  PA: { stats: StatInfo[] };
} = {
  NA: {
    stats: [
      { name: "1-Hit", multBase: 44.46 },
      { name: "2-Hit", multBase: 43.43 },
      { name: "3-Hit", multBase: 52.98 },
      { name: "4-Hit", multBase: 58.31 },
      { name: "5-Hit", multBase: 70.78 },
    ],
  },
  CA: {
    stats: [{ name: "Charged Attack", multBase: [55.9, 72.24] }],
  },
  PA: { stats: MEDIUM_PAs },
};
