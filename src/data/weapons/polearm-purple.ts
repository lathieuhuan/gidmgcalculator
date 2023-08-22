import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import {
  baneSeries2,
  blackcliffSeries,
  dragonspinePassive,
  favoniusPassive,
  fontaineSeries1,
  lithicSeries,
  royalSeries,
  watatsumiSeries,
} from "./series";

const purplePolearms: AppWeapon[] = [
  {
    code: 171,
    beta: true,
    name: "Prospector's Drill",
    icon: "https://images2.imgbox.com/c1/fd/i7yS4aCy_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...fontaineSeries1,
  },
  {
    code: 160,
    name: "Rightful Reward",
    icon: "https://images2.imgbox.com/d8/99/aC6TxTrF_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "hp_", scale: "6%" },
    passiveName: "Tip of the Spear",
    descriptions: [
      `When the wielder is healed, restore {6^} Energy. This effect can be triggered once every 10s, and can occur
      even when the character is not on the field.`,
    ],
  },
  {
    code: 159,
    name: "Ballad of the Fjords",
    icon: "https://images2.imgbox.com/85/5a/qt8NiEXW_o.png",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passiveName: "Tales of the Tundra",
    descriptions: [
      `When there are at least 3 different Elemental Types in your party, {Elemental Mastery}#[k] will be increased by
      {90^}#[v].`,
    ],
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
    passiveName: "The Wind Unattained",
    descriptions: [
      `Within 10s after an Elemental Reaction is triggered, {ATK}#[k] is increased by {9^%}#[v] and
      {Elemental Mastery}#[k] is increased by {36^}#[v].`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        wpBonuses: [
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
    passiveName: "Stillwood Moonshadow",
    descriptions: [
      `After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be
      created around the character for a maximum of 10s.`,
      `When picked up, the Leaf will grant the character {12^%}#[v] {ATK}#[k] for 12s.`,
      `Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on
      the field.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.ONE_UNIT,
        description: 1,
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
    passiveName: "Samurai Conduct",
    descriptions: [
      `Increases {Elemental Skill DMG}#[k] by {4.5^%}#[v]. After Elemental Skill hits an opponent, the character loses
      3 Energy but regenerates {2.5^0.5} Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered
      even when the character is not on the field.`,
    ],
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
    passiveName: "Shanty",
    descriptions: [
      `Increases {Elemental Burst DMG}#[k] by {12^%}#[v] and {Elemental Burst CRIT Rate}#[k] by {4.5^%}#[v].`,
    ],
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
    ...dragonspinePassive,
  },
  {
    code: 86,
    name: "Crescent Pike",
    icon: "4/4c/Weapon_Crescent_Pike",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "phys", scale: "7.5%" },
    passiveName: "Infusion Needle",
    descriptions: [
      `After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal an additional {15^}% ATK as DMG for
      5s.`,
    ],
  },
  {
    code: 91,
    name: "Prototype Starglitter",
    icon: "7/7e/Weapon_Prototype_Starglitter",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passiveName: "Magic Affinity",
    descriptions: [
      `After using an Elemental Skill, increases {Normal and Charged Attack DMG}#[k] by {6^%}#[v] for 12s. Max {2}#[m]
      stacks.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
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
    passiveName: "Gladiator",
    descriptions: [
      `If there are at least 2 opponents nearby, {ATK}#[k] is increased by {12^%}#[v] and {DEF}#[k] is increased by
      {12^%}#[v]. If there are fewer than 2 opponents nearby, {ATK}#[k] is increased by {18^%}#[v].`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            label: "Fewer than 2 opponents",
            type: "check",
          },
        ],
        wpBonuses: [
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
    ...favoniusPassive,
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
