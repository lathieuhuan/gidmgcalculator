import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { liyueSeries } from "../series";

const goldClaymores: AppWeapon[] = [
  {
    code: 151,
    name: "Beacon of the Reed Sea",
    icon: "6/6c/Weapon_Beacon_of_the_Reed_Sea",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate_", scale: "7.2%" },
    passiveName: "Desert Watch",
    description: {
      pots: [
        `After an Elemental Skill hits an opponent, your ATK will be increased by {0}% for 8s.`,
        `After you take DMG, your ATK will be increased by {0}% for 8s.`,
        `The 2 aforementioned effects can be triggered even when the character is not on the field.`,
        `When not protected by a shield, your character's Max HP will be increased by {1}%.`,
      ],
      seeds: [15, 24],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 15,
        targetAttribute: "atk_",
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 1,
        base: 15,
        targetAttribute: "atk_",
      },
      {
        index: 2,
        affect: EModAffect.SELF,
        description: 3,
        base: 24,
        targetAttribute: "hp_",
      },
    ],
  },
  {
    code: 57,
    name: "Redhorn Stonethresher",
    icon: "d/d4/Weapon_Redhorn_Stonethresher",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg_", scale: "19.2%" },
    passiveName: "Gokadaiou Otogibanashi",
    description: {
      pots: [`DEF is increased by {0}%. Normal and Charged Attack DMG is increased by {1}% of DEF.`],
      seeds: [21, 30],
    },
    autoBuffs: [
      {
        base: 21,
        targetAttribute: "def_",
      },
      {
        base: 0.3,
        stacks: {
          type: "attribute",
          field: "def",
        },
        targetAttPatt: ["NA.flat", "CA.flat"],
      },
    ],
  },
  {
    code: 53,
    name: "Song of Broken Pines",
    icon: "d/dd/Weapon_Song_of_Broken_Pines",
    rarity: 5,
    mainStatScale: "49",
    subStat: { type: "phys", scale: "4.5%" },
    passiveName: "Rebel's Banner Hymn",
    description: {
      pots: [
        `A part of the "Millennial Movement" that wanders amidst the winds. Increases ATK by {0}%, and when Normal or
        Charged Attacks hit opponents, the character gains a Sigil of Whispers. This effect can be triggered once every
        0.3s. When you possess four Sigils of Whispers, all of them will be consumed and all nearby party members will
        obtain the "Millennial Movement: Banner-Hymn" effect for 12s.`,
        `"Millennial Movement: Banner-Hymn" increases Normal ATK SPD by {1}% and increases ATK by {2}%. Once this
        effect is triggered, you will not gain Sigils of Whispers for 20s.`,
        `Of the many effects of the "Millennial Movement", buffs of the same type will not stack.`,
      ],
      seeds: [12, 9, 15],
    },
    autoBuffs: [
      {
        base: 12,
        targetAttribute: "atk_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        description: 1,
        buffBonuses: [
          { base: 9, targetAttribute: "naAtkSpd_" },
          { base: 15, targetAttribute: "atk_" },
        ],
      },
    ],
  },
  {
    code: 55,
    name: "The Unforged",
    icon: "f/f7/Weapon_The_Unforged",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
  {
    code: 56,
    name: "Wolf's Gravestone",
    icon: "4/4f/Weapon_Wolf%27s_Gravestone",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    passiveName: "Wolfish Tracker",
    description: {
      pots: [
        `Increases ATK by {0}%.`,
        `On hit, attacks against opponents with less than 30% HP increase all party members' ATK by {1}% for 12s. Can
        only occur once every 30s.`,
      ],
      seeds: [15, 30],
    },
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "atk_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        description: 1,
        base: 30,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 54,
    name: "Skyward Pride",
    icon: "0/0b/Weapon_Skyward_Pride",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "er_", scale: "8%" },
    passiveName: "Sky-ripping Dragon Spine",
    description: {
      pots: [
        `Increases all DMG by {0}%. After using an Elemental Burst, Normal or Charged Attack, on hit, creates a vacuum
        blade that does {1}% of ATK as DMG to opponents along its path. Lasts for 20s or 8 vacuum blades.`,
      ],
      seeds: [6, { base: 60, dull: true }],
    },
    autoBuffs: [
      {
        base: 6,
        targetAttPatt: "all.pct_",
      },
    ],
  },
];

export default goldClaymores;
