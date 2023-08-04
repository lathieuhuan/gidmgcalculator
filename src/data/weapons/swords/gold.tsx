import type { AppWeapon } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { liyueSeries } from "../series";

const goldSwords: AppWeapon[] = [
  {
    code: 148,
    name: "Light of Foliar Incision",
    icon: "d/de/Weapon_Light_of_Foliar_Incision",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg_", scale: "19.2%" },
    passiveName: "Whitemoon Bristle",
    description: {
      pots: [
        `{CRIT Rate} is increased by {0}%.`,
        `When Normal Attacks deal Elemental DMG, the Foliar Incision effect will be obtained, increasing
        {Normal Attack and Elemental Skill DMG} by {1}% of {Elemental Mastery}.`,
        `This effect will disappear after {2} DMG instances or 12s. You can obtain Foliar Incision once every 12s.`,
      ],
      seeds: [3, 90, { max: 28, increment: 0 }],
    },
    autoBuffs: [
      {
        base: 3,
        targetAttribute: "cRate_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 0.9,
        stacks: {
          type: "attribute",
          field: "em",
        },
        targetAttPatt: ["NA.flat", "ES.flat"],
      },
    ],
  },
  {
    code: 140,
    name: "Key of Khaj-Nisut",
    icon: "5/52/Weapon_Key_of_Khaj-Nisut",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "hp_", scale: "14.4%" },
    passiveName: "Sunken Song of the Sands",
    description: {
      pots: [
        `{HP} increased by {0}%.`,
        `When an Elemental Skill hits opponents, you gain the Grand Hymn effect for 20s. This effect increases the
        equipping character's {Elemental Mastery} by {1}% of their {Max HP}. This effect can trigger once every 0.3s. Max {2}
        stacks.`,
        `When Grand Hymn effect gains 3 stacks, or when the third stack's duration is refreshed, the {Elemental Mastery}
        of all nearby party members will be increased by {3}% of the equipping character's {Max HP} for 20s.`,
      ],
      seeds: [15, 0.09, { max: 3, increment: 0 }, 0.15],
    },
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "hp_",
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
        base: 0.09,
        stacks: [
          {
            type: "attribute",
            field: "hp",
            convertRate: 0.01,
          },
          {
            type: "input",
          },
        ],
        targetAttribute: "em",
      },
      {
        index: 1,
        affect: EModAffect.TEAMMATE,
        description: 2,
        inputConfigs: [
          {
            label: "Max HP",
            type: "text",
            max: 99999,
          },
        ],
        base: 0.0015,
        stacks: {
          type: "input",
        },
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 124,
    name: "Haran Geppaku Futsu",
    icon: "8/85/Weapon_Haran_Geppaku_Futsu",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate_", scale: "7.2%" },
    passiveName: "Honed Flow",
    description: {
      pots: [
        `Obtain {0}% {All Elemental DMG Bonus}. When other nearby party members use Elemental Skills, the character
        equipping this weapon will gain 1 Wavespike stack. Max {1} stacks. This effect can be triggered once every 0.3s.
        When the character equipping this weapon uses an Elemental Skill, all stacks of Wavespike will be consumed to
        gain Ripping Upheaval.`,
        `Each stack of Wavepike consumed will increase Normal Attack DMG by {2}% for 8s.`,
      ],
      seeds: [9, { max: 2, increment: 0 }, 15],
    },
    autoBuffs: [
      {
        base: 9,
        targetAttribute: [...VISION_TYPES],
      },
    ],
    buffs: [
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        base: 15,
        stacks: {
          type: "input",
        },
        targetAttPatt: "NA.pct_",
      },
    ],
  },
  {
    code: 101,
    name: "Mistsplitter Reforged",
    icon: "0/09/Weapon_Mistsplitter_Reforged",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cDmg_", scale: "9.6%b" },
    passiveName: "Mistsplitter's Edge",
    description: {
      pots: [
        `Gain a {0}% {Elemental DMG Bonus} for every element and receive the might of Mistsplitter's Emblem.`,
        `At stack levels 1/2/3, Mistsplitter's Emblem provides a {1}/{2}/{3}% {Elemental DMG Bonus} for the
        {character's Elemental Type}.`,
        `The character will obtain 1 stack of Mistsplitter's Emblem in each of the following scenarios: Normal Attack
        deals Elemental DMG (stack lasts 5s), casting Elemental Burst (stack lasts 10s); Energy is less than 100%
        (stack disappears when Energy is full). Each stack's duration is calculated independently.`,
      ],
      seeds: [9, 6, 12, 21],
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
            max: 3,
          },
        ],
        options: [6, 12, 21],
        stacks: {
          type: "input",
        },
        targetAttribute: "own_element",
      },
    ],
  },
  {
    code: 104,
    name: "Freedom-Sworn",
    icon: "3/39/Weapon_Freedom-Sworn",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "em", scale: "43" },
    passiveName: "Revolutionary Chorale",
    description: {
      pots: [
        `A part of the "Millennial Movement" that wanders amidst the winds. Increases {DMG} by {0}%. When triggering
        Elemental Reactions, the character gains a Sigil of Rebellion. This effect can be triggered once every 0.5s.
        When you possess 2 Sigils of Rebellion, all of them will be consumed and all nearby party members will obtain
        the "Millennial Movement: Song of Resistance" effect for 12s.`,
        `"Millennial Movement: Song of Resistance" increases {Normal, Charged, and Plunging Attack DMG} by {1}% and
        increases {ATK} by {2}%. Once this effect is triggered, you will not gain Sigils of Rebellion for 20s.`,
        `Of the many effects of the "Millennial Movement", buffs of the same type will not stack.`,
      ],
      seeds: [7.5, 12, 15],
    },
    autoBuffs: [
      {
        base: 7.5,
        targetAttPatt: "all.pct_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        description: 1,
        buffBonuses: [
          {
            base: 12,
            targetAttPatt: [...NCPA_PERCENTS],
          },
          {
            base: 15,
            targetAttribute: "atk_",
          },
        ],
      },
    ],
  },
  {
    code: 106,
    name: "Primordial Jade Cutter",
    icon: "2/2a/Weapon_Primordial_Jade_Cutter",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cRate_", scale: "9.6%b" },
    passiveName: "Protector's Virtue",
    description: {
      pots: [`{HP} increased by {0}%. Additionally, provides an {ATK Bonus} based on {1}% of the wielder's {Max HP}.`],
      seeds: [15, 0.9],
    },
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "hp_",
      },
      {
        base: 0.9,
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
    code: 105,
    name: "Summit Shaper",
    icon: "c/ca/Weapon_Summit_Shaper",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
  {
    code: 102,
    name: "Aquila Favonia",
    icon: "6/6a/Weapon_Aquila_Favonia",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "phys", scale: "9%" },
    passiveName: "Falcon's Defiance",
    description: {
      pots: [
        `{ATK} is increased by {0}%. Triggers on taking DMG: the soul of the Falcon of the West awakens, holding the
        banner of the resistance aloft, regenerating HP equal to {1}% of ATK and dealing {2}% of ATK as DMG to
        surrounding opponents. This effect can only occur once every 15s.`,
      ],
      seeds: [15, { base: 85, increment: 15, seedType: "dull" }, { base: 160, increment: 40, seedType: "dull" }],
    },
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 103,
    name: "Skyward Blade",
    icon: "0/03/Weapon_Skyward_Blade",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "er_", scale: "12%" },
    passiveName: "Sky-Piercing Fang",
    description: {
      pots: [
        `{Crit Rate} increased by {0}%. And Normal and Charged hits deal additional DMG equal to {1}% of ATK. Skypiercing
        Might lasts for 12s.`,
        `Gains Skypiercing Might upon using Elemental Burst: Increases Movement SPD and {ATK SPD} by {2}%.`,
      ],
      seeds: [3, { base: 15, seedType: "dull" }, { base: 10, increment: 0 }],
    },
    autoBuffs: [
      {
        base: 3,
        targetAttribute: "cRate_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 10,
        increment: 0,
        targetAttribute: "naAtkSpd_",
      },
    ],
  },
];

export default goldSwords;
