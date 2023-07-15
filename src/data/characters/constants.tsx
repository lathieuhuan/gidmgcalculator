import type { PatternStat } from "@Src/types";

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

export const BOW_CAs: PatternStat[] = [
  { name: "Aimed Shot", multFactors: { root: 43.86, scale: 7 } },
  {
    name: "Fully-charged Aimed Shot",
    subAttPatt: "FCA",
    multFactors: { root: 124, scale: 2 },
  },
];

export const LIGHT_PAs: PatternStat[] = [
  { name: "Plunge DMG", multFactors: 56.83 },
  { name: "Low Plunge", multFactors: 113.63 },
  { name: "High Plunge", multFactors: 141.93 },
];

// sword & polearm
export const MEDIUM_PAs: PatternStat[] = [
  { name: "Plunge DMG", multFactors: 63.93 },
  { name: "Low Plunge", multFactors: 127.84 },
  { name: "High Plunge", multFactors: 159.68 },
];

// claymore
export const HEAVY_PAs: PatternStat[] = [
  { name: "Plunge DMG", multFactors: 74.59 },
  { name: "Low Plunge", multFactors: 149.14 },
  { name: "High Plunge", multFactors: 186.29 },
];

// special

// Xiao, Kazuha, Itto
export const HEAVIER_PAs: PatternStat[] = [
  { name: "Plunge DMG", multFactors: 81.83 },
  { name: "Low Plunge", multFactors: 163.63 },
  { name: "High Plunge", multFactors: 204.39 },
];

export const TRAVELER_INFO = {
  icon: "5/59/Traveler_Icon",
  sideIcon: "9/9a/Lumine_Side_Icon",
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
  NA: { stats: PatternStat[] };
  CA: { stats: PatternStat[] };
  PA: { stats: PatternStat[] };
} = {
  NA: {
    stats: [
      { name: "1-Hit", multFactors: 44.46 },
      { name: "2-Hit", multFactors: 43.43 },
      { name: "3-Hit", multFactors: 52.98 },
      { name: "4-Hit", multFactors: 58.31 },
      { name: "5-Hit", multFactors: 70.78 },
    ],
  },
  CA: {
    stats: [{ name: "Charged Attack", multFactors: [55.9, 72.24] }],
  },
  PA: { stats: MEDIUM_PAs },
};
