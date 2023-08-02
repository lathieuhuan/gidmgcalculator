import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import {
  baneSeries2,
  blackcliffSeries,
  dragonspinePassive,
  favoniusPassive,
  lithicSeries,
  royalSeries,
  watatsumiSeries,
} from "../series";

const purplePolearms: AppWeapon[] = [
  {
    code: 160,
    name: "Rightful Reward",
    icon: "https://images2.imgbox.com/d8/99/aC6TxTrF_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "hp_", scale: "6%" },
    passive: {
      name: "",
      description: `When the wielder is healed, restore {0} Energy. This effect can be triggered once every 10s, and
      can occur even when the character is not on the field.`,
      seeds: [{ base: 6, dull: true }],
    },
  },
  {
    code: 159,
    name: "Ballad of the Fjords",
    icon: "https://images2.imgbox.com/85/5a/qt8NiEXW_o.png",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passive: {
      name: "",
      description: `When there are at least 3 different Elemental Types in your party, Elemental Mastery will be
      increased by {0}.`,
      seeds: [90],
    },
    autoBuffs: [
      {
        base: 90,
        checkInput: {
          source: "various_vision",
          compareValue: 3,
          compareType: "atleast",
        },
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 141,
    name: "Missive Windspear",
    icon: "9/9b/Weapon_Missive_Windspear",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passive: {
      name: "The Wind Unattained",
      description: `Within 10s after an Elemental Reaction is triggered, ATK is increased by {0}% and Elemental Mastery
      is increased by {1}.`,
      seeds: [9, 36],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Within 10s after an Elemental Reaction is triggered, <Green>ATK</Green> is increased by{" "}
            <Green b>{9 + refi * 3}%</Green> and <Green>Elemental Mastery</Green> is increased by{" "}
            <Green b>{36 + refi * 12}</Green>.
          </>
        ),
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
    code: 135,
    name: "Moonpiercer",
    icon: "a/a4/Weapon_Moonpiercer",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
    passive: {
      name: "Stillwood Moonshadow",
      description: `After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of
      Revival will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the
      character {0}% ATK for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered
      if the character is not on the field.`,
      seeds: [12],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.ONE_UNIT,
        desc: ({ refi }) => (
          <>
            When picked up, the Leaf will grant the character <Green b>{12 + refi * 4}%</Green> <Green>ATK</Green> for
            12s.
          </>
        ),
        base: 12,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 85,
    name: "Wavebreaker's Fin",
    icon: "6/66/Weapon_Wavebreaker%27s_Fin",
    rarity: 4,
    mainStatScale: "45",
    subStat: { type: "atk_", scale: "3%" },
    ...watatsumiSeries,
  },
  {
    code: 87,
    name: "Lithic Spear",
    icon: "2/2a/Weapon_Lithic_Spear",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...lithicSeries,
  },
  {
    code: 88,
    name: "Kitain Cross Spear",
    icon: "1/13/Weapon_Kitain_Cross_Spear",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
    passive: {
      name: "Samurai Conduct",
      description: `Increases Elemental Skill DMG by {0}%. After Elemental Skill hits an opponent, the character loses
      3 Energy but regenerates {1} Energy every 2s for the next 6s. This effect can occur once every 10s. Can be
      triggered even when the character is not on the field.`,
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
    code: 92,
    name: `"The Catch"`,
    icon: "f/f5/Weapon_The_Catch",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passive: {
      name: "Shanty",
      description: `Increases Elemental Burst DMG by {0}% and Elemental Burst CRIT Rate by {1}%.`,
      seeds: [12, 4.5],
    },
    autoBuffs: [
      {
        base: 12,
        targetAttPatt: "EB.pct_",
      },
      {
        base: 4.5,
        targetAttPatt: "EB.cRate_",
      },
    ],
  },
  {
    code: 94,
    name: "Dragonspine Spear",
    icon: "1/1a/Weapon_Dragonspine_Spear",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "phys", scale: "15%" },
    passive: dragonspinePassive,
  },
  {
    code: 86,
    name: "Crescent Pike",
    icon: "4/4c/Weapon_Crescent_Pike",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "phys", scale: "7.5%" },
    passive: {
      name: "Infusion Needle",
      description: `After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal an additional {0}% ATK
      as DMG for 5s.`,
      seeds: [{ base: 15, dull: true }],
    },
  },
  {
    code: 91,
    name: "Prototype Starglitter",
    icon: "7/7e/Weapon_Prototype_Starglitter",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passive: {
      name: "Magic Affinity",
      description: `After using an Elemental Skill, increases Normal and Charged Attack DMG by {0}% for 12s. Max 2
      stacks.`,
      seeds: [6],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            After using an Elemental Skill, increases <Green>Normal and Charged Attack DMG</Green> by{" "}
            <Green b>{6 + refi * 2}%</Green> for 12s. Max <Rose>2</Rose> stacks.
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
        targetAttPatt: ["NA.pct_", "CA.pct_"],
      },
    ],
  },
  {
    code: 89,
    name: "Royal Spear",
    icon: "f/fd/Weapon_Royal_Spear",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...royalSeries,
  },
  {
    code: 93,
    name: "Blackcliff Pole",
    icon: "d/d5/Weapon_Blackcliff_Pole",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg_", scale: "12%" },
    ...blackcliffSeries,
  },
  {
    code: 95,
    name: "Deathmatch",
    icon: "6/69/Weapon_Deathmatch",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "cRate_", scale: "8%" },
    passive: {
      name: "Gladiator",
      description: `If there are at least 2 opponents nearby, ATK is increased by {0}% and DEF is increased by {0}%. If
      there are fewer than 2 opponents nearby, ATK is increased by {1}%.`,
      seeds: [12, 18],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            If there are at least 2 opponents nearby, <Green>ATK</Green> is increased by{" "}
            <Green b>{12 + refi * 4}%</Green> and <Green>DEF</Green> is increased by <Green b>{12 + refi * 4}%</Green>.
            If there are fewer than 2 opponents nearby, <Green>ATK</Green> is increased by{" "}
            <Green b>{18 + refi * 6}%</Green>.
          </>
        ),
        inputConfigs: [
          {
            label: "Fewer than 2 opponents",
            type: "check",
          },
        ],
        buffBonuses: [
          {
            checkInput: 1,
            base: 18,
            targetAttribute: "atk_",
          },
          {
            checkInput: 0,
            base: 12,
            targetAttribute: ["atk_", "def_"],
          },
        ],
      },
    ],
  },
  {
    code: 90,
    name: "Favonius Lance",
    icon: "5/57/Weapon_Favonius_Lance",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passive: favoniusPassive,
  },
  {
    code: 96,
    name: "Dragon's Bane",
    icon: "2/24/Weapon_Dragon%27s_Bane",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "em", scale: "48" },
    ...baneSeries2("Flame and Water", "Hydro or Pyro"),
  },
];

export default purplePolearms;
