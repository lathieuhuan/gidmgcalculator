import type { AppWeapon } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { liyueSeries } from "../series";

const goldCatalysts: AppWeapon[] = [
  {
    code: 152,
    name: "Jadefall's Splendor",
    icon: "7/7a/Weapon_Jadefall%27s_Splendor",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "hp_", scale: "10.8%" },
    passiveName: "Primordial Jade Regalia",
    description: {
      pots: [
        `When using an Elemental Burst or creating a shield, the equipping character's corresponding Elemental DMG is
        increased by {0}% for every 1,000 Max HP they possess for 3s, up to {1}%.`,
        `At the same time, they will regain {2} Energy every 2.5s. This will still take effect even if the character
        is not on the field.`,
      ],
      seeds: [
        { base: 0.1, increment: 0.2 },
        { base: 4, increment: 8, seedType: "dull" },
        { base: 4, increment: 0.5, seedType: "dull" },
      ],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 0.1,
        increment: 0.2,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.001,
        },
        targetAttribute: "own_element",
        max: {
          base: 4,
          increment: 8,
        },
      },
    ],
  },
  {
    code: 147,
    name: "Tulaytullah's Remembrance",
    icon: "f/fc/Weapon_Tulaytullah%27s_Remembrance",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cDmg_", scale: "9.6%b" },
    passiveName: "Bygone Azure Teardrop",
    description: {
      pots: [
        `Normal Attack SPD is increased by {0}%.`,
        `After the wielder unleashes an Elemental Skill, Normal Attack DMG will increase by {1}% every second for 12s.
        After this character hits an opponent with a Normal Attack during this duration, Normal Attack DMG will be
        increased by {2}%. This increase can be triggered once every 0.3s. Total maximum bonus is {3}%.`,
        `The effect will be removed when the wielder leaves the field, and using the Elemental Skill again will reset
        all DMG buffs.`,
      ],
      seeds: [7.5, 3.6, 7.2, { base: 36, seedType: "dull" }],
    },
    autoBuffs: [
      {
        base: 7.5,
        targetAttribute: "naAtkSpd_",
      },
    ],
    buffs: [
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          { label: "Seconds passed", type: "text", max: 10 },
          { label: "Normal attacks hit", type: "text", max: 10 },
        ],
        base: 3.6,
        stacks: {
          type: "input",
          index: [{ value: 0 }, { value: 1, convertRate: 2 }],
        },
        targetAttPatt: "NA.pct_",
        max: 36,
      },
    ],
  },
  {
    code: 143,
    name: "A Thousand Floating Dreams",
    icon: "4/4c/Weapon_A_Thousand_Floating_Dreams",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "em", scale: "58" },
    passiveName: "A Thousand Nights' Dawnsong",
    description: {
      pots: [
        `Party members other than the equipping character will provide the equipping character with buffs based on
        whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same, increase
        Elemental Mastery by {0}. If not, increase the equipping character's DMG Bonus from their Elemental Type by
        {1}%. Max 3 stacks.`,
        `Additionally, all nearby party members other than the equipping character will have their Elemental Mastery
        increased by {2}. Multiple such effects from multiple such weapons can stack.`,
      ],
      seeds: [24, { base: 6, increment: 4 }, { base: 38, increment: 2 }],
    },
    autoBuffs: [
      {
        base: 24,
        stacks: {
          type: "vision",
          element: "same_excluded",
        },
        targetAttribute: "em",
      },
      {
        base: 6,
        increment: 4,
        stacks: {
          type: "vision",
          element: "different",
        },
        targetAttribute: "own_element",
      },
    ],
    buffs: [
      {
        index: 1,
        affect: EModAffect.TEAMMATE,
        description: 1,
        base: 38,
        increment: 2,
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 122,
    name: "Kagura's Verity",
    icon: "b/b7/Weapon_Kagura%27s_Verity",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg_", scale: "14.4%" },
    passiveName: "Kagura Dance of the Sacred Sakura",
    description: {
      pots: [
        `Gains the Kagura Dance effect when using an Elemental Skill, causing the Elemental Skill DMG of the character
        wielding this weapon to increase by {0}% for 16s. Max 3 stacks. This character will gain {0}% All Elemental DMG
        Bonus when they possess 3 stacks.`,
      ],
      seeds: [9],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        buffBonuses: [
          {
            base: 9,
            stacks: {
              type: "input",
            },
            targetAttPatt: "ES.pct_",
          },
          {
            checkInput: 3,
            base: 9,
            targetAttribute: [...VISION_TYPES],
          },
        ],
      },
    ],
  },
  {
    code: 34,
    name: "Everlasting Moonglow",
    icon: "e/e1/Weapon_Everlasting_Moonglow",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "hp_", scale: "10.8%" },
    passiveName: "Byakuya Kougetsu",
    description: {
      pots: [
        `Healing Bonus increased by {0}%, Normal Attack DMG is increased by {1}% of the Max HP of the character
        equipping this weapon. For 12s after using an Elemental Burst, Normal Attacks that hit opponents will restore
        0.6 Energy. Energy can be restored this way once every 0.1s.`,
      ],
      seeds: [7.5, { base: 0.5, increment: 0.5 }],
    },
    autoBuffs: [
      {
        base: 7.5,
        targetAttribute: "healB_",
      },
      {
        base: 0.75,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.01,
        },
        targetAttPatt: "NA.flat",
      },
    ],
  },
  {
    code: 31,
    name: "Skyward Atlas",
    icon: "3/33/Weapon_Skyward_Atlas",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "atk_", scale: "7.2%" },
    passiveName: "Wandering Clouds",
    description: {
      pots: [
        `Increases Elemental DMG Bonus by {0}%. Normal Attack hits have a 50% chance to earn the favor of the clouds.
        which actively seek out nearby opponents to attack for 15s, dealing {1}% ATK DMG. Can only occur once every
        30s.`,
      ],
      seeds: [9, { base: 120, seedType: "dull" }],
    },
    autoBuffs: [
      {
        base: 9,
        targetAttribute: [...VISION_TYPES],
      },
    ],
  },
  {
    code: 32,
    name: "Lost Prayer to the Sacred Winds",
    icon: "9/98/Weapon_Lost_Prayer_to_the_Sacred_Winds",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate_", scale: "7.2%" },
    passiveName: "Boundless Blessing",
    description: {
      pots: [
        `Increases Movement SPD by 10%.`,
        `When in battle, gain an {0}% Elemental DMG Bonus every 4s. Max 4 stacks.`,
        `Lasts until the character falls or leaves combat.`,
      ],
      seeds: [6],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        base: 6,
        stacks: {
          type: "input",
        },
        targetAttribute: [...VISION_TYPES],
      },
    ],
  },
  {
    code: 33,
    name: "Memory of Dust",
    icon: "c/ca/Weapon_Memory_of_Dust",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
];

export default goldCatalysts;
