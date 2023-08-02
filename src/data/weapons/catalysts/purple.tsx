import type { AppWeapon } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import {
  blackcliffSeries,
  desertSeries,
  dragonspinePassive,
  favoniusPassive,
  royalSeries,
  sacrificialPassive,
} from "../series";

const purpleCatalysts: AppWeapon[] = [
  {
    code: 162,
    name: "Flowing Purity",
    icon: "https://images2.imgbox.com/56/62/FXT7IK0o_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passive: {
      name: "",
      description: `When using an Elemental Skill, All Elemental DMG Bonus will be increased by {0}% for 12s, and a
      Bond of Life worth 24% of Max HP will be granted. This effect can be triggered once every 10s. When the Bond of
      Life is cleared, every 1,000 HP cleared in the process will provide {1}% All Elemental DMG Bonus. Up to a maximum
      of {2}% All Elemental DMG can be gained this way. This effect lasts 12s. Bond of Life: Absorbs healing for the
      character based on its base value, and clears after healing equal to this value is obtained.`,
      seeds: [6, 1.5, { base: 9, dull: true }],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            When using an Elemental Skill, <Green>All Elemental DMG Bonus</Green> will be increased by{" "}
            <Green b>{6 + refi * 2}%</Green> for 12s
          </>
        ),
        base: 6,
        targetAttribute: [...VISION_TYPES],
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            When the Bond of Life is cleared, every 1,000 HP cleared in the process will provide{" "}
            <Green b>{1.5 + refi * 0.5}%</Green> <Green>All Elemental DMG Bonus</Green>. Up to a maximum of{" "}
            <Rose>{9 + refi * 3}%</Rose> All Elemental DMG can be gained this way. This effect lasts 12s.
          </>
        ),
        base: 1.5,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.00024,
        },
        targetAttribute: [...VISION_TYPES],
        max: 9,
      },
    ],
  },
  {
    code: 161,
    name: "Sacrificial Jade",
    icon: "https://images2.imgbox.com/80/94/Ke393kt9_o.png",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "cRate_", scale: "8%" },
    passive: {
      name: "",
      description: `When not on the field for more than 6s, Max HP will be increased by {0}% and Elemental Mastery will
      be increased by {1}. These effects will be canceled after the wielder has been on the field for 6s.`,
      seeds: [15, 60],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            When not on the field for more than 6s, <Green>Max HP</Green> will be increased by{" "}
            <Green b>{15 + refi * 5}%</Green> and <Green>Elemental Mastery</Green> will be increased by{" "}
            <Green b>{60 + refi * 20}</Green>. These effects will be canceled after the wielder has been on the field
            for 6s.
          </>
        ),
        buffBonuses: [
          {
            base: 15,
            targetAttribute: "hp_",
          },
          {
            base: 60,
            targetAttribute: "em",
          },
        ],
      },
    ],
  },
  {
    code: 144,
    name: "Wandering Evenstar",
    icon: "4/44/Weapon_Wandering_Evenstar",
    ...desertSeries,
  },
  {
    code: 137,
    name: "Fruit of Fulfillment",
    icon: "9/98/Weapon_Fruit_of_Fulfillment",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passive: {
      name: "Full Circle",
      description: `Obtain the "Wax and Wane" effect after an Elemental Reaction is triggered, gaining {0} Elemental
      Mastery while losing 5% ATK. For every 0.3s, 1 stack of Wax and Wane can be gained. Max 5 stacks. For every 6s
      that go by without an Elemental Reaction being triggered, 1 stack will be lost. This effect can be triggered even
      when the character is off-field.`,
      seeds: [{ base: 21, increment: 3 }],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Obtain the "Wax and Wane" effect after an Elemental Reaction is triggered, gaining{" "}
            <Green b>{21 + refi * 3}</Green> <Green>Elemental Mastery</Green> while losing 5% ATK. For every 0.3s, 1
            stack of Wax and Wane can be gained. Max <Rose>5</Rose> stacks.
          </>
        ),
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        stacks: {
          type: "input",
        },
        buffBonuses: [
          {
            base: 21,
            increment: 3,
            targetAttribute: "em",
          },
          {
            base: -5,
            increment: 0,
            targetAttribute: "atk_",
          },
        ],
      },
    ],
  },
  {
    code: 123,
    name: "Oathsworn Eye",
    icon: "a/af/Weapon_Oathsworn_Eye",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passive: {
      name: "People of the Faltering Light",
      description: "Increases Energy Recharge by {0}% for 10s after using an Elemental Skill.",
      seeds: [18],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Increases <Green>Energy Recharge</Green> by <Green b>{18 + refi * 6}%</Green> for 10s after using an
            Elemental Skill.
          </>
        ),
        base: 18,
        targetAttribute: "er_",
      },
    ],
  },
  {
    code: 37,
    name: "Wine and Song",
    icon: "c/c6/Weapon_Wine_and_Song",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passive: {
      name: "Ever-Changing",
      description: `Hitting an opponent with a Normal Attack decreases the Stamina consumption of Sprint or Alternate
      sprint by {0}% for 5s. Using a Sprint or Alternate Sprint ability increases ATK by {1}% for 5s.`,
      seeds: [{ base: 12, increment: 2, dull: true }, 15],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Using a Sprint or Alternate Sprint ability increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green>{" "}
            for 5s.
          </>
        ),
        base: 15,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 38,
    name: "Hakushin Ring",
    icon: "e/ee/Weapon_Hakushin_Ring",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passive: {
      name: "Sakura Saiguu",
      description: `After the character equipped with this weapon triggers an Electro elemental reaction, nearby party
      members of an Elemental Type involved in the elemental reaction receive a {0}% Elemental DMG Bonus for their
      element, lasting 6s. Elemental Bonuses gained in this way cannot be stacked.`,
      seeds: [7.5],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        desc: ({ refi }) => (
          <>
            After the character equipped with this weapon triggers an Electro elemental reaction, nearby party members
            of an Elemental Type involved in the elemental reaction receive a <Green b>{7.5 + refi * 2.5}%</Green>{" "}
            <Green>Elemental DMG Bonus for their element</Green>, lasting 6s. Elemental Bonuses gained in this way
            cannot be stacked.
          </>
        ),
        base: 7.5,
        targetAttribute: "own_element",
      },
    ],
  },
  {
    code: 39,
    name: "Royal Grimoire",
    icon: "9/99/Weapon_Royal_Grimoire",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...royalSeries,
  },
  {
    code: 40,
    name: "Mappa Mare",
    icon: "4/4d/Weapon_Mappa_Mare",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
    passive: {
      name: "Infusion Scroll",
      description: `Triggering an Elemental reaction grants a {0}% Elemental DMG Bonus for 10s. Max 2 stacks.`,
      seeds: [6],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Triggering an Elemental reaction grants a <Green b>{6 + refi * 2}%</Green>{" "}
            <Green>Elemental DMG Bonus</Green> for 10s. Max <Rose>2</Rose> stacks.
          </>
        ),
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
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
    code: 41,
    name: "The Widsith",
    icon: "f/f0/Weapon_The_Widsith",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg_", scale: "12%" },
    passive: {
      name: "Debut",
      description: `When a character takes the field, they will gain a random theme song for 10s. This can only occur
      once every 30s. Recitative: ATK is increased by {0}%. Aria: increases all Elemental DMG by {1}%. Interlude:
      Elemental Mastery is increased by {2}.`,
      seeds: [45, 36, 180],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            When a character takes the field, they will gain a random theme song for 10s. This can only occur once every
            30s. Recitative: <Green>ATK</Green> is increased by <Green b>{45 + refi * 15}%</Green>. Aria: increases{" "}
            <Green>all Elemental DMG</Green> by <Green b>{36 + refi * 12}%</Green>. Interlude:{" "}
            <Green>Elemental Mastery</Green> is increased by <Green b>{180 + refi * 60}</Green>.
          </>
        ),
        inputConfigs: [
          {
            label: "Theme Song",
            type: "select",
            initialValue: 0,
            options: ["Recitative", "Aria", "Interlude"],
          },
        ],
        buffBonuses: [
          {
            checkInput: 0,
            base: 45,
            targetAttribute: "atk_",
          },
          {
            checkInput: 1,
            base: 36,
            targetAttribute: [...VISION_TYPES],
          },
          {
            checkInput: 2,
            base: 180,
            targetAttribute: "em",
          },
        ],
      },
    ],
  },
  {
    code: 42,
    name: "Frostbearer",
    icon: "1/1c/Weapon_Frostbearer",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passive: dragonspinePassive,
  },
  {
    code: 43,
    name: "Solar Pearl",
    icon: "f/fc/Weapon_Solar_Pearl",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passive: {
      name: "Solar Shine",
      description: `Normal Attack hits increase Elemental Skill and Elemental Burst DMG by {0}% for 6s. Likewise,
      Elemental Skill or Elemental Burst hits increase Normal Attack DMG by {0}% for 6s.`,
      seeds: [15],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Normal Attack hits increase <Green>Elemental Skill</Green> and <Green>Elemental Burst DMG</Green> by{" "}
            <Green b>{15 + refi * 5}%</Green> for 6s.
          </>
        ),
        base: 15,
        targetAttPatt: ["ES.pct_", "EB.pct_"],
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Likewise, Elemental Skill or Elemental Burst hits increase <Green>Normal Attack DMG</Green> by{" "}
            <Green b>{15 + refi * 5}%</Green> for 6s.
          </>
        ),
        base: 15,
        targetAttPatt: "NA.pct_",
      },
    ],
  },
  {
    code: 44,
    name: "Prototype Amber",
    icon: "2/2a/Weapon_Prototype_Amber",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "hp_", scale: "9%" },
    passive: {
      name: "Gilding",
      description: `Using an Elemental Burst regenerates {0} Energy every 2s for 6s. All party members will regenerate
      {0} HP every 2s for this duration.`,
      seeds: [{ base: 3.5, increment: 0.5 }],
    },
  },
  {
    code: 45,
    name: "Favonius Codex",
    icon: "3/36/Weapon_Favonius_Codex",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passive: favoniusPassive,
  },
  {
    code: 46,
    name: "Blackcliff Agate",
    icon: "a/a6/Weapon_Blackcliff_Agate",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg_", scale: "12%" },
    ...blackcliffSeries,
  },
  {
    code: 47,
    name: "Dodoco Tales",
    icon: "5/51/Weapon_Dodoco_Tales",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passive: {
      name: "Dodoventure!",
      description: `Normal Attack hits on opponents increase Charged Attack DMG by {0}% for 6s. Charged Attack hits on
      opponents increase ATK by {1}% for 6s`,
      seeds: [12, 6],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Normal Attack hits on opponents increase <Green>Charged Attack DMG</Green> by{" "}
            <Green b>{12 + refi * 4}%</Green> for 6s.
          </>
        ),
        base: 12,
        targetAttPatt: "CA.pct_",
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Charged Attack hits on opponents increase <Green>ATK</Green> by <Green b>{6 + refi * 2}%</Green> for 6s.
          </>
        ),
        base: 6,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 48,
    name: "Eye of Perception",
    icon: "6/6c/Weapon_Eye_of_Perception",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passive: {
      name: "Echo",
      description: `Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception, dealing {0}% ATK as DMG.
      This bolt can bounce between opponents a maximum of 4 times. This effect can occur once every {1}s.`,
      seeds: [
        { base: 210, increment: 30, dull: true },
        { base: 13, increment: -1, dull: true },
      ],
    },
  },
  {
    code: 49,
    name: "Sacrificial Fragments",
    icon: "6/6c/Weapon_Sacrificial_Fragments",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "em", scale: "48" },
    passive: sacrificialPassive,
  },
];

export default purpleCatalysts;
