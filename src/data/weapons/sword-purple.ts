import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import {
  baneSeries2,
  blackcliffSeries,
  favoniusPassive,
  fontaineSeries2,
  royalSeries,
  sacrificialPassive,
} from "./series";

const purpleSwords: AppWeapon[] = [
  {
    code: 173,
    beta: true,
    name: "The Dock",
    icon: "",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "hp_", scale: "9%" },
    ...fontaineSeries2,
  },
  {
    code: 165,
    name: "Crossing of Fleuve Cendre",
    icon: "https://images2.imgbox.com/75/99/6Ym3kHce_o.png",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passiveName: "Ironbone",
    descriptions: [
      `Increases {Elemental Skill CRIT Rate}#[k] by {6^%}#[v]. Increases {Energy Recharge}#[k] by {12^%}#[v] for 5s
      after using an Elemental Skill.`,
    ],
    autoBuffs: [
      {
        base: 6,
        targetAttPatt: "ES.cRate_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 12,
        targetAttribute: "er_",
      },
    ],
  },
  {
    code: 156,
    name: "Finale of the Deep",
    icon: "https://images2.imgbox.com/11/aa/6uT27dLW_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passiveName: "An End Sublime",
    descriptions: [
      `When using an Elemental Skill, {ATK}#[k] will be increased by {9^%}#[v] for 15s`,
      `, and a Bond of Life worth 25% of Max HP will be granted. This effect can be triggered once every 10s.`,
      `When the Bond of Life is cleared, a maximum of {112.5^}#[m] ATK will be gained based on {1.8^%}#[v] of the total
      amount of the Life Bond cleared, lasting for 15s.`,
      `Bond of Life: Absorbs healing for the character based on its base value, and clears after healing equal to this
      value is obtained.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 9,
        targetAttribute: "atk_",
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 2,
        base: 0.018,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.25,
        },
        targetAttribute: "atk",
        max: 112.5,
      },
    ],
  },
  {
    code: 155,
    name: "Wolf-Fang",
    icon: "https://images2.imgbox.com/e3/69/glrRYvtm_o.png",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passiveName: "Northwind Wolf",
    descriptions: [
      `{DMG}#[k] dealt by {Elemental Skill and Elemental Burst}#[k] will be increased by {12^%}#[v]. When an Elemental
      Skill hits an opponent, its {CRIT Rate}#[k] will be increased by {1.5^%}#[v]. When an Elemental Burst hits an
      opponent, its {CRIT Rate}#[k] will be increased by {1.5^%}#[v]. Both of these effects last 10s separately, have
      {4}#[m] max stacks, and can be triggered once every 0.1s.`,
    ],
    autoBuffs: [
      {
        base: 12,
        targetAttPatt: ["ES.pct_", "EB.pct_"],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: `When an Elemental Skill hits an opponent, its {CRIT Rate}#[k] will be increased by {1.5^%}#[v].
        Max {4}#[m] stacks.`,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        base: 1.5,
        stacks: {
          type: "input",
        },
        targetAttPatt: "ES.cRate_",
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        description: `When an Elemental Burst hits an opponent, its {CRIT Rate}#[k] will be increased by {1.5^%}#[v].
        Max {4}#[m] stacks.`,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        base: 1.5,
        stacks: {
          type: "input",
        },
        targetAttPatt: "EB.cRate_",
      },
    ],
  },
  {
    code: 149,
    name: "Toukabou Shigure",
    icon: "b/b5/Weapon_Toukabou_Shigure",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    passiveName: "Kaidan: Rainfall Earthbinder",
    descriptions: [
      `After an attack hits opponents, it will inflict an instance of Cursed Parasol upon one of them for 10s. This
      effect can be triggered once every 15s. If this opponent is taken out during Cursed Parasol's duration, Cursed
      Parasol's CD will be refreshed immediately.`,
      `The character wielding this weapon will deal {12^%}#[v] more {DMG}#[k] to the opponent affected by Cursed Parasol.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 12,
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 146,
    name: "Xiphos' Moonlight",
    icon: "8/8a/Weapon_Xiphos%27_Moonlight",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    passiveName: "Jinni's Whisper",
    descriptions: [
      `The following effect will trigger every 10s: the equipping character will gain {0.027^%}#[v] {Energy Recharge}#[k]
      for each point of {Elemental Mastery}#[k] they possess for 12s, with nearby party members gaining {30%}#[v] of this
      buff for the same duration.`,
      `Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the
      character is not on the field.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 0.027,
        stacks: {
          type: "attribute",
          field: "em",
        },
        targetAttribute: "er_",
      },
      {
        index: 1,
        affect: EModAffect.TEAMMATE,
        inputConfigs: [
          {
            label: "Elemental Mastery",
            type: "text",
          },
        ],
        base: 0.0081,
        stacks: {
          type: "input",
        },
        targetAttribute: "er_",
      },
    ],
  },
  {
    code: 142,
    name: "Kagotsurube Isshin",
    icon: "9/96/Weapon_Kagotsurube_Isshin",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "Isshin Art Clarity",
    descriptions: [
      `When a Normal, Charged, or Plunging Attack hits an opponent, it will whip up a Hewing Gale, dealing AoE DMG
      equal to 180% of ATK and increasing {ATK}#[k] by {15%}#[v] for 8s. This effect can be triggered once every 8s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 15,
        increment: 0,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 134,
    name: "Sapwood Blade",
    icon: "0/00/Weapon_Sapwood_Blade",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passiveName: "Forest Sanctuary",
    descriptions: [
      `After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness
      will be created around the character for a maximum of 10s.`,
      `When picked up, the Leaf will grant the character {45^}#[v] {Elemental Mastery}#[k] for 12s.`,
      `Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on
      the field. The Leaf of Consciousness' effect cannot stack.`,
    ],
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
    code: 109,
    name: "The Alley Flash",
    icon: "8/83/Weapon_The_Alley_Flash",
    rarity: 4,
    mainStatScale: "45",
    subStat: { type: "em", scale: "12" },
    passiveName: "Itinerant Hero",
    descriptions: [
      `Increases {DMG}#[k] dealt by the character equipping this weapon by {9^%}#[v]. Taking DMG disables this effect for 5s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 9,
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 110,
    name: "Blackcliff Longsword",
    icon: "6/6f/Weapon_Blackcliff_Longsword",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "cDmg_", scale: "8%" },
    ...blackcliffSeries,
  },
  {
    code: 111,
    name: "Prototype Rancour",
    icon: "e/ef/Weapon_Prototype_Rancour",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "phys", scale: "7.5%" },
    passiveName: "Smashed Stone",
    descriptions: [
      `On hit, Normal or Charged Attacks increase {ATK}#[k] and {DEF}#[k] by {3^%}#[v] for 6s. Max {4}#[m] stacks. Can
      only occur once every 0.3s.`,
    ],
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
        base: 3,
        stacks: {
          type: "input",
        },
        targetAttribute: ["atk_", "def_"],
      },
    ],
  },
  {
    code: 112,
    name: "Festering Desire",
    icon: "7/70/Weapon_Festering_Desire",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passiveName: "Undying Admiration",
    descriptions: [
      `Increases {Elemental Skill DMG}#[k] by {12^%}#[v] and {Elemental Skill CRIT Rate}#[k] by {4.5^%}#[v].`,
    ],
    autoBuffs: [
      {
        base: 12,
        targetAttPatt: "ES.pct_",
      },
      {
        base: 6,
        targetAttPatt: "ES.cRate_",
      },
    ],
  },
  {
    code: 113,
    name: "The Black Sword",
    icon: "c/cf/Weapon_The_Black_Sword",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passiveName: "Justice",
    descriptions: [
      `Increases {DMG}#[k] dealt by {Normal and Charged Attacks}#[k] by {15^%}#[v]. Additionally, regenerates {50^10}% of ATK as HP when
      Normal and Charged Attacks score a CRIT Hit. This effect can occur once every 5s.`,
    ],
    autoBuffs: [
      {
        base: 15,
        targetAttPatt: ["NA.pct_", "CA.pct_"],
      },
    ],
  },
  {
    code: 114,
    name: "The Flute",
    icon: "6/63/Weapon_The_Flute",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "Chord",
    descriptions: [
      `Normal or Charged Attacks grant a Harmonic on hits. Gaining 5 Harmonics triggers the power of music and deals
      {75^}% ATK DMG to surrounding enemies. Harmonics last up to 30s, and a maximum of 1 can be gained every 0.5s.`,
    ],
  },
  {
    code: 115,
    name: "Royal Longsword",
    icon: "c/cd/Weapon_Royal_Longsword",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...royalSeries,
  },
  {
    code: 116,
    name: "Lion's Roar",
    icon: "e/e6/Weapon_Lion%27s_Roar",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...baneSeries2("Fire and Thunder", "Pyro or Electro"),
  },
  {
    code: 117,
    name: "Iron Sting",
    icon: "3/35/Weapon_Iron_Sting",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    passiveName: "Infusion Stinger",
    descriptions: [
      `Dealing Elemental DMG increases all {DMG}#[k] by {4.5^%}#[v] for 6s. Max {2}#[m] stacks. Can only occur once
      every 1s.`,
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
        base: 4.5,
        stacks: {
          type: "input",
        },
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 118,
    name: "Amenoma Kageuchi",
    icon: "e/ea/Weapon_Amenoma_Kageuchi",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Iwakura Succession",
    descriptions: [
      `After casting an Elemental Skill, gain 1 Succession Seed. This effect can be triggered once every 5s. The
      Succession Seed lasts for 30s. Up to 3 Succession Seeds may exist simultaneously. After using an Elemental
      Burst, all Succession Seeds are consumed and after 2s, the character regenerates {4.5^} Energy for each seed
      consumed.`,
    ],
  },
  {
    code: 119,
    name: "Favonius Sword",
    icon: "9/90/Weapon_Favonius_Sword",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er_", scale: "13.3%" },
    ...favoniusPassive,
  },
  {
    code: 120,
    name: "Sacrificial Sword",
    icon: "a/a0/Weapon_Sacrificial_Sword",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er_", scale: "13.3%" },
    ...sacrificialPassive,
  },
  {
    code: 121,
    name: "Cinnabar Spindle",
    icon: "d/dc/Weapon_Cinnabar_Spindle",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "def_", scale: "15%" },
    passiveName: "Spotless Heart",
    descriptions: [
      `{Elemental Skill DMG}#[k] is increased by {30^%}#[v] of {DEF}#[k]. The effect will be triggered no more than once
      every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.`,
    ],
    autoBuffs: [
      {
        base: 0.3,
        stacks: {
          type: "attribute",
          field: "def",
        },
        targetAttPatt: "ES.flat",
      },
    ],
  },
];

export default purpleSwords;
