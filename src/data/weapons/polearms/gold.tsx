import type { AppWeapon } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { liyueSeries } from "../series";

const goldPolearms: AppWeapon[] = [
  {
    code: 139,
    name: "Staff of the Scarlet Sands",
    icon: "4/44/Weapon_Staff_of_the_Scarlet_Sands",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cRate_", scale: "9.6%b" },
    passiveName: "Heat Haze at Horizon's End",
    description: {
      pots: [
        `The equipping character gains {0}% of their {Elemental Mastery} as bonus {ATK}.`,
        `When an Elemental Skill hits opponents, the Dream of the Scarlet Sands effect will be gained for 10s: the
        equipping character will gain {1}% of their {Elemental Mastery} as bonus {ATK}. Max {2} stacks.`,
      ],
      seeds: [39, 21, { max: 3, increment: 0 }],
    },
    autoBuffs: [
      {
        base: 0.39,
        stacks: {
          type: "attribute",
          field: "em",
        },
        targetAttribute: "atk",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        base: 0.21,
        stacks: [
          {
            type: "attribute",
            field: "em",
          },
          {
            type: "input",
          },
        ],
        targetAttribute: "atk",
      },
    ],
  },
  {
    code: 82,
    name: "Calamity Queller",
    icon: "8/8b/Weapon_Calamity_Queller",
    rarity: 5,
    mainStatScale: "49",
    subStat: { type: "atk_", scale: "3.6%" },
    passiveName: "Eagle Spear of Justice",
    description: {
      pots: [
        `Gain {0}% {All Elemental DMG Bonus}.`,
        `Obtain Consummation for 20s after using an Elemental Skill, causing {ATK} to increase by {1}% per second, up to
        {2} times. When the character equipped with this weapon is not on the field, Consummation's {ATK} increase is
        {doubled}.`,
      ],
      seeds: [9, 2.4, { max: 6, increment: 0 }],
    },
    autoBuffs: [
      {
        base: 9,
        targetAttribute: [...VISION_TYPES],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          {
            type: "stacks",
            max: 6,
          },
          {
            label: "Not on the field",
            type: "check",
          },
        ],
        base: 2.4,
        stacks: {
          type: "input",
          doubledAtInput: 1,
        },
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 79,
    name: "Engulfing Lightning",
    icon: "2/21/Weapon_Engulfing_Lightning",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "er_", scale: "12%" },
    passiveName: "Timeless Dream: Eternal Stove",
    description: {
      pots: [
        `{ATK} increased by {0}% of {Energy Recharge} over the base 100%. You can gain a maximum bonus of {1}% ATK.`,
        `Gain {2}% {Energy Recharge} for 12s after using an Elemental Burst.`,
      ],
      seeds: [21, { max: 70, increment: 10 }, { base: 25, increment: 5 }],
    },
    autoBuffs: [
      {
        base: 0.21,
        stacks: [
          {
            type: "attribute",
            field: "er_",
            minus: 100,
          },
        ],
        targetAttribute: "atk_",
        max: {
          base: 70,
          increment: 10,
        },
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 25,
        increment: 5,
        targetAttribute: "er_",
      },
    ],
  },
  {
    code: 80,
    name: "Staff of Homa",
    icon: "1/17/Weapon_Staff_of_Homa",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg_", scale: "14.4%" },
    passiveName: "Reckless Cinnabar",
    description: {
      pots: [
        `{HP} increased by {0}%. Additionally, provides an {ATK Bonus} based on {1}% of the wielder's {Max HP}.`,
        `When the wielder's HP is less than 50%, this {ATK Bonus} is increased by an additional {2}% of {Max HP}.`,
      ],
      seeds: [15, 0.6, { base: 0.8, increment: 0.2 }],
    },
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "hp_",
      },
      {
        base: 0.6,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.01,
        },
        targetAttribute: "atk",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 0.8,
        increment: 0.2,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.01,
        },
        targetAttribute: "atk",
      },
    ],
  },
  {
    code: 81,
    name: "Vortex Vanquisher",
    icon: "d/d6/Weapon_Vortex_Vanquisher",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
  {
    code: 78,
    name: "Primordial Jade Winged-Spear",
    icon: "8/80/Weapon_Primordial_Jade_Winged-Spear",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cRate_", scale: "4.8%" },
    passiveName: "Eagle Spear of Justice",
    description: {
      pots: [
        `On hit, increases {ATK} by {0}% for 6s. Max {1} stacks. This effect can only occur once every 0.3s. While in
        possession of the maximum possible stacks, DMG dealt is increased by {2}%.`,
      ],
      seeds: [{ base: 2.5, increment: 0.7 }, { max: 7, increment: 0 }, 9],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 7,
          },
        ],
        buffBonuses: [
          {
            base: 2.5,
            increment: 0.7,
            stacks: {
              type: "input",
            },
            targetAttribute: "atk_",
          },
          {
            checkInput: 7,
            base: 9,
            targetAttPatt: "all.pct_",
          },
        ],
      },
    ],
  },
  {
    code: 77,
    name: "Skyward Spine",
    icon: "6/69/Weapon_Skyward_Spine",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "er_", scale: "8%" },
    passiveName: "Blackwing",
    description: {
      pots: [
        `Increases {CRIT Rate} by {0}% and increases {Normal ATK SPD} by {1}%. Additionally, Normal and Charged Attacks hits on
        opponents have a 50% chance to trigger a vacuum blade that deals {2}% of ATK as DMG in a small AoE. This effect
        can occur no more than once every 2s.`,
      ],
      seeds: [6, { base: 12, increment: 0 }, { base: 25, increment: 15, seedType: "dull" }],
    },
    autoBuffs: [
      {
        base: 6,
        targetAttribute: "cRate_",
      },
      {
        base: 12,
        increment: 0,
        targetAttribute: "naAtkSpd_",
      },
    ],
  },
];

export default goldPolearms;
