import type { AppWeapon } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { liyueSeries } from "../series";

const mistsplitterBuffValuesByStack = (refi: number) => [6 + refi * 2, 12 + refi * 4, 21 + refi * 7];

const goldSwords: AppWeapon[] = [
  {
    code: 148,
    name: "Light of Foliar Incision",
    icon: "d/de/Weapon_Light_of_Foliar_Incision",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg_", scale: "19.2%" },
    passive: {
      name: "Whitemoon Bristle",
      description: `CRIT Rate is increased by {0}%. When Normal Attacks deal Elemental DMG, the Foliar Incision effect
      will be obtained, increasing Normal Attack and Elemental Skill DMG by {1}% of Elemental Mastery. This effect will
      disappear after 28 DMG instances or 12s. You can obtain Foliar Incision once every 12s.`,
      seeds: [3, 90],
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
        desc: ({ refi }) => (
          <>
            When Normal Attacks deal Elemental DMG, the Foliar Incision effect will be obtained, increasing{" "}
            <Green>Normal Attack and Elemental Skill DMG</Green> by <Green b>{90 + refi * 30}%</Green> of{" "}
            <Green>Elemental Mastery</Green>. This effect will disappear after <Rose>28</Rose> DMG instances or 12s.
          </>
        ),
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
    passive: {
      name: "Sunken Song of the Sands",
      description: `HP increased by {0}%. When an Elemental Skill hits opponents, you gain the Grand Hymn effect for
      20s. This effect increases the equipping character's Elemental Mastery by {1}% of their Max HP. This effect can
      trigger once every 0.3s. Max 3 stacks. When Grand Hymn effect gains 3 stacks, or when the third stack's duration
      is refreshed, the Elemental Mastery of all nearby party members will be increased by {2}% of the equipping
      character's Max HP for 20s.`,
      seeds: [15, 0.09, 0.15],
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
        desc: ({ refi }) => (
          <>
            When an Elemental Skill hits opponents, you gain the Grand Hymn effect for 20s. This effect increases the
            equipping character's <Green>Elemental Mastery</Green> by <Green b>{(9 + refi * 3) / 100}%</Green> of their{" "}
            <Green>Max HP</Green>. This effect can trigger once every 0.3s. Max <Rose>3</Rose> stacks.
          </>
        ),
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
        desc: ({ refi }) => (
          <>
            When Grand Hymn effect gains 3 stacks, or when the third stack's duration is refreshed, the{" "}
            <Green>Elemental Mastery</Green> of all nearby party members will be increased by{" "}
            <Green b>{(15 + refi * 5) / 100}%</Green> of the equipping character's <Green>Max HP</Green> for 20s.
          </>
        ),
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
    passive: {
      name: "Honed Flow",
      description: `Obtain {0}% All Elemental DMG Bonus. When other nearby party members use Elemental Skills, the
      character equipping this weapon will gain 1 Wavespike stack. Max 2 stacks. This effect can be triggered once
      every 0.3s. When the character equipping this weapon uses an Elemental Skill, all stacks of Wavespike will be
      consumed to gain Ripping Upheaval. Each stack of Wavepike consumed will increase Normal Attack DMG by {1}%
      for 8s.`,
      seeds: [9, 15],
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
        desc: ({ refi }) => (
          <>
            <Green>Each stack</Green> of Wavepike consumed will increase <Green>Normal Attack DMG</Green> by{" "}
            <Green b>{15 + refi * 5}%</Green> for 8s.
          </>
        ),
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
    passive: {
      name: "Mistsplitter's Edge",
      description: `Gain a {0}% Elemental DMG Bonus for every element and receive the might of Mistsplitter's Emblem.
      At stack levels 1/2/3, Mistsplitter's Emblem provides a {1}/{2}/{3}% Elemental DMG Bonus for the character's
      Elemental Type. The character will obtain 1 stack of Mistsplitter's Emblem in each of the following scenarios:
      Normal Attack deals Elemental DMG (stack lasts 5s), casting Elemental Burst (stack lasts 10s); Energy is less
      than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.`,
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
        desc: ({ refi }) => (
          <>
            At stack levels 1/2/3, Mistsplitter's Emblem provides a{" "}
            <Green b>{mistsplitterBuffValuesByStack(refi).join("/")}%</Green> Elemental DMG Bonus for the{" "}
            <Green>character's Elemental Type</Green>.
          </>
        ),
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        base: 6,
        stacks: {
          type: "input",
          maxStackBonus: 3,
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
    passive: {
      name: "Revolutionary Chorale",
      description: `A part of the "Millennial Movement" that wanders amidst the winds. Increases DMG by {0}%. When
      triggering Elemental Reactions, the character gains a Sigil of Rebellion. This effect can be triggered once every
      0.5s. When you possess 2 Sigils of Rebellion, all of them will be consumed and all nearby party members will
      obtain the "Millennial Movement: Song of Resistance" effect for 12s. "Millennial Movement: Song of Resistance"
      increases Normal, Charged, and Plunging Attack DMG by {1}% and increases ATK by {2}%. Once this effect is
      triggered, you will not gain Sigils of Rebellion for 20s. Of the many effects of the "Millennial Movement", buffs
      of the same type will not stack.`,
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
        desc: ({ refi }) => (
          <>
            "Millennial Movement: Song of Resistance" increases <Green>Normal, Charged, and Plunging Attack DMG</Green>{" "}
            by <Green b>{12 + refi * 4}%</Green> and increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green>.
            Once this effect is triggered, you will not gain Sigils of Rebellion for 20s.
          </>
        ),
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
    passive: {
      name: "Protector's Virtue",
      description: `HP increased by {0}%. Additionally, provides an ATK Bonus based on {1}% of the wielder's Max HP.`,
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
    passive: {
      name: "Falcon's Defiance",
      description: `ATK is increased by {0}%. Triggers on taking DMG: the soul of the Falcon of the West awakens,
      holding the banner of the resistance aloft, regenerating HP equal to {1}% of ATK and dealing {2}% of ATK as DMG
      to surrounding opponents. This effect can only occur once every 15s.`,
      seeds: [15, { base: 85, increment: 15, dull: true }, { base: 160, increment: 40, dull: true }],
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
    passive: {
      name: "Sky-Piercing Fang",
      description: `Crit Rate increased by {0}%. And Normal and Charged hits deal additional DMG equal to {1}% of ATK.
      Skypiercing Might lasts for 12s. Gains Skypiercing Might upon using Elemental Burst: Increases Movement SPD and
      ATK SPD by 10%.`,
      seeds: [3, { base: 15, dull: true }],
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
        desc: () => (
          <>
            Gains Skypiercing Might upon using Elemental Burst: Increases Movement SPD and <Green>ATK SPD</Green> by{" "}
            <Green b>10%</Green>.
          </>
        ),
        base: 10,
        increment: 0,
        targetAttribute: "naAtkSpd_",
      },
    ],
  },
];

export default goldSwords;
