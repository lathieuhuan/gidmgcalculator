import type { AppWeapon } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import {
  baneSeries2,
  blackcliffSeries,
  desertSeries,
  dragonspinePassive,
  favoniusPassive,
  lithicSeries,
  royalSeries,
  sacrificialPassive,
  watatsumiSeries,
} from "../series";

const purpleClaymores: AppWeapon[] = [
  {
    code: 158,
    name: "Tidal Shadow",
    icon: "https://images2.imgbox.com/8a/38/CnFqC8ZQ_o.png",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "",
    description: {
      pots: [
        `When the wielder is healed, ATK will be increased by {0}% for 8s. This can be triggered even when the
        character is not on the field.`,
      ],
      seeds: [18],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 18,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 157,
    name: "Talking Stick",
    icon: "https://images2.imgbox.com/f9/77/1D4t0CDh_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "cRate_", scale: "4%" },
    passiveName: "",
    description: {
      pots: [
        `ATK will be increased by {0}% for 10s after being affected by Pyro. This effect can be triggered once every
        12s. `,
        `All Elemental DMG Bonus will be increased by {1}% for 10s after being affected by Hydro, Cryo, or Electro.
        This effect can be triggered once every 12s.`,
      ],
      seeds: [12, 9],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 12,
        targetAttribute: "atk_",
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 1,
        base: 9,
        targetAttribute: [...VISION_TYPES],
      },
    ],
  },
  {
    code: 150,
    name: "Mailed Flower",
    icon: "c/c7/Weapon_Mailed_Flower",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
    passiveName: "Whispers of Wind and Flower",
    description: {
      pots: [
        `Within 8s after an Elemental Skill hits an opponent or triggers an Elemental Reaction, ATK is increased by
        {0}% and Elemental Mastery is increased by {1}.`,
      ],
      seeds: [9, 36],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        buffBonuses: [
          {
            base: 9,
            targetAttribute: "atk_",
          },
          {
            base: 36,
            targetAttribute: "em",
          },
        ],
      },
    ],
  },
  {
    code: 145,
    name: "Makhaira Aquamarine",
    icon: "9/90/Weapon_Makhaira_Aquamarine",
    ...desertSeries,
  },
  {
    code: 136,
    name: "Forest Regalia",
    icon: "5/51/Weapon_Forest_Regalia",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passiveName: "Forest Sanctuary",
    description: {
      pots: [
        `After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness
        will be created around the character for a maximum of 10s.`,
        `When picked up, the Leaf will grant the character {0} Elemental Mastery for 12s.`,
        `Only 1 Leaf can be generated this way every 20s. This effect can still  be triggered if the character is not
        on the field. The Leaf of Consciousness' effect cannot stack.`,
      ],
      seeds: [45],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.ONE_UNIT,
        description: 1,
        base: 45,
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 60,
    name: "Snow-Tombed Starsilver",
    icon: "4/49/Weapon_Snow-Tombed_Starsilver",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "phys", scale: "7.5%" },
    ...dragonspinePassive,
  },
  {
    code: 61,
    name: "Sacrificial Greatsword",
    icon: "1/17/Weapon_Sacrificial_Greatsword",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    ...sacrificialPassive,
  },
  {
    code: 62,
    name: "Royal Greatsword",
    icon: "b/bf/Weapon_Royal_Greatsword",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...royalSeries,
  },
  {
    code: 63,
    name: "Prototype Archaic",
    icon: "a/ab/Weapon_Prototype_Archaic",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passiveName: "Crush",
    description: {
      pots: [
        `On hit, Normal or Charged Attacks have a 50% chance to deal an additional {0}% ATK DMG to opponents within a
        small AoE. Can only occur once every 15s.`,
      ],
      seeds: [{ base: 180, dull: true }],
    },
  },
  {
    code: 64,
    name: "Whiteblind",
    icon: "0/04/Weapon_Whiteblind",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "def_", scale: "11.3%" },
    passiveName: "Infusion Blade",
    description: {
      pots: [
        `On hit, Normal or Charged Attacks increase ATK and DEF by {0}% for 6s. Max 4 stacks. Can only occur once every
        0.5s.`,
      ],
      seeds: [4.5],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        base: 4.5,
        stacks: {
          type: "input",
        },
        targetAttribute: ["atk_", "def_"],
      },
    ],
  },
  {
    code: 65,
    name: "Blackcliff Slasher",
    icon: "d/d7/Weapon_Blackcliff_Slasher",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg_", scale: "12%" },
    ...blackcliffSeries,
  },
  {
    code: 66,
    name: "Lithic Blade",
    icon: "3/3a/Weapon_Lithic_Blade",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...lithicSeries,
  },
  {
    code: 67,
    name: "Serpent Spine",
    icon: "8/88/Weapon_Serpent_Spine",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passiveName: "Wavesplitter",
    description: {
      pots: [
        `Every 4s a character is on the field, they will deal {0}% more DMG and take {1}% more DMG. This effect has a
        maximum of 5 stacks`,
        `and will not be reset if the character leaves the field, but will be reduced by 1 stack when the character
        takes DMG.`,
      ],
      seeds: [{ base: 5, increment: 1 }, { options: [3, 2.7, 2.4, 2.2, 2] }],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        base: 5,
        increment: 1,
        stacks: {
          type: "input",
        },
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 68,
    name: "Akuoumaru",
    icon: "c/c5/Weapon_Akuoumaru",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...watatsumiSeries,
  },
  {
    code: 69,
    name: "Katsuragikiri Nagamasa",
    icon: "2/2e/Weapon_Katsuragikiri_Nagamasa",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passiveName: "Samurai Conduct",
    description: {
      pots: [
        `Increases Elemental Skill DMG by {0}%. After Elemental Skill hits an opponent, the character loses 3 Energy
        but regenerates {1} Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered
        even when the character is not on the field.`,
      ],
      seeds: [4.5, { base: 2.5, increment: 0.5, dull: true }],
    },
    autoBuffs: [
      {
        base: 4.5,
        targetAttPatt: "ES.pct_",
      },
    ],
  },
  {
    code: 70,
    name: "The Bell",
    icon: "6/6e/Weapon_The_Bell",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "hp_", scale: "9%" },
    passiveName: "Rebellious Guardian",
    description: {
      pots: [
        `Taking DMG generates a shield which absorbs DMG up to {0}% of max HP. This shield lasts for 10s or until
        broken, and can only be triggered once every 45s.`,
        `While protected by a shield, the character gains {1}% increased DMG.`,
      ],
      seeds: [{ base: 17, increment: 3, dull: true }, 9],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 9,
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 71,
    name: "Rainslasher",
    icon: "d/d4/Weapon_Rainslasher",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    ...baneSeries2("Storm and Tide", "Hydro or Electro"),
  },
  {
    code: 72,
    name: "Luxurious Sea-Lord",
    icon: "a/ab/Weapon_Luxurious_Sea-Lord",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Oceanic Victory",
    description: {
      pots: [
        `Increases Elemental Burst DMG by {0}%. When Elemental Burst hits opponents, there is a 100% chance of
        summoning a titanic tuna that charges and deals {1}% ATK as AoE DMG. This effect can occur once every 15s.`,
      ],
      seeds: [9, { base: 75, dull: true }],
    },
    autoBuffs: [
      {
        base: 9,
        targetAttPatt: "EB.pct_",
      },
    ],
  },
  {
    code: 73,
    name: "Favonius Greatsword",
    icon: "9/9c/Weapon_Favonius_Greatsword",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er_", scale: "13.3%" },
    ...favoniusPassive,
  },
];

export default purpleClaymores;
