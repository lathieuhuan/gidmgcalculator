import type { StatInfo } from "@Src/types";

export enum EModifierSrc {
  ES = "Elemental Skill",
  EB = "Elemental Burst",
  A1 = "Ascension 1 Passive Talent",
  A4 = "Ascension 4 Passive Talent",
  C1 = "Constellation 1",
  C2 = "Constellation 2",
  C4 = "Constellation 4",
  C6 = "Constellation 6",
}

export const BOW_CAs: StatInfo[] = [
  { name: "Aimed Shot", baseMult: 43.86, multType: 7 },
  { name: "Fully-charged Aimed Shot", baseMult: 124, multType: 2 },
];

export const LIGHT_PAs: StatInfo[] = [
  { name: "Plunge DMG", baseMult: 56.83, multType: 7 },
  { name: "Low Plunge", baseMult: 113.63, multType: 7 },
  { name: "High Plunge", baseMult: 141.93, multType: 7 },
];

// sword & polearm
export const MEDIUM_PAs: StatInfo[] = [
  { name: "Plunge DMG", baseMult: 63.93, multType: 7 },
  { name: "Low Plunge", baseMult: 127.84, multType: 7 },
  { name: "High Plunge", baseMult: 159.68, multType: 7 },
];

// claymore
export const HEAVY_PAs: StatInfo[] = [
  { name: "Plunge DMG", baseMult: 74.59, multType: 7 },
  { name: "Low Plunge", baseMult: 149.14, multType: 7 },
  { name: "High Plunge", baseMult: 186.29, multType: 7 },
];

// special

// Xiao, Kazuha, Itto
export const HEAVIER_PAs: StatInfo[] = [
  { name: "Plunge DMG", baseMult: 81.83, multType: 7 },
  { name: "Low Plunge", baseMult: 163.63, multType: 7 },
  { name: "High Plunge", baseMult: 204.39, multType: 7 },
];

export const TALENT_LV_MULTIPLIERS: Record<number, number[]> = {
  // normal attack && physical
  1: [
    0, 1, 1.08, 1.16, 1.275, 1.35, 1.45, 1.575, 1.7, 1.8373, 1.9768, 2.1264, 2.3245, 2.5125, 2.7,
    2.906,
  ],
  // percentage
  2: [0, 1, 1.075, 1.15, 1.25, 1.325, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.125, 2.25, 2.375],
  // flat
  3: [0, 1, 1.1, 1.2, 1.325, 1.45, 1.575, 1.725, 1.875, 2.025, 2.2, 2.375, 2.55, 2.75, 2.95, 3.16],
  // razor NA, xiao NA+CA, hutao NA+CA+PA, yoimiya NA, raiden's Sword Attacks
  4: [
    0, 1, 1.068, 1.136, 1.227, 1.295, 1.375, 1.477, 1.579, 1.682, 1.784, 1.886, 1.989, 2.091, 2.193,
    2.295,
  ],
  // hutao E, xiao Q, yanfei Q, yoimiya E, aloy E
  5: [
    0, 1, 1.06, 1.12, 1.198, 1.258, 1.318, 1.396, 1.474, 1.552, 1.629, 1.708, 1.784, 1.862, 1.94,
    2.018,
  ],
  // zhongli Q
  6: [
    0, 1, 1.108, 1.216, 1.351, 1.473, 1.595, 1.757, 1.919, 2.081, 2.243, 2.405, 2.568, 2.703, 2.838,
    2.973,
  ],
  // plunge, most Aim Shot, razor CA, ayato NA+CA+PA+ES
  7: [
    0, 1, 1.081, 1.163, 1.279, 1.361, 1.454, 1.581, 1.709, 1.837, 1.977, 2.116, 2.256, 2.395, 2.535,
    2.675,
  ],
  // diona, venti Full Aim Shot
  8: [0, 1, 1.075, 1.15, 1.25, 1.325, 1.4, 1.5, 1.6, 1.7, 1.8, 1.904, 2.04, 2.176, 2.312, 2.448],
};

export const TRAVELER_INFO = {
  icon: "7/71/Character_Traveler_Thumb",
  sideIcon: "3/35/Character_Lumine_Side_Icon",
  rarity: 5 as const,
  nation: "outland" as const,
  weapon: "sword" as const,
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
      { name: "1-Hit", baseMult: 44.46 },
      { name: "2-Hit", baseMult: 43.43 },
      { name: "3-Hit", baseMult: 52.98 },
      { name: "4-Hit", baseMult: 58.31 },
      { name: "5-Hit", baseMult: 70.78 },
    ],
  },
  CA: {
    stats: [{ name: "Charged Attack", baseMult: [55.9, 72.24] }],
  },
  PA: { stats: MEDIUM_PAs },
};
